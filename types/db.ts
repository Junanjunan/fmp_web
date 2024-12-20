export interface TypeRow {
  id: string;
}

export interface ExchangeRow {
  id: string;
  name: string;
  country_id: string;
}

export type ExchangesByCountry = {
  id: ExchangeRow["country_id"];
  infoArray: { id: ExchangeRow["id"]; name: ExchangeRow["name"] }[];
}[];

export interface SymbolRow {
  id: string;
  name: string;
  price: number;
  type_id: TypeRow["id"];
  exchange_id: ExchangeRow["id"];
  is_updated: boolean;
  is_existing: boolean;
  updated_at: Date;
}

export interface IncomeStatementRow {
  symbol: string;
  date: Date;
  period: string;
  reported_currency?: string;
  cik?: string;
  filling_date?: Date;
  accepted_date?: Date;
  calendar_year?: string;
  revenue?: number;
  cost_of_revenue?: number;
  gross_profit?: number;
  gross_profit_ratio?: number;
  research_and_development_expenses?: number;
  general_and_administrative_expenses?: number;
  selling_and_marketing_expenses?: number;
  selling_general_and_administrative_expenses?: number;
  other_expenses?: number;
  operating_expenses?: number;
  cost_and_expenses?: number;
  interest_income?: number;
  interest_expense?: number;
  depreciation_and_amortization?: number;
  ebitda?: number;
  ebitda_ratio?: number;
  operating_income?: number;
  operating_income_ratio?: number;
  total_other_income_expenses_net?: number;
  income_before_tax?: number;
  income_before_tax_ratio?: number;
  income_tax_expense?: number;
  net_income?: number;
  net_income_ratio?: number;
  eps?: number;
  eps_diluted?: number;
  weighted_average_shs_out?: number;
  weighted_average_shs_out_dil?: number;
  link?: string;
  final_link?: string;
}

export interface SearchFilters {
  types: TypeRow[];
  exchanges: ExchangeRow[];
}

export interface FilteredIds {
  typeIds: TypeRow["id"][];
  exchangeIds: ExchangeRow["id"][];
}

export interface SymbolProfileRow {
  symbol: string;
  exchange_short_name: string;
  price: number;
  beta: number;
  vol_avg: number;
  mkt_cap: number;
  last_div: number;
  range: string;
  changes: number;
  company_name: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  full_time_employees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcf_diff: number;
  dcf: number;
  image: string;
  ipo_date: string;
  default_image: boolean;
  is_etf: boolean;
  is_actively_trading: boolean;
  is_adr: boolean;
  is_fund: boolean;
}