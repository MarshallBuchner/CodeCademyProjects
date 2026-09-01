"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Device = "disposable" | "pod" | "refillable" | "pouches";
type Frequency = "occasionally" | "regularly" | "constantly";
type Pace = "4-week" | "8-week" | "12-week";

type OnboardingFlowProps = {
  open: boolean;
  onClose: () => void;
};

const DEVICE_OPTIONS: { value: Device; label: string }[] = [
  { value: "disposable", label: "Disposable vape" },
  { value: "pod", label: "Pod system" },
  { value: "refillable", label: "Refillable vape" },
  { value: "pouches", label: "Nicotine pouches" },
];

const FREQUENCY_OPTIONS: {
  value: Frequency;
  label: string;
  description: string;
}[] = [
  { value: "occasionally", label: "Occasionally", description: "A few times a day" },
  { value: "regularly", label: "Regularly", description: "Throughout the day" },
  { value: "constantly", label: "Constantly", description: "Usually within reach" },
];

const PACE_OPTIONS: {
  value: Pace;
  label: string;
  description: string;
  recommended?: boolean;
}[] = [
  { value: "4-week", label: "Faster reset", description: "A focused 4-week reduction" },
  {
    value: "8-week",
    label: "Steady progress",
    description: "A balanced 8-week reduction",
    recommended: true,
  },
  { value: "12-week", label: "Gentle curve", description: "A gradual 12-week reduction" },
];

const PACE_LABELS: Record<Pace, string> = {
  "4-week": "4-week",
  "8-week": "8-week",
  "12-week": "12-week",
};

export function OnboardingFlow({ open, onClose }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [device, setDevice] = useState<Device | null>(null);
  const [frequency, setFrequency] = useState<Frequency | null>(null);
  const [pace, setPace] = useState<Pace>("8-week");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!open) return null;

  const reset = () => {
    setStep(1);
    setDevice(null);
    setFrequency(null);
    setPace("8-week");
    setShowSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleViewPrototype = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "quitcurve-plan",
        JSON.stringify({ device, frequency, pace }),
      );
    }
    handleClose();
    router.push("/dashboard");
  };

  if (showSuccess) {
    return (
      <ModalOverlay onClose={handleClose}>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-surface">
            <span className="text-2xl text-accent">✓</span>
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            Your starting curve is ready
          </p>
          <h2 className="mt-3 text-2xl font-bold">
            A {PACE_LABELS[pace]} plan built around you.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Tomorrow we&apos;ll connect account creation, detailed nicotine
            inputs, daily check-ins, and your working dashboard.
          </p>
          <button
            type="button"
            onClick={handleViewPrototype}
            className="mt-8 w-full rounded-full bg-accent py-4 text-sm font-semibold text-background transition hover:bg-accent-dim"
          >
            View prototype
          </button>
        </div>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClose={handleClose}>
      <button
        type="button"
        onClick={handleClose}
        className="absolute right-5 top-5 text-muted transition hover:text-foreground"
        aria-label="Close"
      >
        ✕
      </button>

      {step === 1 && (
        <StepContent
          step={1}
          title="What do you use most often?"
          subtitle="Choose the option that best matches your current routine."
        >
          <div className="space-y-3">
            {DEVICE_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={device === opt.value}
                onClick={() => setDevice(opt.value)}
              />
            ))}
          </div>
          <StepNav
            showBack={false}
            onCancel={handleClose}
            onContinue={() => device && setStep(2)}
            continueDisabled={!device}
          />
        </StepContent>
      )}

      {step === 2 && (
        <StepContent
          step={2}
          title="How often do you reach for it?"
          subtitle="No judgement—an honest baseline creates a better plan."
        >
          <div className="space-y-3">
            {FREQUENCY_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={frequency === opt.value}
                onClick={() => setFrequency(opt.value)}
              />
            ))}
          </div>
          <StepNav
            onBack={() => setStep(1)}
            onCancel={handleClose}
            onContinue={() => frequency && setStep(3)}
            continueDisabled={!frequency}
          />
        </StepContent>
      )}

      {step === 3 && (
        <StepContent
          step={3}
          title="What pace feels realistic?"
          subtitle="You can change this later. QuitCurve will adapt with you."
        >
          <div className="space-y-3">
            {PACE_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                description={
                  opt.recommended
                    ? `${opt.description} • Recommended`
                    : opt.description
                }
                selected={pace === opt.value}
                onClick={() => setPace(opt.value)}
              />
            ))}
          </div>
          <StepNav
            onBack={() => setStep(2)}
            onCancel={handleClose}
            onContinue={() => setShowSuccess(true)}
          />
        </StepContent>
      )}
    </ModalOverlay>
  );
}

function ModalOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/10 bg-card p-6 sm:rounded-3xl sm:p-8">
        {children}
      </div>
    </div>
  );
}

function StepContent({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        Step {step} of 3
      </p>
      <h2 className="mt-3 text-2xl font-bold leading-tight">{title}</h2>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function OptionButton({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${
        selected
          ? "border-accent/50 bg-accent/5"
          : "border-white/10 bg-surface hover:border-white/20"
      }`}
    >
      <div>
        <p className="font-medium">{label}</p>
        {description && (
          <p className="mt-0.5 text-sm text-muted">{description}</p>
        )}
      </div>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-accent bg-accent text-background" : "border-white/20"
        }`}
      >
        {selected && <span className="text-xs">✓</span>}
      </span>
    </button>
  );
}

function StepNav({
  showBack = true,
  onBack,
  onCancel,
  onContinue,
  continueDisabled = false,
}: {
  showBack?: boolean;
  onBack?: () => void;
  onCancel: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted transition hover:text-foreground"
        >
          Back
        </button>
      ) : (
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-muted transition hover:text-foreground"
        >
          Cancel
        </button>
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled}
        className="inline-flex items-center gap-1 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-dim disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
        <span aria-hidden>›</span>
      </button>
    </div>
  );
}
