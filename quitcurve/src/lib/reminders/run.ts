import type { SupabaseClient } from "@supabase/supabase-js";
import {
  createAdminClient,
  isResendConfigured,
  isTwilioConfigured,
} from "./config";
import { sendCheckInReminderEmail } from "./email";
import { sendCheckInReminderSms } from "./sms";
import { getLocalParts } from "./timezone";
import type { ReminderChannel } from "./types";

type SettingsRow = {
  user_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  phone_e164: string | null;
  timezone: string;
  preferred_hour: number;
};

type ProfileRow = {
  id: string;
  email: string;
  name: string;
};

export type ReminderRunResult = {
  scanned: number;
  emailed: number;
  smsed: number;
  skipped: number;
  errors: string[];
};

async function claimSendSlot(
  admin: SupabaseClient,
  userId: string,
  channel: ReminderChannel,
  localDate: string,
): Promise<boolean> {
  const { data, error } = await admin
    .from("reminder_sends")
    .insert({
      user_id: userId,
      channel,
      local_date: localDate,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    // Unique violation = already sent today
    if (error.code === "23505") return false;
    throw error;
  }

  return Boolean(data?.id);
}

async function hasCheckedInToday(
  admin: SupabaseClient,
  userId: string,
  localDate: string,
): Promise<boolean> {
  const { data } = await admin
    .from("daily_checkins")
    .select("id")
    .eq("user_id", userId)
    .eq("checkin_date", localDate)
    .maybeSingle();

  return Boolean(data?.id);
}

export async function runDailyReminders(
  now = new Date(),
): Promise<ReminderRunResult> {
  const admin = createAdminClient();
  const result: ReminderRunResult = {
    scanned: 0,
    emailed: 0,
    smsed: 0,
    skipped: 0,
    errors: [],
  };

  const { data: settings, error: settingsError } = await admin
    .from("reminder_settings")
    .select(
      "user_id, email_enabled, sms_enabled, phone_e164, timezone, preferred_hour",
    )
    .or("email_enabled.eq.true,sms_enabled.eq.true");

  if (settingsError) {
    result.errors.push(settingsError.message);
    return result;
  }

  const rows = (settings ?? []) as SettingsRow[];
  if (rows.length === 0) return result;

  const userIds = rows.map((r) => r.user_id);
  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, email, name")
    .in("id", userIds);

  if (profilesError) {
    result.errors.push(profilesError.message);
    return result;
  }

  const profileMap = new Map(
    ((profiles ?? []) as ProfileRow[]).map((p) => [p.id, p]),
  );

  for (const row of rows) {
    result.scanned += 1;
    const profile = profileMap.get(row.user_id);
    if (!profile?.email) {
      result.skipped += 1;
      continue;
    }

    let localDate: string;
    let hour: number;
    try {
      ({ localDate, hour } = getLocalParts(row.timezone, now));
    } catch (err) {
      result.errors.push(
        `${row.user_id}: bad timezone ${row.timezone} (${String(err)})`,
      );
      result.skipped += 1;
      continue;
    }

    if (hour !== row.preferred_hour) {
      result.skipped += 1;
      continue;
    }

    try {
      if (await hasCheckedInToday(admin, row.user_id, localDate)) {
        result.skipped += 1;
        continue;
      }
    } catch (err) {
      result.errors.push(`${row.user_id}: check-in lookup ${String(err)}`);
      result.skipped += 1;
      continue;
    }

    if (row.email_enabled && isResendConfigured()) {
      try {
        const claimed = await claimSendSlot(
          admin,
          row.user_id,
          "email",
          localDate,
        );
        if (claimed) {
          const send = await sendCheckInReminderEmail({
            to: profile.email,
            name: profile.name,
          });
          if (send.ok) {
            result.emailed += 1;
          } else {
            result.errors.push(`${row.user_id} email: ${send.error}`);
            // Allow a retry later by removing the claim if send failed
            await admin
              .from("reminder_sends")
              .delete()
              .eq("user_id", row.user_id)
              .eq("channel", "email")
              .eq("local_date", localDate);
          }
        } else {
          result.skipped += 1;
        }
      } catch (err) {
        result.errors.push(`${row.user_id} email: ${String(err)}`);
      }
    }

    if (
      row.sms_enabled &&
      row.phone_e164 &&
      isTwilioConfigured()
    ) {
      try {
        const claimed = await claimSendSlot(
          admin,
          row.user_id,
          "sms",
          localDate,
        );
        if (claimed) {
          const send = await sendCheckInReminderSms({
            toE164: row.phone_e164,
            name: profile.name,
          });
          if (send.ok) {
            result.smsed += 1;
          } else {
            result.errors.push(`${row.user_id} sms: ${send.error}`);
            await admin
              .from("reminder_sends")
              .delete()
              .eq("user_id", row.user_id)
              .eq("channel", "sms")
              .eq("local_date", localDate);
          }
        } else {
          result.skipped += 1;
        }
      } catch (err) {
        result.errors.push(`${row.user_id} sms: ${String(err)}`);
      }
    }
  }

  return result;
}
