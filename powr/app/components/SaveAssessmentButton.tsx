"use client";

import Link from "next/link";
import { useState } from "react";
import type { AnalysisRequest } from "@/app/components/types";
import { usePowrAuth } from "@/lib/PowrAuthProvider";

export function SaveAssessmentButton({ request }: { request: AnalysisRequest }) {
  const { user, cloudEnabled, saveAssessment } = usePowrAuth();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  if (!request.analysis) return null;

  async function onSave() {
    setStatus("saving");
    setMessage("");
    try {
      await saveAssessment(request);
      setStatus("saved");
      setMessage(
        user
          ? "Saved to your POWR account."
          : "Saved on this device. Sign in to sync across phones.",
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not save assessment");
    }
  }

  return (
    <div style={{ display: "grid", gap: 10, width: "100%" }}>
      <button
        type="button"
        className="share-assessment-button"
        disabled={status === "saving" || status === "saved"}
        onClick={() => void onSave()}
        style={{
          background:
            status === "saved"
              ? "rgba(109, 255, 174, 0.18)"
              : "linear-gradient(135deg, #6dffae, #3dffd3)",
          color: "#04140f",
        }}
      >
        {status === "saving"
          ? "Saving…"
          : status === "saved"
            ? "Assessment saved ✓"
            : user
              ? "Save to my account"
              : "Save assessment"}
      </button>

      {message ? (
        <p style={{ margin: 0, fontSize: 13, opacity: 0.78 }}>{message}</p>
      ) : null}

      {!user ? (
        <p style={{ margin: 0, fontSize: 13, opacity: 0.72 }}>
          {cloudEnabled
            ? "Want history on every device?"
            : "Cloud sync needs Supabase keys (see SETUP.md)."}{" "}
          <Link href="/login" style={{ color: "#6dffae" }}>
            Sign in with email →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
