import { useState } from 'react';
import { GrowthOfSymbols, SortedSymbolGrowths } from '@/types';


export const RevenueTable = (
  { filteredYears, symbolGrowths, years, minimumGrowth }: 
  { filteredYears: number[], symbolGrowths: GrowthOfSymbols, years: number[], minimumGrowth: number }
) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedSymbolGrowths: SortedSymbolGrowths = Object.entries(symbolGrowths).sort((a, b) => {
    if (!sortColumn) {
      return 0;
    }

    if (sortColumn === 'exchange') {
      return sortDirection === 'asc' 
        ? a[1].exchange_id.localeCompare(b[1].exchange_id)
        : b[1].exchange_id.localeCompare(a[1].exchange_id);
    }

    // For year columns
    const yearNum = parseInt(sortColumn);
    if (!isNaN(yearNum)) {
      const aGrowth = a[1].growthArray.find(g => g.year === yearNum)?.growth || 0;
      const bGrowth = b[1].growthArray.find(g => g.year === yearNum)?.growth || 0;
      return sortDirection === 'asc' ? aGrowth - bGrowth : bGrowth - aGrowth;
    }

    return 0;
  });

  const toggleArrow = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  const filteredSymbols: SortedSymbolGrowths = sortedSymbolGrowths.filter(symbolData => {
    const growthArray = symbolData[1].growthArray;
    const thirdYear = Number(years[2]);
    const yearsOfSymbol = growthArray.map(growth => growth.year);
    if (!yearsOfSymbol.includes(thirdYear)) {
      return false;
    }
    for (let i = 0; i < growthArray.length; i++) {
      for (const year of years) {
        if (growthArray[i].year == year) {
          if (!growthArray[i].growth || growthArray[i].growth < minimumGrowth) {
            return false;
          }
        }
      }
    }
    return true;
  });

  return (
    <table className="table">
      <thead className="tableHeader">
        <tr>
          <th className="tableCell">Growth (%)</th>
          <th className="tableCell">Type</th>
          <th 
            className="tableCell cursor-pointer"
            onClick={() => handleSort('exchange')}
          >
            Exchange{toggleArrow('exchange')}
          </th>
          {filteredYears.map((year) => (
            <th 
              key={year} 
              className="tableCell cursor-pointer"
              onClick={() => handleSort(year.toString())}
            >
              {year}{toggleArrow(year.toString())}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filteredSymbols.map(([symbol, { type_id, exchange_id, growthArray }]) => (
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
        ))}
      </tbody>
    </table>
  );
}