import { readFile } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

type Ctx = { params: Promise<{ name: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { name } = await ctx.params;
  // Strict allow-list pattern: no slashes, dots or traversal are possible.
  if (!/^[a-f0-9]{24}\.webp$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(path.resolve(env().UPLOAD_DIR), name));
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
