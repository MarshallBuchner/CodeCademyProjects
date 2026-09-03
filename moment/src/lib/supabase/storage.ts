import { createClient } from "./client";
import { isSupabaseConfigured } from "./config";

export type MediaUploadResult = {
  storagePath: string;
  publicUrl: string;
};

export async function uploadMedia(
  userId: string,
  file: File | Blob,
  filename: string,
): Promise<MediaUploadResult> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const supabase = createClient();
  const path = `${userId}/${Date.now()}-${filename}`;
  const { error } = await supabase.storage
    .from("moment-media")
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw error;
  const { data } = supabase.storage
    .from("moment-media")
    .getPublicUrl(path);
  return { storagePath: path, publicUrl: data.publicUrl };
}

export async function getSignedUrl(
  storagePath: string,
  expiresIn = 3600,
): Promise<string> {
  if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("moment-media")
    .createSignedUrl(storagePath, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

/** Convert a data URL to a Blob for upload */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header?.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Upload a data-URL media item, return the storage path */
export async function uploadMediaFromDataUrl(
  userId: string,
  dataUrl: string,
  filenameHint: string,
): Promise<string> {
  const blob = dataUrlToBlob(dataUrl);
  const ext =
    blob.type.split("/")[1]?.replace("jpeg", "jpg")?.replace("webm", "webm") ??
    "bin";
  const filename = `${filenameHint}.${ext}`;
  const result = await uploadMedia(userId, blob, filename);
  return result.storagePath;
}
