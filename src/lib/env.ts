import { z } from "zod";

const schema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  UPLOAD_DIR: z.string().default("./uploads"),
});

let cached: z.infer<typeof schema> | undefined;

/** Server-only validated environment. Throws a clear error if misconfigured. */
export function env() {
  cached ??= schema.parse(process.env);
  return cached;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
