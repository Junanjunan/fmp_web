import { SymbolRow, TypeRow, ExchangeRow } from './db';


export interface GrowthArray {
  year: number;
  growth: number;
}

export interface RatioArray {
  year: number;
  ratio: number;
}

export interface GrowthOfSymbols {
  [key: SymbolRow["id"]]: {
    type_id: TypeRow["id"];
    exchange_id: ExchangeRow["id"];
    psRatio: number;
    growthArray: GrowthArray[];
    operatingIncomeRatios: RatioArray[];
  };
}

export type SortedSymbolGrowths = [
  SymbolRow["id"],
  GrowthOfSymbols[SymbolRow["id"]]
][];