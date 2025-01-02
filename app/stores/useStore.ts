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
  applyYearCount: true,
  selectedYearCount: 5,
  applyMinimumGrowth: true,
  minimumGrowth: 5,
  applyMinimumOperatingIncomeRatio: true,
  minimumOperatingIncomeRatio: -999,
  searchSymbol: "",
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
  setApplyYearCount: (applyYearCount) => set({ applyYearCount }),
  setSelectedYearCount: (count) => set({ selectedYearCount: count }),
  setApplyMinimumGrowth: (applyMinimumGrowth) => set({ applyMinimumGrowth }),
  setMinimumGrowth: (growth) => set({ minimumGrowth: growth }),
  setApplyMinimumOperatingIncomeRatio: (applyMinimumOperatingIncomeRatio) => set({ applyMinimumOperatingIncomeRatio }),
  setMinimumOperatingIncomeRatio: (ratio) => set({ minimumOperatingIncomeRatio: ratio }),
  setSearchSymbol: (searchSymbol) => set({ searchSymbol }),
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