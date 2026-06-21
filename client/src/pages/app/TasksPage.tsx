import { CheckSquare } from "lucide-react";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

function TasksPage() {
  return (
    <PlaceholderPage
      title="Tasks"
      subtitle="Intent-driven actions aligned with your goals and priorities."
      icon={<CheckSquare />}
    />
  );
}

export default TasksPage;
