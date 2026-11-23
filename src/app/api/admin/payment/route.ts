import { handle, ok, readJson } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { Settings } from "@/lib/models";
import { paymentSettingsSchema } from "@/lib/validators";

/** Admin-only. Stores the verification checklist for a future payment integration. No gateway secrets are stored here. */
export function GET() {
  return handle(async () => {
    await requireRole(["admin"]);
    await connectDb();
    const s = await Settings.findOne({ key: "main" }).select("payment").lean<{ payment?: unknown }>();
    return ok({ item: s?.payment ?? {} });
  });
}

export function PUT(req: Request) {
  return handle(async () => {
    await requireRole(["admin"]);
    const payment = paymentSettingsSchema.parse(await readJson(req));
    await connectDb();
    await Settings.updateOne({ key: "main" }, { $set: { payment }, $setOnInsert: { key: "main" } }, { upsert: true });
    return ok({ ok: true });
  });
}
