import type { Metadata } from "next";
import { ReminderSettingsForm } from "@/components/ReminderSettingsForm";

export const metadata: Metadata = {
  title: "Reminders",
  description: "Manage daily QuitCurve check-in email and SMS reminders.",
};

export default function RemindersPage() {
  return <ReminderSettingsForm />;
}
