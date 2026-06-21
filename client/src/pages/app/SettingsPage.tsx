import { Settings } from "lucide-react";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      subtitle="Configure your LifeOS experience, preferences, and integrations."
      icon={<Settings />}
    />
  );
}

export default SettingsPage;
