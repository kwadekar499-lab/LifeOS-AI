export interface SearchItem {
  id: string;
  title: string;
  description?: string;
  module: string;
  route: string;
  icon?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchProvider {
  module: string;
  icon?: string;
  search: (query: string) => SearchItem[];
  onSelect?: (item: SearchItem) => void;
}

export interface SearchState {
  query: string;
  results: SearchItem[];
  isOpen: boolean;
  selectedIndex: number;
}

export interface SearchActions {
  setQuery: (query: string) => void;
  setResults: (results: SearchItem[]) => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSelectedIndex: (index: number) => void;
  registerProvider: (provider: SearchProvider) => void;
  unregisterProvider: (module: string) => void;
  executeSearch: (query: string) => void;
  selectItem: (item: SearchItem) => void;
}