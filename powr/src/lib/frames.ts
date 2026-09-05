import type { AnalysisResult, AssessmentGoal } from "@/lib/types";

export async function extractVideoFrames(file: File, count = 8) {
  const url = URL.createObjectURL(file);
  try {
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Could not read video"));
    });

    const durationSec = Number.isFinite(video.duration) ? video.duration : 0;
    const canvas = document.createElement("canvas");
    const maxW = 640;
    const scale = Math.min(1, maxW / (video.videoWidth || maxW));
    canvas.width = Math.max(1, Math.round((video.videoWidth || maxW) * scale));
    canvas.height = Math.max(
      1,
      Math.round((video.videoHeight || maxW) * scale),
    );
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");

    const frames: string[] = [];
    const safeCount = Math.max(1, count);
    for (let i = 0; i < safeCount; i += 1) {
      const t =
        durationSec > 0
          ? ((i + 0.5) / safeCount) * Math.min(durationSec, 30)
          : 0;
      await seek(video, t);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL("image/jpeg", 0.7));
    }

    return { frames, durationSec: durationSec > 0 ? durationSec : null };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function seek(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve, reject) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    video.addEventListener("seeked", onSeeked);
    video.onerror = () => reject(new Error("Seek failed"));
    video.currentTime = Math.max(0, time);
  });
}

export async function requestAnalysis(input: {
  goal: AssessmentGoal;
  frames: string[];
}): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as {
    success?: boolean;
    analysis?: AnalysisResult;
    error?: string;
  };
  if (!res.ok || !json.success || !json.analysis) {
    throw new Error(json.error || "Analysis failed");
  }
  return json.analysis;
}
