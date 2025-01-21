import { create } from 'zustand';
import { AnalysisStore, AnalysisVolumeStore, WatchlistStore } from '@/types/store';


export const useAnalysisStore = create<AnalysisStore>((set) => ({
  // Initial state
  typeIds: [],
  exchanges: [],
  selectedTypeIds: ["stock"],
  selectedExchangeIds: ["NASDAQ", "NYSE"],
  yearsOfTable: [],
  totalYears: [],
  symbolGrowths: {},
  originSortedSymbolGrowths: [],
  sortedSymbolGrowths: [],
  applyYearCount: true,
  selectedYearCount: 5,
  applyMinimumGrowth: true,
  minimumGrowth: 5,
  applyMinimumOperatingIncomeRatio: true,
  minimumOperatingIncomeRatio: -999,
  searchSymbol: "",
  lastClickedSymbol: null,
  savedPage: 1,
  watchlistsToBeExcluded: [],
  showBBValues: false,
  filterUnderBBLower: false,
  filterUnderBBMiddle: false,
  BollingerObject: {},
  filterLoading: false,

  // Actions
  setTypeIds: (typeIds) => set({ typeIds }),
  setExchanges: (exchanges) => set({ exchanges }),
  setSelectedTypeIds: (selectedTypeIds) => set({ selectedTypeIds }),
  setSelectedExchangeIds: (selectedExchangeIds) => set({ selectedExchangeIds }),
  setYearsOfTable: (yearsOfTable) => set({ yearsOfTable }),
  setTotalYears: (totalYears) => set({ totalYears }),
  setSymbolGrowths: (symbolGrowths) => set({ symbolGrowths }),
  setOriginSortedSymbolGrowths: (originSortedSymbolGrowths) => set({ originSortedSymbolGrowths }),
  setSortedSymbolGrowths: (sortedSymbolGrowths) => set({ sortedSymbolGrowths }),
  setApplyYearCount: (applyYearCount) => set({ applyYearCount }),
  setSelectedYearCount: (count) => set({ selectedYearCount: count }),
  setApplyMinimumGrowth: (applyMinimumGrowth) => set({ applyMinimumGrowth }),
  setMinimumGrowth: (growth) => set({ minimumGrowth: growth }),
  setApplyMinimumOperatingIncomeRatio: (applyMinimumOperatingIncomeRatio) => set({ applyMinimumOperatingIncomeRatio }),
  setMinimumOperatingIncomeRatio: (ratio) => set({ minimumOperatingIncomeRatio: ratio }),
  setSearchSymbol: (searchSymbol) => set({ searchSymbol }),
  setLastClickedSymbol: (symbol) => set({ lastClickedSymbol: symbol }),
  setSavedPage: (savedPage) => set({ savedPage }),
  setWatchlistsToBeExcluded: (watchlistsToBeExcluded) => set({ watchlistsToBeExcluded }),
  setShowBBValues: (showBBValues) => set({ showBBValues }),
  setFilterUnderBBLower: (filterUnderBBLower) => set({ filterUnderBBLower }),
  setFilterUnderBBMiddle: (filterUnderBBMiddle) => set({ filterUnderBBMiddle }),
  setBollingerObject: (bollingerObject) => set({ BollingerObject: bollingerObject }),
  setFilterLoading: (filterLoading) => set({ filterLoading }),
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

export const useAnalysisVolumeStore = create<AnalysisVolumeStore>((set) => ({
  // Initial state
  typeIds: [],
  exchanges: [],
  selectedTypeIds: ["stock"],
  selectedExchangeIds: ["NASDAQ", "NYSE"],
  symbolsVolumeInfoObject: {},
  originSortedSymbols: [],
  sortedSymbols: [],
  searchSymbol: "",
  lastClickedSymbol: null,
  savedPage: 1,
  watchlistsToBeExcluded: [],
  numberOfBindingDays: 1,
  numberOfBinds: 3,

  // Actions
  setTypeIds: (typeIds) => set({ typeIds }),
  setExchanges: (exchanges) => set({ exchanges }),
  setSelectedTypeIds: (selectedTypeIds) => set({ selectedTypeIds }),
  setSelectedExchangeIds: (selectedExchangeIds) => set({ selectedExchangeIds }),
  setSymbolsVolumeInfoObject: (symbolsVolumeInfoObject) => set({ symbolsVolumeInfoObject }),
  setOriginSortedSymbols: (originSortedSymbols) => set({ originSortedSymbols }),
  setSortedSymbols: (sortedSymbols) => set({ sortedSymbols }),
  setSearchSymbol: (searchSymbol) => set({ searchSymbol }),
  setLastClickedSymbol: (symbol) => set({ lastClickedSymbol: symbol }),
  setSavedPage: (savedPage) => set({ savedPage }),
  setWatchlistsToBeExcluded: (watchlistsToBeExcluded) => set({ watchlistsToBeExcluded }),
  setNumberOfBindingDays: (numberOfBindingDays) => set({ numberOfBindingDays }),
  setNumberOfBinds: (numberOfBinds) => set({ numberOfBinds }),

  reset: () => set({
    typeIds: [],
    exchanges: [],
    selectedTypeIds: ["stock"],
    selectedExchangeIds: ["NASDAQ", "NYSE"],
    lastClickedSymbol: null,
  })
}));

export const useWatchlistStore = create<WatchlistStore>((set) => ({
  watchlist: [],
  watchlistObject: {},

  setWatchlist: (watchlist) => set({ watchlist }),
  setWatchlistObject: (watchlistObject) => set({ watchlistObject }),
}));