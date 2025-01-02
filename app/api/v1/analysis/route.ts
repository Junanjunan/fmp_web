import { NextResponse } from 'next/server';
import { FilteredIds } from '@/types/db';
import { getFilteredSymbolsProfiles, getIncomeStatement } from '@/lib/sql';
import { getGrowthArray } from '@/lib/analysis';
import { getPercentageNumber } from '@/lib/math';
import { GrowthOfSymbols } from '@/types/analysis';


export async function POST(request: Request) {
  const data: FilteredIds = await request.json();
  const typeIds = data.typeIds;
  const exchangeIds = data.exchangeIds;
  const symbol = data.symbol;
  const symbolRows = await getFilteredSymbolsProfiles(typeIds, exchangeIds, symbol);
  const growthOfSymbols: GrowthOfSymbols = {};

  for (const symbolRow of symbolRows) {
    const { id, type_id, exchange_id, mkt_cap } = symbolRow;
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
      psRatio,
      growthArray: revenueGrowthArray,
      operatingIncomeRatios,
    };
  }

  return NextResponse.json(growthOfSymbols);
}