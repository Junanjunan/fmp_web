import { SymbolRow, TypeRow, ExchangeRow } from './db';


export interface GrowthArray {
  year: number;
  growth: number;
}

export interface RatioArray {
  year: number;
  ratio: number;
}

export interface PriceInfoOfSymbols {
  [key: SymbolRow["id"]]: {
    type_id: TypeRow["id"];
    exchange_id: ExchangeRow["id"];
    price: number;
  };
}

export interface GrowthOfSymbols {
  [key: SymbolRow["id"]]: {
    type_id: TypeRow["id"];
    exchange_id: ExchangeRow["id"];
    price: number;
    psRatio: number;
    growthArray: GrowthArray[];
    operatingIncomeRatios: RatioArray[];
  };
}

export type SortedSymbolGrowths = [
  SymbolRow["id"],
  GrowthOfSymbols[SymbolRow["id"]]
][];

export interface SymbolVolumeInfo {
  type_id: string,
  exchange_id: string;
  price: number;
  lastAdjustedAmount: number;
  mkt_cap: number | null;
  volumeArray: number[];
}

export interface SymbolVolumeInfoArrayItem extends SymbolVolumeInfo {
  symbol: SymbolRow["id"];
}