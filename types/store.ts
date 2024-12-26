import {
  TypeRow, ExchangeRow, SymbolRow, SortedSymbolGrowths,
  ExchangesByCountry, GrowthOfSymbols
} from '@/types';


export interface AnalysisStore {
  typeIds: TypeRow["id"][];
  exchanges: ExchangesByCountry;
  selectedTypeIds: TypeRow["id"][];
  selectedExchangeIds: ExchangeRow["id"][];
  yearsOfTable: number[];
  totalYears: number[];
  symbolGrowths: GrowthOfSymbols;
  sortedSymbolGrowths: SortedSymbolGrowths;
  selectedYearCount: string | number;
  minimumGrowth: number;
  minimumOperatingIncomeRatio: number;
  lastClickedSymbol: SymbolRow["id"] | null;

  setTypeIds: (typeIds: TypeRow["id"][]) => void;
  setExchanges: (exchanges: ExchangesByCountry) => void;
  setSelectedTypeIds: (selectedTypeIds: TypeRow["id"][]) => void;
  setSelectedExchangeIds: (selectedExchangeIds: ExchangeRow["id"][]) => void;
  setYearsOfTable: (yearsOfTable: number[]) => void;
  setTotalYears: (totalYears: number[]) => void;
  setSymbolGrowths: (symbolGrowths: GrowthOfSymbols) => void;
  setSortedSymbolGrowths: (sortedSymbolGrowths: SortedSymbolGrowths) => void;
  setSelectedYearCount: (selectedYearCount: string | number) => void;
  setMinimumGrowth: (minimumGrowth: number) => void;
  setMinimumOperatingIncomeRatio: (minimumOperatingIncomeRatio: number) => void;
  setLastClickedSymbol: (lastClickedSymbol: SymbolRow["id"] | null) => void;
  reset: () => void;
}