import { GrowthOfSymbols } from '@/types';


export const RevenueTable = (
  { filteredYears, symbolGrowths, years, minimumGrowth }: 
  { filteredYears: number[], symbolGrowths: GrowthOfSymbols, years: number[], minimumGrowth: number }
) => (
  <table className="min-w-full border border-gray-300 mt-4">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 px-4 py-2">Growth (%)</th>
        {filteredYears.map((year) => (
          <th key={year} className="border border-gray-300 px-4 py-2">{year}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Object.entries(symbolGrowths).map(([symbol, growthArray]) => {
        const thirdYear = Number(years[2]);
        const yearsOfSymbol = growthArray.map(growth => growth.year);
        if (!yearsOfSymbol.includes(thirdYear)) {
          return null;
        }

        for (let i = 0; i < growthArray.length; i++) {
          for (const year of years) {
            if (growthArray[i].year == year) {
              if (!growthArray[i].growth || growthArray[i].growth < minimumGrowth) {
                return null;
              }
            }
          }
        }

        return (
          <tr key={symbol}>
            <td className="border border-gray-300 px-4 py-2">{symbol}</td>
            {filteredYears.map((year) => (
              <td key={year} className="border border-gray-300 px-4 py-2">
                {growthArray.find(growth => growth.year == year)?.growth}
              </td>
            ))}
          </tr>
        )
      })}
    </tbody>
  </table>
);