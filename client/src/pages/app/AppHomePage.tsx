import { Home } from "lucide-react";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

function AppHomePage() {
  return (
    <PlaceholderPage
      title="Home"
      subtitle="Your command center for everything LifeOS knows about you."
      icon={<Home />}
    />
  );
}

export default AppHomePage;
