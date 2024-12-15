import { getIncomeStatement } from '@/lib/sql';
import { SymbolRow, IncomeStatementRow, GrowthArray } from '@/types';
import { getGrowth } from '@/lib/math';


export const getGrowthArray = async (
  symbol: SymbolRow["id"],
  attribute: keyof IncomeStatementRow
): Promise<GrowthArray[]> => {
  const incomeStatements = await getIncomeStatement(symbol);
  const growthArray: GrowthArray[] = [];
  for (let i = 0; i < incomeStatements.length - 1; i++) {
    const currentYear: IncomeStatementRow = incomeStatements[i];
    const previousYear: IncomeStatementRow = incomeStatements[i + 1];

    let currentValue = currentYear[attribute];
    let previousValue = previousYear[attribute];

    if (typeof currentValue !== 'number' || typeof previousValue !== 'number') {
      try {
        currentValue = parseFloat(currentValue as string);
        previousValue = parseFloat(previousValue as string);
      } catch (error) {
        console.error(`Error parsing ${attribute} for ${symbol}:`, error);
        continue;
      }
    }

    const growth = getGrowth(currentValue, previousValue);
    const year = currentYear.date.getFullYear();
    growthArray.push({ year, growth });
  }
  return growthArray;
}