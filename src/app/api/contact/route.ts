import { clientIp, handle, ok, rateLimit, readJson } from "@/lib/api";
import { contactSchema } from "@/lib/validators";

export function POST(req: Request) {
  return handle(async () => {
    rateLimit(`contact:${clientIp(req)}`, 10, 15 * 60_000);
    contactSchema.parse(await readJson(req));
    return ok({ ok: true }, 201);
  });
}
