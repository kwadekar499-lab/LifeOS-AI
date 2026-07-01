export const TASKS_COPY = {
  title: "Tasks",
  description:
    "Turn ideas into action. Organize work, track progress, and focus on what matters most.",
  searchPlaceholder: "Search tasks…",
  filterLabel: "Filter",
  sortLabel: "Sort",
  newTaskLabel: "New Task",
  viewBoardLabel: "Board view",
  viewListLabel: "List view",
  resetFiltersLabel: "Reset filters",
  emptyState: {
    title: "Turn ideas into action.",
    description:
      "Organize work, track progress, and focus on what matters most. Your first task is just a click away.",
    action: "Create your first task",
  },
  emptySearch: {
    title: "No matching tasks",
    description: "Try adjusting your search or filters.",
  },
  emptyCompleted: {
    title: "Everything completed 🎉",
    description: "You've cleared all your tasks. Time to celebrate before the next wave of ideas hits.",
    action: "Create new task",
  },
  filter: {
    allStatuses: "All Statuses",
    allPriorities: "All Priorities",
    allProjects: "All Projects",
    newProject: "New",
  },
  sort: {
    newest: "Newest",
    oldest: "Oldest",
    dueDate: "Due Date",
    priority: "Priority",
    alphabetical: "Alphabetical",
  },
  stats: {
    total: "Total Tasks",
    completed: "Completed",
    inProgress: "In Progress",
    highPriority: "High Priority",
    overdue: "Overdue",
  },
  shortcuts: {
    newTask: "New Task",
    search: "Focus Search",
    close: "Close Dialog",
  },
  dialog: {
    title: "New Task",
    closeLabel: "Close dialog",
    cancelLabel: "Cancel",
    submitLabel: "Create Task",
    duplicateWarning: "A similar task already exists.",
    validation: {
      titleRequired: "Title is required",
    },
    fields: {
      title: {
        label: "Title",
        placeholder: "What needs to be done?",
      },
      description: {
        label: "Description",
        placeholder: "Add details…",
      },
      priority: {
        label: "Priority",
      },
      status: {
        label: "Status",
      },
      project: {
        label: "Project",
        placeholder: "e.g. Marketing, Engineering…",
      },
      labels: {
        label: "Labels",
        placeholder: "e.g. bug, feature, urgent…",
      },
      dueDate: {
        label: "Due Date",
      },
    },
  },
} as const;