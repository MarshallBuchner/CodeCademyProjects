import { AccountSettings } from "@/components/AccountSettings";
import { MomentAppProvider } from "@/components/MomentAppProvider";

export const metadata = {
  title: "Account — MOMENT",
  description: "Manage or delete your MOMENT account.",
};

export default function AccountPage() {
  return (
    <MomentAppProvider>
      <AccountSettings />
    </MomentAppProvider>
  );
}
