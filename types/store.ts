import {
  TypeRow, ExchangeRow, SymbolRow, SortedSymbolGrowths,
  ExchangesByCountry, GrowthOfSymbols, SymbolVolumeInfo,
  SymbolVolumeInfoArrayItem, OrgnizedWatchlistsObject
} from '@/types';


export interface AnalysisStore {
  typeIds: TypeRow["id"][];
  exchanges: ExchangesByCountry;
  selectedTypeIds: TypeRow["id"][];
  selectedExchangeIds: ExchangeRow["id"][];
  applyYearCount: boolean;
  yearsOfTable: number[];
  totalYears: number[];
  symbolGrowths: GrowthOfSymbols;
  originSortedSymbolGrowths: SortedSymbolGrowths;
  sortedSymbolGrowths: SortedSymbolGrowths;
  selectedYearCount: string | number;
  applyMinimumGrowth: boolean;
  minimumGrowth: number;
  applyMinimumOperatingIncomeRatio: boolean;
  minimumOperatingIncomeRatio: number;
  searchSymbol: string;
  lastClickedSymbol: SymbolRow["id"] | null;
  savedPage: number;
  watchlistsToBeExcluded: SymbolRow["id"][],
  showBBValues: boolean;
  filterUnderBBLower: boolean;
  filterUnderBBMiddle: boolean;
  BollingerObject: {
    [key: SymbolRow["id"]]: {
      lastUpper: number;
      lastMiddle: number;
      lastLower: number;
    };
  };
  filterLoading: boolean;

  setTypeIds: (typeIds: TypeRow["id"][]) => void;
  setExchanges: (exchanges: ExchangesByCountry) => void;
  setSelectedTypeIds: (selectedTypeIds: TypeRow["id"][]) => void;
  setSelectedExchangeIds: (selectedExchangeIds: ExchangeRow["id"][]) => void;
  setApplyYearCount: (applyYearCount: boolean) => void;
  setYearsOfTable: (yearsOfTable: number[]) => void;
  setTotalYears: (totalYears: number[]) => void;
  setSymbolGrowths: (symbolGrowths: GrowthOfSymbols) => void;
  setOriginSortedSymbolGrowths: (originSortedSymbolGrowths: SortedSymbolGrowths) => void;
  setSortedSymbolGrowths: (sortedSymbolGrowths: SortedSymbolGrowths) => void;
  setSelectedYearCount: (selectedYearCount: string | number) => void;
  setMinimumGrowth: (minimumGrowth: number) => void;
  setApplyMinimumGrowth: (applyMinimumGrowth: boolean) => void;
  setMinimumOperatingIncomeRatio: (minimumOperatingIncomeRatio: number) => void;
  setApplyMinimumOperatingIncomeRatio: (applyMinimumOperatingIncomeRatio: boolean) => void;
  setSearchSymbol: (searchSymbol: string) => void;
  setLastClickedSymbol: (lastClickedSymbol: SymbolRow["id"] | null) => void;
  setSavedPage: (savedPage: number) => void;
  setWatchlistsToBeExcluded: (watchlistsToBeExcluded: SymbolRow["id"][]) => void;
  setShowBBValues: (showBBValues: boolean) => void;
  setFilterUnderBBLower: (filterUnderBBLower: boolean) => void;
  setFilterUnderBBMiddle: (filterUnderBBMiddle: boolean) => void;
  setBollingerObject: (bollingerObject: {
    [key: SymbolRow["id"]]: {
      lastUpper: number;
      lastMiddle: number;
      lastLower: number;
    };
  }) => void;
  setFilterLoading: (filterLoading: boolean) => void;
  reset: () => void;
}

export interface AnalysisVolumeStore {
  typeIds: TypeRow["id"][];
  exchanges: ExchangesByCountry;
  selectedTypeIds: TypeRow["id"][];
  selectedExchangeIds: ExchangeRow["id"][];
  symbolsVolumeInfoObject: { [key: string]: SymbolVolumeInfo };
  originSortedSymbols: SymbolVolumeInfoArrayItem[],
  sortedSymbols: SymbolVolumeInfoArrayItem[],
  searchSymbol: string;
  lastClickedSymbol: SymbolRow["id"] | null;
  savedPage: number;
  watchlistsToBeExcluded: SymbolRow["id"][]
  numberOfBindingDays: number;
  numberOfBinds: number;

  setTypeIds: (typeIds: TypeRow["id"][]) => void;
  setExchanges: (exchanges: ExchangesByCountry) => void;
  setSelectedTypeIds: (selectedTypeIds: TypeRow["id"][]) => void;
  setSelectedExchangeIds: (selectedExchangeIds: ExchangeRow["id"][]) => void;
  setSymbolsVolumeInfoObject: (symbolsVolumeInfoObject: { [key: string]: SymbolVolumeInfo }) => void;
  setOriginSortedSymbols: (originSortedSymbols: SymbolVolumeInfoArrayItem[]) => void;
  setSortedSymbols: (sortedSymbols: SymbolVolumeInfoArrayItem[]) => void;
  setSearchSymbol: (searchSymbol: string) => void;
  setLastClickedSymbol: (lastClickedSymbol: SymbolRow["id"] | null) => void;
  setSavedPage: (savedPage: number) => void;
  setWatchlistsToBeExcluded: (watchlistsToBeExcluded: SymbolRow["id"][]) => void;
  setNumberOfBindingDays: (numberOfBindingDays: number) => void;
  setNumberOfBinds: (numberOfBinds: number) => void;
  reset: () => void;
}

export interface WatchlistStore {
  watchlist: SymbolRow["id"][];
  watchlistObject: OrgnizedWatchlistsObject;

  setWatchlist: (watchlist: SymbolRow["id"][]) => void;
  setWatchlistObject: (watchlistObject: OrgnizedWatchlistsObject) => void;
}