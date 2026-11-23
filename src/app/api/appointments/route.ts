import { createHash, randomBytes } from "node:crypto";
import { clientIp, handle, HttpError, ok, rateLimit, readJson } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { Appointment } from "@/lib/models";
import { appointmentSchema } from "@/lib/validators";

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

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
    rateLimit(`appt:${clientIp(req)}`, 5, 15 * 60_000);
    const input = appointmentSchema.parse(await readJson(req));
    // Honeypot filled: pretend success so bots learn nothing, store nothing.
    if (input.website) return ok({ ok: true, reference: makeReference() }, 201);
    await connectDb();
    const { website: _website, ...data } = input;
    void _website;

    // Duplicate protection: same person + same preferred date within 24 h returns the existing reference.
    const fingerprint = createHash("sha256").update(`${data.email.toLowerCase()}|${data.phone.replace(/\D/g, "")}|${data.preferredDate}`).digest("hex");
    const existing = await Appointment.findOne({ fingerprint, createdAt: { $gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) }, status: { $ne: "cancelled" } })
      .select("reference").lean<{ reference?: string }>();
    if (existing?.reference) return ok({ ok: true, reference: existing.reference, duplicate: true }, 200);

    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = makeReference();
      try {
        await Appointment.create({ ...data, reference, fingerprint, status: "pending", statusHistory: [{ status: "pending", at: new Date(), by: "patient", note: "Request submitted online" }] });
        return ok({ ok: true, reference }, 201);
      } catch (err) {
        if ((err as { code?: number }).code !== 11000) throw err; // retry only on reference collision
      }
    }
    throw new HttpError(500, "Could not create a reference number. Please try again.");
  });
}

export function GET() {
  return handle(async () => {
    throw new HttpError(405, "Method not allowed");
  });
}
