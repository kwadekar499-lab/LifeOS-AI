import { BookOpen } from "lucide-react";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

function JournalPage() {
  return (
    <PlaceholderPage
      title="Journal"
      subtitle="Reflect, capture thoughts, and trace the arc of your thinking over time."
      icon={<BookOpen />}
    />
  );
}

export default JournalPage;
