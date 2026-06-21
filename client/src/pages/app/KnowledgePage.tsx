import { Library } from "lucide-react";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

function KnowledgePage() {
  return (
    <PlaceholderPage
      title="Knowledge"
      subtitle="Your structured universe of ideas, references, and connections."
      icon={<Library />}
    />
  );
}

export default KnowledgePage;
