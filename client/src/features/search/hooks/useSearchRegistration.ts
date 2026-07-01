import { useEffect } from "react";
import { useSearchStore } from "../store/search-store";
import { createTasksSearchProvider } from "../providers/tasks-search-provider";
import type { Task } from "@/features/tasks/types/task";


type UseSearchRegistrationProps = {
  tasks: Task[];
  onNavigateToTasks: () => void;
};

export function useSearchRegistration({
  tasks,
  onNavigateToTasks,
}: UseSearchRegistrationProps) {
  const registerProvider = useSearchStore((state) => state.registerProvider);
  const unregisterProvider = useSearchStore((state) => state.unregisterProvider);

  useEffect(() => {
    const provider = createTasksSearchProvider(
      () => tasks,
      onNavigateToTasks,
    );
    registerProvider(provider);

    return () => {
      unregisterProvider("📋 Tasks");
    };
  }, [tasks, onNavigateToTasks, registerProvider, unregisterProvider]);
}