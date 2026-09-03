"use client";

import { useMemo, useState } from "react";
import {
  buildShareUrl,
  createCapsuleFromMoment,
  estimateCapsuleBytes,
  rememberOutbound,
  sealCapsule,
} from "@/lib/share";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useMoment } from "@/context/MomentProvider";
import type { MomentRecord } from "@/lib/types";

type Props = {
  moment: MomentRecord;
  open: boolean;
  onClose: () => void;
};

export function ShareMomentModal({ moment, open, onClose }: Props) {
  const { cloudUser } = useMoment();
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloudSent, setCloudSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const canCloudShare = isSupabaseConfigured() && Boolean(cloudUser);

  const preview = useMemo(() => {
    if (!open) return null;
    return createCapsuleFromMoment({
      moment,
      recipientName: recipientName || "friend",
      senderName: senderName || "You",
      passcode: passcode || undefined,
    });
  }, [open, moment, recipientName, senderName, passcode]);

  if (!open) return null;

  async function sendCloudShare() {
    if (!cloudUser || !recipientEmail.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const { createSharedMoment } = await import("@/lib/supabase/sharing");
      await createSharedMoment({
        momentId: moment.id,
        senderId: cloudUser.id,
        senderName: senderName.trim() || cloudUser.email.split("@")[0],
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim(),
        passcode: passcode.trim() || undefined,
      });
      setCloudSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setBusy(false);
    }
  }

  function createLink() {
    setError(null);
    setCopied(false);
    if (!recipientName.trim()) {
      setError("Who is this Moment for?");
      return;
    }
    const capsule = createCapsuleFromMoment({
      moment,
      recipientName,
      senderName,
      passcode: passcode || undefined,
    });
    const bytes = estimateCapsuleBytes(capsule);
    if (bytes > 1_800_000) {
      setError(
        "Too large for a link. Use a shorter note or smaller photo.",
      );
      return;
    }
    const sealed = sealCapsule(capsule);
    const url = buildShareUrl(window.location.origin, capsule, sealed);
    rememberOutbound({
      shareId: capsule.shareId,
      accessKey: capsule.accessKey,
      recipientName: capsule.recipientName,
      momentId: moment.id,
      title: moment.title,
      placeName: moment.placeName,
      createdAt: capsule.createdAt,
      urlPath: `/m/${capsule.shareId}?k=${capsule.accessKey}`,
    });
    setLink(url);
  }

  async function copyLink() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setError("Could not copy — long-press the link to copy.");
    }
  }

  async function nativeShare() {
    if (!link || !navigator.share) return;
    try {
      await navigator.share({
        title: `A Moment for ${recipientName || "you"}`,
        text: `${senderName || "Someone"} left you a Moment at ${moment.placeName}. Open it when you arrive.`,
        url: link,
      });
    } catch {
      // user cancelled
    }
  }

  if (cloudSent) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-[28px] border border-accent/30 bg-[#0d0f16] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-accent/50 bg-accent/15 text-accent shadow-[0_0_30px_rgba(255,138,42,0.35)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M5 12l5 5L20 7" />
            </svg>
          </div>
          <h2 className="font-display mt-5 text-2xl tracking-wide">Moment sent</h2>
          <p className="mt-2 text-sm text-muted">
            When <span className="text-accent">{recipientName || recipientEmail}</span> signs
            into MOMENT with <span className="text-foreground/90">{recipientEmail}</span>,
            they&apos;ll see this waiting — locked until they arrive at{" "}
            <span className="text-foreground/90">{moment.placeName}</span>.
          </p>
          <button type="button" className="btn-primary mt-8 w-full" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-auto max-h-[92vh] rounded-[28px] border border-white/10 bg-[#0d0f16] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.22em] text-accent uppercase">Send to someone</p>
            <h2 className="font-display mt-1 text-2xl tracking-wide">
              Leave a Moment for them
            </h2>
            <p className="mt-1 text-sm text-muted">
              Only they can open it — and only at{" "}
              <span className="text-foreground/90">{moment.placeName}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!link ? (
          <div className="mt-5 flex flex-col gap-3">
            <label className="text-xs tracking-wide text-muted uppercase">
              Their name
              <input
                className="field mt-1.5"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Alex"
                autoFocus
              />
            </label>

            {canCloudShare && (
              <label className="text-xs tracking-wide text-muted uppercase">
                Their email (account-locked delivery)
                <input
                  className="field mt-1.5"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="alex@email.com"
                />
                <span className="mt-1 block text-[11px] text-muted/80">
                  They sign in with this email to claim it. PIN-only shares still work below.
                </span>
              </label>
            )}

            <label className="text-xs tracking-wide text-muted uppercase">
              From
              <input
                className="field mt-1.5"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className="text-xs tracking-wide text-muted uppercase">
              Optional PIN (tell them separately)
              <input
                className="field mt-1.5"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. 4821"
                inputMode="numeric"
              />
            </label>
            {preview && (
              <p className="text-[11px] text-muted">
                Link size ~{Math.round(estimateCapsuleBytes(preview) / 1024)} KB
              </p>
            )}
            {error && <p className="text-sm text-amber-300">{error}</p>}

            {canCloudShare && recipientEmail.trim() && (
              <button
                type="button"
                className="btn-primary"
                disabled={busy || !recipientName.trim()}
                onClick={() => void sendCloudShare()}
              >
                {busy ? "Sending…" : "Send to their account"}
              </button>
            )}

            <button
              type="button"
              className={canCloudShare && recipientEmail.trim() ? "btn-ghost" : "btn-primary"}
              onClick={createLink}
            >
              {canCloudShare && recipientEmail.trim()
                ? "Or create a link instead"
                : "Create private link"}
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-sm text-foreground/90">
              Private link for <span className="text-accent">{recipientName}</span> is ready.
            </p>
            <div className="max-h-28 overflow-auto break-all rounded-2xl border border-white/10 bg-black/40 p-3 text-[11px] text-muted">
              {link}
            </div>
            {error && <p className="text-sm text-amber-300">{error}</p>}
            <button type="button" className="btn-primary" onClick={() => void copyLink()}>
              {copied ? "Copied" : "Copy link"}
            </button>
            {typeof navigator !== "undefined" && "share" in navigator && (
              <button type="button" className="btn-ghost" onClick={() => void nativeShare()}>
                Share via…
              </button>
            )}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setLink(null); setCopied(false); }}
            >
              Create another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
