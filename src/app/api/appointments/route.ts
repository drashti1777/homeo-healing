import { randomBytes } from "node:crypto";
import { clientIp, handle, ok, rateLimit, readJson } from "@/lib/api";
import { appointmentSchema } from "@/lib/validators";

/** Short, unambiguous reference (no 0/O/1/I), e.g. HH-261120-7K4Q. */
function makeReference() {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = randomBytes(4);
  const tail = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  const d = new Date();
  return `HH-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${tail}`;
}

export function POST(req: Request) {
  return handle(async () => {
    rateLimit(`appt:${clientIp(req)}`, 10, 15 * 60_000);
    appointmentSchema.parse(await readJson(req));
    const reference = makeReference();
    return ok({ ok: true, reference }, 201);
  });
}

export function GET() {
  return handle(async () => {
    return ok({ ok: true });
  });
}
