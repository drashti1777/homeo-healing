import { randomBytes } from "node:crypto";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { handle, HttpError, ok } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { env } from "@/lib/env";

const MAX_BYTES = 8 * 1024 * 1024;

const uploadDir = () => path.resolve(env().UPLOAD_DIR);

export function GET() {
  return handle(async () => {
    await requireRole(["admin", "editor"]);
    const dir = uploadDir();
    await mkdir(dir, { recursive: true });
    const names = (await readdir(dir)).filter((n) => /^[a-f0-9]{24}\.webp$/.test(n));
    const items = await Promise.all(names.map(async (n) => ({ url: `/media/${n}`, createdAt: (await stat(path.join(dir, n))).mtimeMs })));
    return ok({ items: items.sort((a, b) => b.createdAt - a.createdAt) });
  });
}

export function POST(req: Request) {
  return handle(async () => {
    await requireRole(["admin", "editor"]);
    const form = await req.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) throw new HttpError(400, "Choose an image file to upload.");
    if (file.size === 0 || file.size > MAX_BYTES) throw new HttpError(400, "Images must be smaller than 8 MB.");
    const input = Buffer.from(await file.arrayBuffer());
    let output: Buffer;
    try {
      // sharp decodes the real bytes (so renamed non-images fail), strips EXIF/location metadata
      // and converts to WebP. Rotation is applied first so photos keep their orientation.
      output = await sharp(input, { limitInputPixels: 50_000_000 })
        .rotate()
        .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      throw new HttpError(400, "That file is not a supported image (use JPG, PNG, WebP or AVIF).");
    }
    const name = `${randomBytes(12).toString("hex")}.webp`;
    const dir = uploadDir();
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), output, { flag: "wx" });
    return ok({ url: `/media/${name}` }, 201);
  });
}
