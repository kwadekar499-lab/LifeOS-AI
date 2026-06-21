import {
  BookOpen,
  Brain,
  CheckSquare,
  Home,
  Library,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
};

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", path: ROUTES.APP_HOME, icon: Home },
  { id: "memory", label: "Memory", path: ROUTES.APP_MEMORY, icon: Brain },
  {
    id: "assistant",
    label: "Assistant",
    path: ROUTES.APP_ASSISTANT,
    icon: Sparkles,
  },
  { id: "tasks", label: "Tasks", path: ROUTES.APP_TASKS, icon: CheckSquare },
  { id: "journal", label: "Journal", path: ROUTES.APP_JOURNAL, icon: BookOpen },
  {
    id: "knowledge",
    label: "Knowledge",
    path: ROUTES.APP_KNOWLEDGE,
    icon: Library,
  },
];

export const SETTINGS_NAV_ITEM: NavItem = {
  id: "settings",
  label: "Settings",
  path: ROUTES.APP_SETTINGS,
  icon: Settings,
};
