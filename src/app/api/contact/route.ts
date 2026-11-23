import { createHash } from "node:crypto";
import { clientIp, handle, ok, rateLimit, readJson } from "@/lib/api";
import { connectDb } from "@/lib/db";
import { ContactMessage } from "@/lib/models";
import { contactSchema } from "@/lib/validators";

const LINK_LIMIT = 2;

export function POST(req: Request) {
  return handle(async () => {
    rateLimit(`contact:${clientIp(req)}`, 5, 15 * 60_000);
    const input = contactSchema.parse(await readJson(req));
    // Spam signals: honeypot filled, or a message stuffed with links. Accept silently, store nothing.
    const links = (input.message.match(/https?:\/\/|www\./gi) ?? []).length;
    if (input.website || links > LINK_LIMIT) return ok({ ok: true }, 201);
    await connectDb();
    const { website: _website, ...data } = input;
    void _website;
    // The same message sent twice within 10 minutes (double click, resubmit) is stored once.
    const fingerprint = createHash("sha256").update(`${data.email.toLowerCase()}|${data.message.trim().toLowerCase()}`).digest("hex");
    const dup = await ContactMessage.exists({ fingerprint, createdAt: { $gte: new Date(Date.now() - 10 * 60_000) } });
    if (dup) return ok({ ok: true, duplicate: true }, 200);
    await ContactMessage.create({ ...data, subject: data.subject || "Website enquiry", fingerprint, status: "new", statusHistory: [{ status: "new", at: new Date(), by: "visitor" }] });
    return ok({ ok: true }, 201);
  });
}
