import { NextResponse } from 'next/server';
import { SymbolRow } from '@/types/db';
import { getAllWatchlists, getIncomeStatement, getSymbolsProfilesInWatchlists } from '@/lib/sql';
import { getGrowthArray } from '@/lib/analysis';
import { getPercentageNumber } from '@/lib/math';
import { GrowthOfSymbols } from '@/types/analysis';
import { getServerSession_ } from "@/lib/auth/session";


export async function POST() {
  const session = await getServerSession_();
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized'
      },
      { status: 401 }
    );
  }

  const { email } = session.user;
  const allWatchlists = await getAllWatchlists(email);
  const symbolsSet = new Set<SymbolRow['id']>();

  for (const watchlistInfo of allWatchlists) {
    watchlistInfo.user_symbols.forEach(symbolInfo => {
      symbolsSet.add(symbolInfo.symbol_id);
    })
  }

  const symbolsArray = Array.from(symbolsSet);
  const symbolRows = await getSymbolsProfilesInWatchlists(symbolsArray);
  const growthOfSymbols: GrowthOfSymbols = {};

  for (const symbolRow of symbolRows) {
    const { id, type_id, exchange_id, mkt_cap, price } = symbolRow;
    const incomeStatements = await getIncomeStatement(id);
    if (incomeStatements.length === 0) {
      console.log(`No income statements found for ${id}`);
      continue;
    }
    const revenueGrowthArray = await getGrowthArray(incomeStatements, 'revenue');
    const operatingIncomeRatios = incomeStatements.map(incomeStatement => ({
      year: incomeStatement.date.getFullYear(),
      ratio: getPercentageNumber(incomeStatement.operating_income_ratio as number)
    }));
    const latestIncomeStatement = incomeStatements.reduce((max, current) => {
      return new Date(current.date) > new Date(max.date) ? current : max;
    }, incomeStatements[0]);
    const latestRevenue = latestIncomeStatement.revenue ? latestIncomeStatement.revenue : -1;
    const psRatio = Math.round(mkt_cap / latestRevenue * 100) / 100;

    growthOfSymbols[id] = {
      type_id,
      exchange_id,
      price,
      psRatio,
      growthArray: revenueGrowthArray,
      operatingIncomeRatios,
    };
  }

  return NextResponse.json(growthOfSymbols);
}