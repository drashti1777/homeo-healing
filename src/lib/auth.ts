import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { HttpError } from "./api";
import { env } from "./env";

export const SESSION_COOKIE = "hh_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export type Role = "admin" | "editor" | "staff";
export type Session = { id: string; email: string; name: string; role: Role };

const key = () => new TextEncoder().encode(env().AUTH_SECRET);

export async function createSessionCookie(session: Session) {
  const token = await new SignJWT({ email: session.email, name: session.name, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return { id: payload.sub, email: String(payload.email), name: String(payload.name), role: payload.role as Role };
  } catch {
    return null;
  }
}

/** Throws 401/403 unless the caller is signed in with one of the allowed roles. */
export async function requireRole(roles: Role[]): Promise<Session> {
  const session = await getSession();
  if (!session) throw new HttpError(401, "Please sign in.");
  if (!roles.includes(session.role)) throw new HttpError(403, "You do not have permission to do this.");
  return session;
}
