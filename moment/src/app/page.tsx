import { AppShell } from "@/components/AppShell";
import { MomentAppProvider } from "@/components/MomentAppProvider";

export default function Page() {
  return (
    <MomentAppProvider>
      <AppShell />
    </MomentAppProvider>
  );
}
