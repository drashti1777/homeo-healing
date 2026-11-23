import { handle, HttpError, ok, readJson } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Doctor, Settings } from "@/lib/models";
import { doctorSchema, settingsSchema } from "@/lib/validators";

const SINGLETONS = { doctor: { model: Doctor, schema: doctorSchema }, settings: { model: Settings, schema: settingsSchema } } as const;

type Ctx = { params: Promise<{ name: string }> };

async function resolve(ctx: Ctx) {
  const name = (await ctx.params).name as keyof typeof SINGLETONS;
  const def = SINGLETONS[name];
  if (!def) throw new HttpError(404, "Unknown resource");
  return def;
}

export function GET(_req: Request, ctx: Ctx) {
  return handle(async () => {
    const def = await resolve(ctx);
    await requireRole(["admin", "editor"]);
    await connectDb();
    return ok({ item: (await def.model.findOne({ key: "main" }).lean()) ?? {} });
  });
}

export function PUT(req: Request, ctx: Ctx) {
  return handle(async () => {
    const def = await resolve(ctx);
    await requireRole(["admin", "editor"]);
    const body = def.schema.parse(await readJson(req));
    await connectDb();
    await def.model.findOneAndUpdate({ key: "main" }, { $set: body, $setOnInsert: { key: "main" } }, { upsert: true, runValidators: true });
    return ok({ ok: true });
  });
}
