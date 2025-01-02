import { create } from 'zustand';
import { AnalysisStore, WatchlistStore } from '@/types/store';


export const useAnalysisStore = create<AnalysisStore>((set) => ({
  // Initial state
  typeIds: [],
  exchanges: [],
  selectedTypeIds: ["stock"],
  selectedExchangeIds: ["NASDAQ", "NYSE"],
  yearsOfTable: [],
  totalYears: [],
  symbolGrowths: {},
  sortedSymbolGrowths: [],
  selectedYearCount: 5,
  minimumGrowth: 5,
  minimumOperatingIncomeRatio: -999,
  lastClickedSymbol: null,
  excludeWatchlist: false,

  // Actions
  setTypeIds: (typeIds) => set({ typeIds }),
  setExchanges: (exchanges) => set({ exchanges }),
  setSelectedTypeIds: (selectedTypeIds) => set({ selectedTypeIds }),
  setSelectedExchangeIds: (selectedExchangeIds) => set({ selectedExchangeIds }),
  setYearsOfTable: (yearsOfTable) => set({ yearsOfTable }),
  setTotalYears: (totalYears) => set({ totalYears }),
  setSymbolGrowths: (symbolGrowths) => set({ symbolGrowths }),
  setSortedSymbolGrowths: (sortedSymbolGrowths) => set({ sortedSymbolGrowths }),
  setSelectedYearCount: (count) => set({ selectedYearCount: count }),
  setMinimumGrowth: (growth) => set({ minimumGrowth: growth }),
  setMinimumOperatingIncomeRatio: (ratio) => set({ minimumOperatingIncomeRatio: ratio }),
  setLastClickedSymbol: (symbol) => set({ lastClickedSymbol: symbol }),
  setExcludeWatchlist: (excludeWatchlist) => set({ excludeWatchlist }),
  reset: () => set({
    typeIds: [],
    exchanges: [],
    selectedTypeIds: ["stock"],
    selectedExchangeIds: ["NASDAQ", "NYSE"],
    yearsOfTable: [],
    totalYears: [],
    symbolGrowths: {},
    sortedSymbolGrowths: [],
    selectedYearCount: 5,
    minimumGrowth: 5,
    lastClickedSymbol: null,
  })
}));

export const useWatchlistStore = create<WatchlistStore>((set) => ({
  watchlist: [],

  setWatchlist: (watchlist) => set({ watchlist }),
}));