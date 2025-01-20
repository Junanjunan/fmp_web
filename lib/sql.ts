import { query } from '@/lib/db';
import * as dbTypes from '@/types/db';
import { prisma } from '@/lib/database/prisma';
import { Prisma } from '@prisma/client';


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
  exchangeIds: dbTypes.ExchangeRow['id'][],
  symbol: dbTypes.SymbolRow['id']
): Promise<dbTypes.SymbolWithProfile[]> => {
  let sql = `
    SELECT s.*, sp.*
    FROM symbols s
    LEFT JOIN symbol_profiles sp ON s.id = sp.symbol
    WHERE s.type_id IN (${typeIds.map(id => `'${id}'`).join(',')})
    AND s.exchange_id IN (${exchangeIds.map(id => `'${id}'`).join(',')})
    AND sp.is_actively_trading = true
  `;
  if (symbol) {
    sql += ` AND LOWER(s.id) LIKE LOWER('%${symbol}%');`;
  }
  const result = await query(sql);
  return result.rows;
}

export const getAllWatchLists = async (
  userEmail: string
) => {
  const watchLists = await prisma.user_symbols_list.findMany({
    where: { user_email: userEmail },
    include: { user_symbols: true }
  });
  return watchLists;
}

export const getWatchList = async (
  userEmail: string
): Promise<dbTypes.SymbolRow['id'][]> => {
  const userSymbols: dbTypes.UserSymbolRow[] = await prisma.user_symbols.findMany({
    where: { user_email: userEmail }
  });
  const symbols = userSymbols.map(symbol => symbol.symbol_id);
  return symbols;
}

export const getHistoricalPrices = async (
  exchange_id: dbTypes.ExchangeRow['id'],
  symbol: dbTypes.SymbolRow['id'],
): Promise<dbTypes.HistoricalPriceRow[]> => {
  const exchangeLower = exchange_id.toLowerCase();
  const dbName = `symbol_historical_price_full_${exchangeLower}`;
  const sql = `SELECT * FROM ${dbName} WHERE symbol = $1`;
  const result = await query(sql, [symbol]);
  return result.rows;
}

export const getSymbolsHistoricalPrices = async (
  exchange_id: dbTypes.ExchangeRow['id'],
  symbols: dbTypes.SymbolRow['id'][],
): Promise<dbTypes.HistoricalPriceRow[]> => {
  const exchangeLower = exchange_id.toLowerCase();
  const dbName = `symbol_historical_price_full_${exchangeLower}`;
  const symbolStrings = symbols.map(symbol => `'${symbol}'`).join(',');
  const sql = `
    SELECT *
    FROM ${dbName}
    WHERE symbol IN (${symbolStrings})
  `;
  const result = await query(sql);
  return result.rows;
}

export const getDatesOfSymbolsHistoricalPrices = async (
  exchange_id: dbTypes.ExchangeRow['id'],
): Promise<dbTypes.HistoricalPriceRow[]> => {
  const exchangeLower = exchange_id.toLowerCase();
  const dbName = `symbol_historical_price_full_${exchangeLower}`;
  const sql = `
    SELECT DISTINCT date AT TIME ZONE 'UTC' AS date
    FROM ${dbName}
    ORDER BY date DESC;
  `;
  const result = await query(sql);
  return result.rows;
}

export const getSymbolsHistoricalPricesByDate = async (
  exchange_id: dbTypes.ExchangeRow['id'],
  startDate: string,
  endDate: string
): Promise<dbTypes.HistoricalPriceRow[]> => {
  const exchangeLower = exchange_id.toLowerCase();
  const dbName = `symbol_historical_price_full_${exchangeLower}`;
  const sql = `
    SELECT *
    FROM ${dbName} AS shp
    LEFT JOIN symbol_profiles AS sp ON shp.symbol = sp.symbol
    WHERE shp.date BETWEEN $1 AND $2
    ORDER BY shp.symbol, shp.date DESC;
  `;
  const result = await query(sql, [startDate, endDate]);
  return result.rows;
}

export const insertSymbolToWatchList = async (
  userEmail: string,
  watchlistName: string,
  symbol: dbTypes.SymbolRow['id']
) => {
  try {
    const userSymbolsListId = (await prisma.user_symbols_list.findFirst({
      where: {
        user_email: userEmail,
        name: watchlistName
      }
    }))?.id;
    if (!userSymbolsListId) {
      return {
        success: false,
        message: 'Watchlist not found'
      };
    }

    await prisma.user_symbols.create({
      data: {
        user_email: userEmail,
        user_symbols_list_id: userSymbolsListId,
        symbol_id: symbol,
      },
    });

    return { success: true };
  } catch (e) {
    let message = 'Inserting into watchlist failed';
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      message = 'This symbol is already in your watchlist';
    }
    return {
      success: false,
      message: message
    };
  }
}

export const deleteSymbolFromWatchlist = async (
  userEmail: string,
  watchlistName: string,
  symbol: dbTypes.SymbolRow['id']
) => {
  const userSymbolsListId = (await prisma.user_symbols_list.findFirst({
    where: {
      user_email: userEmail,
      name: watchlistName
    }
  }))?.id;
  if (!userSymbolsListId) {
    return {
      success: false,
      message: 'Watchlist not found'
    };
  }

  try {
    await prisma.user_symbols.delete({
      where: {
        user_email_symbol_id_user_symbols_list_id: {
          user_email: userEmail,
          user_symbols_list_id: userSymbolsListId,
          symbol_id: symbol
        } 
      }
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: 'Deleting from watchlist failed'
    };
  }
}

export const insertNewWatchlist = async (
  userEmail: string,
  watchlistName: string,
) => {
  try {
    await prisma.user_symbols_list.create({
      data: {
        user_email: userEmail,
        name: watchlistName,
      },
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: 'insertNewWatchlist failed'
    };
  }
}