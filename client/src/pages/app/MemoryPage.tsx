import { Brain } from "lucide-react";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

function MemoryPage() {
  return (
    <PlaceholderPage
      title="Memory"
      subtitle="Persistent context that grows with you — facts, preferences, and insights."
      icon={<Brain />}
    />
  );
}

export default MemoryPage;
