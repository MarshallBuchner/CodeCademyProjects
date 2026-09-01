"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuitCurve } from "@/context/QuitCurveProvider";
import type {
  Device,
  Frequency,
  NicotineStrength,
  Pace,
  UserPlan,
} from "@/lib/types";
import { getPaceLabel } from "@/lib/curve";

type OnboardingFlowProps = {
  open: boolean;
  onClose: () => void;
};

const TOTAL_STEPS = 5;

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

const NICOTINE_OPTIONS: { value: NicotineStrength; label: string }[] = [
  { value: "5%", label: "5% / 50mg (high)" },
  { value: "3%", label: "3% / 30mg (medium)" },
  { value: "0mg", label: "0mg (habit only)" },
  { value: "6mg-pouch", label: "6mg pouches" },
  { value: "12mg-pouch", label: "12mg+ pouches" },
  { value: "unknown", label: "Not sure" },
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

export function OnboardingFlow({ open, onClose }: OnboardingFlowProps) {
  const router = useRouter();
  const { setUserPlan, createAccount } = useQuitCurve();
  const [step, setStep] = useState(1);
  const [device, setDevice] = useState<Device | null>(null);
  const [frequency, setFrequency] = useState<Frequency | null>(null);
  const [nicotineStrength, setNicotineStrength] =
    useState<NicotineStrength | null>(null);
  const [weeklySpend, setWeeklySpend] = useState(35);
  const [pace, setPace] = useState<Pace>("8-week");
  const [showAccount, setShowAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [accountError, setAccountError] = useState("");

  if (!open) return null;

  const reset = () => {
    setStep(1);
    setDevice(null);
    setFrequency(null);
    setNicotineStrength(null);
    setWeeklySpend(35);
    setPace("8-week");
    setShowAccount(false);
    setName("");
    setEmail("");
    setMagicLinkSent(false);
    setAccountError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const buildPlan = (): UserPlan => ({
    device: device!,
    frequency: frequency!,
    nicotineStrength: nicotineStrength!,
    weeklySpend,
    pace,
    startDate: new Date().toISOString(),
    slipCount: 0,
  });

  const finishOnboarding = async (withAccount: boolean) => {
    const plan = buildPlan();
    await setUserPlan(plan);

    if (!withAccount) {
      handleClose();
      router.push("/dashboard");
    }
  };

  if (showAccount) {
    if (magicLinkSent) {
      return (
        <ModalOverlay onClose={handleClose}>
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-surface">
              <span className="text-2xl text-accent">✉</span>
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              Check your email
            </p>
            <h2 className="mt-3 text-2xl font-bold">Magic link sent</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              We sent a sign-in link to <strong>{email}</strong>. Tap it on any
              device to sync your QuitCurve progress.
            </p>
            <button
              type="button"
              onClick={() => {
                handleClose();
                router.push("/dashboard");
              }}
              className="mt-8 w-full rounded-full bg-accent py-4 text-sm font-semibold text-background"
            >
              Continue to dashboard
            </button>
          </div>
        </ModalOverlay>
      );
    }

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
            A {getPaceLabel(pace).replace(" steady plan", "").replace(" gentle plan", "")} plan built around you.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Create an account to save your progress across devices, or continue
            as a guest for now.
          </p>

          <div className="mt-6 space-y-3 text-left">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your first name"
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm outline-none focus:border-accent/50"
            />
          </div>

          <button
            type="button"
            onClick={async () => {
              setAccountError("");
              const plan = buildPlan();
              await setUserPlan(plan);
              const result = await createAccount(email, name);
              if (result.error) {
                setAccountError(result.error);
                return;
              }
              if (result.mode === "magic_link") {
                setMagicLinkSent(true);
                return;
              }
              handleClose();
              router.push("/dashboard");
            }}
            disabled={!name.trim() || !email.trim()}
            className="mt-4 w-full rounded-full bg-accent py-4 text-sm font-semibold text-background disabled:opacity-40"
          >
            Create account & view dashboard
          </button>
          {accountError && (
            <p className="mt-2 text-sm text-red-400">{accountError}</p>
          )}
          <button
            type="button"
            onClick={() => finishOnboarding(false)}
            className="mt-3 w-full py-3 text-sm text-muted transition hover:text-foreground"
          >
            Continue as guest
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
          title="What's your nicotine level?"
          subtitle="This helps calibrate your reduction curve."
        >
          <div className="space-y-3">
            {NICOTINE_OPTIONS.map((opt) => (
              <OptionButton
                key={opt.value}
                label={opt.label}
                selected={nicotineStrength === opt.value}
                onClick={() => setNicotineStrength(opt.value)}
              />
            ))}
          </div>
          <StepNav
            onBack={() => setStep(2)}
            onCancel={handleClose}
            onContinue={() => nicotineStrength && setStep(4)}
            continueDisabled={!nicotineStrength}
          />
        </StepContent>
      )}

      {step === 4 && (
        <StepContent
          step={4}
          title="About how much do you spend per week?"
          subtitle="We'll track money saved as you cut back."
        >
          <div className="rounded-2xl border border-white/10 bg-surface p-6 text-center">
            <p className="text-4xl font-bold text-accent">${weeklySpend}</p>
            <p className="mt-1 text-sm text-muted">per week</p>
            <input
              type="range"
              min={5}
              max={150}
              step={5}
              value={weeklySpend}
              onChange={(e) => setWeeklySpend(Number(e.target.value))}
              className="mt-6 w-full accent-accent"
            />
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>$5</span>
              <span>$150</span>
            </div>
          </div>
          <StepNav
            onBack={() => setStep(3)}
            onCancel={handleClose}
            onContinue={() => setStep(5)}
          />
        </StepContent>
      )}

      {step === 5 && (
        <StepContent
          step={5}
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
            onBack={() => setStep(4)}
            onCancel={handleClose}
            onContinue={() => setShowAccount(true)}
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
        Step {step} of {TOTAL_STEPS}
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
