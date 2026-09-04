/** Read a File as a data URL */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("read failed"));
    reader.readAsDataURL(file);
  });
}

/** Downscale / recompress an image for storage + share-link size */
export async function compressImageFile(
  file: File,
  opts?: { maxWidth?: number; quality?: number },
): Promise<{ dataUrl: string; mimeType: string }> {
  const maxWidth = opts?.maxWidth ?? 1280;
  const quality = opts?.quality ?? 0.72;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    const dataUrl = await readFileAsDataUrl(file);
    return { dataUrl, mimeType: file.type || "image/jpeg" };
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const mimeType = "image/jpeg";
  const dataUrl = canvas.toDataURL(mimeType, quality);
  return { dataUrl, mimeType };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
