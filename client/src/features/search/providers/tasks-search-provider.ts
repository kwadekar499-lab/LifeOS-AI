import type { SearchItem, SearchProvider } from "../types/search";
import type { Task } from "@/features/tasks/types/task";


export function createTasksSearchProvider(
  getTasks: () => Task[],
  navigateToTasks: () => void,
): SearchProvider {
  return {
    module: "📋 Tasks",
    icon: "📋",
    search: (query: string): SearchItem[] => {
      const tasks = getTasks();
      const normalizedQuery = query.toLowerCase().trim();

      if (!normalizedQuery) return [];

      return tasks
        .filter((task) => {
          const matchesTitle = task.title.toLowerCase().includes(normalizedQuery);
          const matchesDescription =
            task.description?.toLowerCase().includes(normalizedQuery) ?? false;
          const matchesLabels = task.labels.some((label) =>
            label.name.toLowerCase().includes(normalizedQuery),
          );
          return matchesTitle || matchesDescription || matchesLabels;
        })
        .map((task) => ({
          id: `task-${task.id}`,
          title: task.title,
          description: task.description || undefined,
          module: "📋 Tasks",
          route: "/app/tasks",
          icon: "📋",
          metadata: {
            taskId: task.id,
            status: task.status,
            priority: task.priority,
          },
        }));
    },
    onSelect: (item: SearchItem) => {
      navigateToTasks();
      // The TasksPage will handle highlighting the specific task
      // via a custom event or by checking the metadata
      const taskId = item.metadata?.taskId as string | undefined;
      if (taskId) {
        window.dispatchEvent(
          new CustomEvent("search-select-task", { detail: { taskId } }),
        );
      }
    },
  };
}