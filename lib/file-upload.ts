import { mkdir, writeFile } from "fs/promises";
import path from "path";

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/** Upload para disco local (dev) ou Vercel Blob (produção). */
export async function storeUploadedFile(
  buffer: Buffer,
  safeName: string,
  mimeType: string,
): Promise<UploadResult> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (blobToken) {
    try {
      const response = await fetch(`https://blob.vercel-storage.com/${encodeURIComponent(safeName)}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${blobToken}`,
          "content-type": mimeType,
          "x-api-version": "7",
          "x-content-type": mimeType,
        },
        body: new Uint8Array(buffer),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        return { ok: false, error: text || `Blob upload failed (${response.status})` };
      }

      const data = (await response.json()) as { url?: string };
      return { ok: true, url: data.url ?? `/uploads/${safeName}` };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha no upload";
      return { ok: false, error: message };
    }
  }

  if (process.env.VERCEL) {
    return {
      ok: false,
      error: "Configure BLOB_READ_WRITE_TOKEN na Vercel para uploads em produção.",
    };
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, safeName), buffer);
  return { ok: true, url: `/uploads/${safeName}` };
}
