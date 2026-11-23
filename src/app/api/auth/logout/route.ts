import { handle, ok } from "@/lib/api";
import { clearSessionCookie } from "@/lib/auth";

export function POST() {
  return handle(async () => {
    await clearSessionCookie();
    return ok({ ok: true });
  });
}
