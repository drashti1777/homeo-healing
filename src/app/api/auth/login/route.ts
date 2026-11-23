import bcrypt from "bcryptjs";
import { clientIp, handle, HttpError, ok, rateLimit, readJson } from "@/lib/api";
import { createSessionCookie } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import { loginSchema } from "@/lib/validators";

// Compared against when the email is unknown so response time does not reveal valid accounts.
const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO5Ml7aCF7Qm3Lf7Vq1M9mQkQ9X5mQe6a";

export function POST(req: Request) {
  return handle(async () => {
    const ip = clientIp(req);
    rateLimit(`login:${ip}`, 8, 15 * 60_000);
    const { email, password } = loginSchema.parse(await readJson(req));
    rateLimit(`login-email:${email.toLowerCase()}`, 8, 15 * 60_000);
    await connectDb();
    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid) throw new HttpError(401, "Incorrect email or password.");
    await createSessionCookie({ id: String(user._id), email: user.email, name: user.name, role: user.role });
    return ok({ ok: true });
  });
}
