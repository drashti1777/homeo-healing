import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { handle, HttpError, ok, readJson } from "@/lib/api";
import { RESOURCES } from "@/lib/admin-resources";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function resolve(ctx: Ctx) {
  const { resource, id } = await ctx.params;
  const def = RESOURCES[resource];
  if (!def) throw new HttpError(404, "Unknown resource");
  if (!isValidObjectId(id)) throw new HttpError(400, "Invalid id");
  return { def, resource, id };
}

export function PUT(req: Request, ctx: Ctx) {
  return handle(async () => {
    const { def, resource, id } = await resolve(ctx);
    const session = await requireRole(def.write);
    await connectDb();
    let update: Record<string, unknown>;
    if (resource === "users") {
      // Password is optional on edit; schema stays strict for every other field.
      const schema = (def.schema as z.ZodObject).extend({ password: z.string().min(12).max(200).optional().or(z.literal("")) });
      const { password, ...rest } = schema.parse(await readJson(req)) as { password?: string } & Record<string, unknown>;
      if (id === session.id && rest.role !== "admin") throw new HttpError(400, "You cannot remove your own admin role.");
      update = { ...rest };
      if (password) update.passwordHash = await bcrypt.hash(password, 12);
    } else {
      update = def.schema.parse(await readJson(req)) as Record<string, unknown>;
    }
    const ops: Record<string, unknown> = { $set: update };
    if (def.trackStatus && typeof update.status === "string") {
      const current = await def.model.findById(id).select("status").lean<{ status?: string }>();
      if (current && current.status !== update.status) {
        ops.$push = { statusHistory: { status: update.status, at: new Date(), by: session.name, note: typeof update.internalNote === "string" ? update.internalNote.slice(0, 200) : "" } };
      }
    }
    const doc = await def.model.findByIdAndUpdate(id, ops, { new: true, runValidators: true });
    if (!doc) throw new HttpError(404, "Not found");
    return ok({ ok: true });
  });
}

export function DELETE(_req: Request, ctx: Ctx) {
  return handle(async () => {
    const { def, resource, id } = await resolve(ctx);
    const session = await requireRole(def.remove);
    await connectDb();
    if (resource === "users") {
      if (id === session.id) throw new HttpError(400, "You cannot delete your own account.");
      const admins = await User.countDocuments({ role: "admin" });
      const target = await User.findById(id).lean<{ role: string }>();
      if (target?.role === "admin" && admins <= 1) throw new HttpError(400, "At least one admin must remain.");
    }
    const doc = await def.model.findByIdAndDelete(id);
    if (!doc) throw new HttpError(404, "Not found");
    return ok({ ok: true });
  });
}
