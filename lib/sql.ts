import { query } from '@/lib/db';
import * as dbTypes from '@/types/db';


export const getTypes = async (
  types: dbTypes.TypeRow['id'][] | null = null
): Promise<dbTypes.TypeRow[]> => {
  let sql = `SELECT * FROM types`;
  if (types) {
    sql += ` WHERE id IN (${types.join(',')});`;
  }
  const result = await query(sql);
  return result.rows;
}

export const getExchanges = async (
  exchanges: dbTypes.ExchangeRow['id'][] | null = null
): Promise<dbTypes.ExchangeRow[]> => {
  let sql = `SELECT * FROM exchanges`;
  if (exchanges) {
    sql += ` WHERE id IN (${exchanges.join(',')});`;
  }
  const result = await query(sql);
  return result.rows;
}

export const getSymbol = async (
  symbol: dbTypes.SymbolRow['id']
): Promise<dbTypes.SymbolRow> => {
  const sql = `SELECT * FROM symbols WHERE id = $1`;
  const result = await query(sql, [symbol]);
  return result.rows[0];
}

export const getSymbols = async (
  symbols: dbTypes.SymbolRow['id'][] | null = null
): Promise<dbTypes.SymbolRow[]> => {
  let sql = `SELECT * FROM symbols`;
  if (symbols) {
    sql += ` WHERE id IN (${symbols.join(',')});`;
  }
  const result = await query(sql);
  return result.rows;
}

export const getFilteredSymbols = async(
  typeIds: dbTypes.TypeRow['id'][],
  exchangeIds: dbTypes.ExchangeRow['id'][]
): Promise<dbTypes.SymbolRow[]> => {
  const sql = `
    SELECT *
    FROM symbols
    WHERE type_id IN (${typeIds.map(id => `'${id}'`).join(',')})
    AND exchange_id IN (${exchangeIds.map(id => `'${id}'`).join(',')});
  `;
  const result = await query(sql);
  return result.rows;
}

export const getIncomeStatements = async (
  incomeStatements: dbTypes.IncomeStatementRow['symbol'][] | null = null
): Promise<dbTypes.IncomeStatementRow[]> => {
  let sql = `SELECT * FROM income_statements`;
  if (incomeStatements) {
    sql += ` WHERE symbol IN (${incomeStatements.join(',')});`;
  }
  const result = await query(sql);
  return result.rows;
}

export const getIncomeStatement = async (
  symbol: string
): Promise<dbTypes.IncomeStatementRow[]> => {
  const sql = `
    SELECT *
    FROM income_statements
    WHERE symbol = $1
    ORDER BY date DESC;
  `;
  const result = await query(sql, [symbol]);
  return result.rows as dbTypes.IncomeStatementRow[];
}

export const getYearsOfIncomeStatements = async (): Promise<number[]> => {
  const sql = `
    SELECT DISTINCT EXTRACT(YEAR FROM date)
    FROM income_statements
    ORDER BY extract DESC;
  `;
  const result = await query(sql);
  return result.rows.map((row: { extract: number }) => row.extract);
}

export const getSymbolProfile = async (
  symbol: dbTypes.SymbolRow['id']
): Promise<dbTypes.SymbolProfileRow> => {
  const sql = `SELECT * FROM symbol_profiles WHERE symbol = $1`;
  const result = await query(sql, [symbol]);
  return result.rows[0];
}

export const getFilteredSymbolsProfiles = async(
  typeIds: dbTypes.TypeRow['id'][],
  exchangeIds: dbTypes.ExchangeRow['id'][]
): Promise<dbTypes.SymbolWithProfile[]> => {
  const sql = `
    SELECT s.*, sp.*
    FROM symbols s
    LEFT JOIN symbol_profiles sp ON s.id = sp.symbol
    WHERE s.type_id IN (${typeIds.map(id => `'${id}'`).join(',')})
    AND s.exchange_id IN (${exchangeIds.map(id => `'${id}'`).join(',')})
    AND sp.is_actively_trading = true;
  `;
  const result = await query(sql);
  return result.rows;
}