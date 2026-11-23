import bcrypt from "bcryptjs";
import { handle, HttpError, ok, readJson } from "@/lib/api";
import { RESOURCES } from "@/lib/admin-resources";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { reorderSchema } from "@/lib/validators";

type Ctx = { params: Promise<{ resource: string }> };

async function resolve(ctx: Ctx) {
  const def = RESOURCES[(await ctx.params).resource];
  if (!def) throw new HttpError(404, "Unknown resource");
  return def;
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** GET ?q=text&status=new&branch=ahmedabad&page=1  — search, exact filters (allow-listed per resource) and pagination. */
export function GET(req: Request, ctx: Ctx) {
  return handle(async () => {
    const def = await resolve(ctx);
    await requireRole(def.read);
    await connectDb();
    const url = new URL(req.url);
    const filter: Record<string, unknown> = {};
    for (const f of def.filters ?? []) {
      const v = url.searchParams.get(f);
      if (v === null || v === "") continue;
      filter[f] = v === "true" ? true : v === "false" ? false : v.slice(0, 80);
    }
    const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
    if (q && def.search?.length) {
      const re = new RegExp(escapeRegex(q), "i");
      filter.$or = def.search.map((field) => ({ [field]: re }));
    }
    const perPage = 50;
    const total = await def.model.countDocuments(filter);
    const pages = Math.max(1, Math.ceil(total / perPage));
    const page = Math.min(Math.max(Number(url.searchParams.get("page")) || 1, 1), pages);
    const items = await def.model.find(filter).select(def.select ?? "").sort(def.sort).skip((page - 1) * perPage).limit(perPage).lean();
    // Facet counts for filter chips (e.g. how many "new" messages).
    const counts: Record<string, Record<string, number>> = {};
    for (const f of def.filters ?? []) {
      const rows = await def.model.aggregate<{ _id: unknown; n: number }>([{ $group: { _id: `$${f}`, n: { $sum: 1 } } }]);
      counts[f] = Object.fromEntries(rows.map((r) => [String(r._id), r.n]));
    }
    return ok({ items, total, page, pages, counts });
  });
}

export function POST(req: Request, ctx: Ctx) {
  return handle(async () => {
    const def = await resolve(ctx);
    await requireRole(def.write);
    if (!def.creatable) throw new HttpError(405, "Records of this type cannot be created here");
    const body = def.schema.parse(await readJson(req)) as Record<string, unknown>;
    await connectDb();
    if ((await ctx.params).resource === "users") {
      const { password, ...rest } = body as { password: string } & Record<string, unknown>;
      const doc = await def.model.create({ ...rest, passwordHash: await bcrypt.hash(password, 12) });
      return ok({ id: String(doc._id) }, 201);
    }
    if (def.reorderable && body.order === undefined) {
      const last = await def.model.findOne().sort({ order: -1 }).select("order").lean<{ order?: number }>();
      body.order = (last?.order ?? 0) + 10;
    }
    const doc = await def.model.create(body);
    return ok({ id: String(doc._id) }, 201);
  });
}

/** PATCH { ids: [...] } sets order = 10, 20, 30… in the given sequence. */
export function PATCH(req: Request, ctx: Ctx) {
  return handle(async () => {
    const def = await resolve(ctx);
    await requireRole(def.write);
    if (!def.reorderable) throw new HttpError(405, "This list cannot be reordered");
    const { ids } = reorderSchema.parse(await readJson(req));
    await connectDb();
    await def.model.bulkWrite(ids.map((id, i) => ({ updateOne: { filter: { _id: id }, update: { $set: { order: (i + 1) * 10 } } } })));
    return ok({ ok: true });
  });
}
