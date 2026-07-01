import { create } from "zustand";
import type { SearchItem, SearchProvider, SearchState, SearchActions } from "../types/search";

type SearchStore = SearchState & SearchActions & {
  providers: Map<string, SearchProvider>;
};

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: "",
  results: [],
  isOpen: false,
  selectedIndex: 0,
  providers: new Map(),

  setQuery: (query: string) => {
    set({ query });
    const { executeSearch } = get();
    executeSearch(query);
  },

  setResults: (results: SearchItem[]) => {
    set({ results, selectedIndex: 0 });
  },

  openSearch: () => {
    set({ isOpen: true, query: "", results: [], selectedIndex: 0 });
  },

  closeSearch: () => {
    set({ isOpen: false, query: "", results: [], selectedIndex: 0 });
  },

  setSelectedIndex: (index: number) => {
    const { results } = get();
    const clampedIndex = Math.max(0, Math.min(index, results.length - 1));
    set({ selectedIndex: clampedIndex });
  },

  registerProvider: (provider: SearchProvider) => {
    const providers = new Map(get().providers);
    providers.set(provider.module, provider);
    set({ providers });
  },

  unregisterProvider: (module: string) => {
    const providers = new Map(get().providers);
    providers.delete(module);
    set({ providers });
  },

  executeSearch: (query: string) => {
    const { providers } = get();
    if (!query.trim()) {
      set({ results: [], selectedIndex: 0 });
      return;
    }

    const allResults: SearchItem[] = [];
    providers.forEach((provider) => {
      const items = provider.search(query);
      allResults.push(...items);
    });

    // Remove duplicates based on id
    const uniqueResults = Array.from(
      new Map(allResults.map((item) => [item.id, item])).values()
    );

    set({ results: uniqueResults, selectedIndex: 0 });
  },

  selectItem: (item: SearchItem) => {
    const { providers } = get();
    const provider = providers.get(item.module);
    
    if (provider?.onSelect) {
      provider.onSelect(item);
    } else {
      // Default behavior: navigate to route
      window.location.href = item.route;
    }

    set({ isOpen: false, query: "", results: [], selectedIndex: 0 });
  },
}));