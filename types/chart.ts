export interface PriceData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SymbolInfoObject extends PriceData {
  symbol: string;
  date: Date;
}

export interface ChartProps {
  data: PriceData[];
}