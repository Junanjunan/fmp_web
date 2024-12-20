import { SymbolRow, TypeRow, ExchangeRow } from './db';


export interface GrowthArray {
  year: number;
  growth: number;
}

export interface GrowthOfSymbols {
  [key: SymbolRow["id"]]: {
    type_id: TypeRow["id"];
    exchange_id: ExchangeRow["id"];
    growthArray: GrowthArray[];
  };
}