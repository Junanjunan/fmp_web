import { GrowthOfSymbols } from '@/types';


export const RevenueTable = (
  { filteredYears, symbolGrowths, years, minimumGrowth }: 
  { filteredYears: number[], symbolGrowths: GrowthOfSymbols, years: number[], minimumGrowth: number }
) => (
  <table className="table">
    <thead className="tableHeader">
      <tr>
        <th className="tableCell">Growth (%)</th>
        <th className="tableCell">Type</th>
        <th className="tableCell">Exchange</th>
        {filteredYears.map((year) => (
          <th key={year} className="tableCell">{year}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Object.entries(symbolGrowths).map(([
        symbol, { type_id, exchange_id, growthArray }
      ]) => {
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
            <td className="tableCell">{symbol}</td>
            <td className="tableCell">{type_id}</td>
            <td className="tableCell">{exchange_id}</td>
            {filteredYears.map((year) => (
              <td key={year} className="tableCell">
                {growthArray.find(growth => growth.year == year)?.growth}
              </td>
            ))}
          </tr>
        )
      })}
    </tbody>
  </table>
);