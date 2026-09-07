export type ReminderChannel = "email" | "sms";

export type ReminderSettings = {
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  phoneE164: string | null;
  timezone: string;
  preferredHour: number;
  emailConsentAt: string | null;
  smsConsentAt: string | null;
  updatedAt: string;
};

export type ReminderSettingsInput = {
  emailEnabled: boolean;
  smsEnabled: boolean;
  phoneE164: string | null;
  timezone: string;
  preferredHour: number;
  emailConsent: boolean;
  smsConsent: boolean;
};

export const COMMON_TIMEZONES = [
  { value: "America/Toronto", label: "Eastern (Toronto)" },
  { value: "America/Winnipeg", label: "Central (Winnipeg)" },
  { value: "America/Edmonton", label: "Mountain (Edmonton)" },
  { value: "America/Vancouver", label: "Pacific (Vancouver)" },
  { value: "America/Halifax", label: "Atlantic (Halifax)" },
  { value: "America/St_Johns", label: "Newfoundland" },
  { value: "UTC", label: "UTC" },
] as const;

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return {
    value: hour,
    label: `${display}:00 ${suffix}`,
  };
});
