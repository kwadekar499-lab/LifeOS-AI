export type CommandCategory = "pages" | "actions" | "recent" | "favorites";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  category: CommandCategory;
  keywords?: string[];
  action: () => void;
  route?: string;
}

export interface CommandGroup {
  category: CommandCategory;
  label: string;
  items: CommandItem[];
}

export interface CommandPaletteState {
  isOpen: boolean;
  searchQuery: string;
  selectedIndex: number;
  recentItems: string[];
  favoriteIds: string[];
}

export type CommandPaletteAction =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_SELECTED_INDEX"; index: number }
  | { type: "ADD_RECENT"; route: string }
  | { type: "TOGGLE_FAVORITE"; id: string }
  | { type: "RESET" };