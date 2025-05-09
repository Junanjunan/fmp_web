import { IncomeStatementRow, GrowthArray } from '@/types';
import { getGrowth } from '@/lib/math';


export const getGrowthArray = async (
  incomeStatements: IncomeStatementRow[],
  attribute: keyof IncomeStatementRow
): Promise<GrowthArray[]> => {
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
        console.error(`Error parsing ${attribute} for income_statements:`, error);
        continue;
      }
    }

    const growth = getGrowth(currentValue, previousValue);
    const year = currentYear.date.getFullYear();

    let growthOfGrowth = 0;
    if (i < incomeStatements.length - 2) {
      const thirdYear: IncomeStatementRow = incomeStatements[i + 2];
      let thirdValue = thirdYear[attribute];
      if (typeof thirdValue !== 'number') {
        try {
          thirdValue = parseFloat(thirdValue as string);
          const growth2 = getGrowth(previousValue, thirdValue);
          growthOfGrowth = getGrowth(growth, growth2);
        } catch (error) {
          console.error(`Error parsing ${attribute} for income_statements:`, error);
          continue;
        }
      }

    }

    growthArray.push({ year, growth, growthOfGrowth });
  }
  return growthArray;
}