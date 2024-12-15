import { NextResponse } from 'next/server';
import { FilteredIds } from '@/types/db';
import { getFilteredSymbols, getIncomeStatement } from '@/lib/sql';
import { getGrowthArray } from '@/lib/analysis';
import { GrowthOfSymbols } from '@/types/analysis';


export async function POST(request: Request) {
  const data: FilteredIds = await request.json();
  const typeIds = data.typeIds;
  const exchangeIds = data.exchangeIds;
  const symbolRows = await getFilteredSymbols(typeIds, exchangeIds);
  const growthOfSymbols: GrowthOfSymbols = {};

  for (const symbolRow of symbolRows) {
    const symbol = symbolRow.id;
    const incomeStatements = await getIncomeStatement(symbol);
    if (incomeStatements.length === 0) {
      console.log(`No income statements found for ${symbol}`);
      continue;
    }
    const revenueGrowthArray = await getGrowthArray(symbol, 'revenue');
    growthOfSymbols[symbol] = revenueGrowthArray;
  }

  return NextResponse.json(growthOfSymbols);
}