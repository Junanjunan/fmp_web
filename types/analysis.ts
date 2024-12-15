import { SymbolRow } from './db';


export interface GrowthArray {
  year: number;
  growth: number;
}

export interface GrowthOfSymbols {
  [key: SymbolRow["id"]]: GrowthArray[];
}