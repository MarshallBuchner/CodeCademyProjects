"use client";

import { useMemo, useState } from "react";
import {
  buildShareUrl,
  createCapsuleFromMoment,
  estimateCapsuleBytes,
  rememberOutbound,
  sealCapsule,
} from "@/lib/share";
import type { MomentRecord } from "@/lib/types";

type Props = {
  moment: MomentRecord;
  open: boolean;
  onClose: () => void;
};

export function ShareMomentModal({ moment, open, onClose }: Props) {
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        "This Moment is too large to send in a link (big photo/video). Use a shorter note or a smaller photo for now.",
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

  return (
    <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0d0f16] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.22em] text-accent uppercase">Private share</p>
            <h2 className="font-display mt-1 text-2xl tracking-wide">Send to someone</h2>
            <p className="mt-1 text-sm text-muted">
              Only the person with this link (and optional PIN) can unlock it — and only at{" "}
              <span className="text-foreground/90">{moment.placeName}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-muted"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {!link ? (
          <div className="mt-5 flex flex-col gap-3">
            <label className="text-xs tracking-wide text-muted uppercase">
              For
              <input
                className="field mt-1.5"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Alex"
                autoFocus
              />
            </label>
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
            <button type="button" className="btn-primary mt-2" onClick={createLink}>
              Create private link
            </button>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <p className="text-sm text-foreground/90">
              Private link for <span className="text-accent">{recipientName}</span> is ready.
              Don&apos;t post it publicly — anyone with the link is treated as them.
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
              onClick={() => {
                setLink(null);
                setCopied(false);
              }}
            >
              Create another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
