import { createClient } from "@/lib/supabase/client";
import type { ReminderSettings, ReminderSettingsInput } from "./types";

type SettingsRow = {
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  phone_e164: string | null;
  timezone: string;
  preferred_hour: number;
  email_consent_at: string | null;
  sms_consent_at: string | null;
  updated_at: string;
};

function toSettings(row: SettingsRow): ReminderSettings {
  return {
    userId: row.user_id,
    emailEnabled: row.email_enabled,
    smsEnabled: row.sms_enabled,
    phoneE164: row.phone_e164,
    timezone: row.timezone,
    preferredHour: row.preferred_hour,
    emailConsentAt: row.email_consent_at,
    smsConsentAt: row.sms_consent_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchReminderSettings(
  userId: string,
): Promise<ReminderSettings | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reminder_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? toSettings(data as SettingsRow) : null;
}

export async function upsertReminderSettings(
  userId: string,
  input: ReminderSettingsInput,
  existing: ReminderSettings | null,
): Promise<ReminderSettings> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const emailConsentAt =
    input.emailEnabled && input.emailConsent
      ? (existing?.emailConsentAt ?? now)
      : input.emailEnabled
        ? existing?.emailConsentAt
        : null;

  const smsConsentAt =
    input.smsEnabled && input.smsConsent
      ? (existing?.smsConsentAt ?? now)
      : input.smsEnabled
        ? existing?.smsConsentAt
        : null;

  const { data, error } = await supabase
    .from("reminder_settings")
    .upsert(
      {
        user_id: userId,
        email_enabled: input.emailEnabled,
        sms_enabled: input.smsEnabled,
        phone_e164: input.smsEnabled ? input.phoneE164 : null,
        timezone: input.timezone,
        preferred_hour: input.preferredHour,
        email_consent_at: emailConsentAt,
        sms_consent_at: smsConsentAt,
        updated_at: now,
      },
      { onConflict: "user_id" },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to save reminder settings");
  }

  return toSettings(data as SettingsRow);
}
