import { useState, useEffect, useRef } from 'react';
import { ExchangeRow, SortedSymbolGrowths, SymbolRow } from '@/types';
import { Button, CheckboxList } from '@/app/components/client/UI';
import Link from 'next/link';
import { useAnalysisStore, useWatchlistStore } from '@/app/stores/useStore';
import { useWatchlistData } from '@/hooks';
import { requestSymbolHistoricalPrices } from '@/app/axios';
import { calculateLastBollingerBands } from '@/lib/chart';
import { SymbolInfoObject } from '@/types/chart';
import { formatDate } from '@/lib/date';


export const RevenueTable = ({ filteredYears }: { filteredYears: number[] }) => {
  const lastClickedRowRef = useRef<HTMLTableRowElement | null>(null);
  const {
    symbolGrowths, yearsOfTable, minimumGrowth, minimumOperatingIncomeRatio,
    excludeWatchlist, applyYearCount, applyMinimumGrowth,
    applyMinimumOperatingIncomeRatio,
    sortedSymbolGrowths, setSortedSymbolGrowths,
    lastClickedSymbol, setLastClickedSymbol,
    showBBValues, setShowBBValues,
    filterUnderBBLower, setFilterUnderBBLower,
    filterUnderBBMiddle, setFilterUnderBBMiddle,
    BollingerObject, setBollingerObject,
    filterLoading, setFilterLoading,
  } = useAnalysisStore();
  const { watchlist } = useWatchlistStore();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortYearType, setSortYearType] = useState<'revenue' | 'operatingIncome' | null>(null);

  useWatchlistData();

  useEffect(() => {
    if (sortedSymbolGrowths.length > 0) {
      return;
    }
    setSortedSymbolGrowths(getSortedSymbolGrowths());
  }, [symbolGrowths, applyYearCount]);

  useEffect(() => {
    if (lastClickedSymbol && lastClickedRowRef.current) {
      lastClickedRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [lastClickedSymbol]);

  useEffect(() => {
    if (showBBValues) {
      setFilterLoading(true);
      const symbolInfoObject: { [key: SymbolRow['id']]: SymbolInfoObject[] } = {};
      const symbolBollingerObject: { [key: SymbolRow['id']]: { lastUpper: number, lastMiddle: number, lastLower: number } } = {};
      const exchangeSymbolsObject: { [key: ExchangeRow['id']]: SymbolRow['id'][] } = {};
      for (const symbolInfo of filteredSymbols) {
        const symbolId = symbolInfo[0];
        const exchangeId = symbolInfo[1].exchange_id;
        if (exchangeSymbolsObject[exchangeId]) {
          exchangeSymbolsObject[exchangeId].push(symbolId);
        } else {
          exchangeSymbolsObject[exchangeId] = [symbolId];
        }
      }
      for (const exchangeId in exchangeSymbolsObject) {
        const data = {
          db_name: `symbol_historical_price_full_${exchangeId.toLowerCase()}`,
          symbolIds: exchangeSymbolsObject[exchangeId] 
        }
        requestSymbolHistoricalPrices(data)
          .then(response => {
            for (const row of response.data) {
            if (row.symbol in symbolInfoObject) {
              symbolInfoObject[row.symbol].push(row);
            } else {
              symbolInfoObject[row.symbol] = [row];
            }
          }
          Object.entries(symbolInfoObject).forEach(([symbol, data]) => {
            data.sort(
              (a, b) => new Date(formatDate(b.date)).getTime() - new Date(formatDate(a.date)).getTime()
            );
            const { lastUpper, lastMiddle, lastLower } = calculateLastBollingerBands(data);
            symbolBollingerObject[symbol] = { lastUpper, lastMiddle, lastLower };
          });
          setBollingerObject(symbolBollingerObject);
          setFilterLoading(false);
        });
      }
    }
  }, [showBBValues])

  const executeFMP = async () => {
    const confirm = window.confirm('Are you sure you want to refresh the filtered symbols?');
    if (!confirm) {
      return;
    }

    const symbolsToBeAnalyzed = filteredSymbols.map(symbol => symbol[0]);
    try {
      const response = await fetch('/api/v1/fmp-server/symbols', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          params: {
            filePath: 'services.subprocess',
            method: 'update_filtered_symbols',
            symbols: symbolsToBeAnalyzed
          },
        }),
      });
      const data = await response.json();
      console.log(JSON.parse(data.result));
    } catch (error) {
      console.error('FMP execution error:', error);
    }
  }

  const handleSort = (column: string, yearType: string | null = null) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      if (yearType) {
        setSortYearType(yearType as 'revenue' | 'operatingIncome'); 
      }
      setSortColumn(column);
      setSortDirection('desc');
    }
    setSortedSymbolGrowths(getSortedSymbolGrowths());
  };

  function getSortedSymbolGrowths() {
    const _sortedSymbolGrowths: SortedSymbolGrowths = Object.entries(symbolGrowths).sort((a, b) => {
      if (!sortColumn) {
        return 0;
      }

      if (sortColumn === 'exchange') {
        return sortDirection === 'asc' 
          ? a[1].exchange_id.localeCompare(b[1].exchange_id)
          : b[1].exchange_id.localeCompare(a[1].exchange_id);
      }

      if (sortColumn === 'psRatio') {
        return sortDirection === 'asc' 
          ? a[1].psRatio - b[1].psRatio
          : b[1].psRatio - a[1].psRatio;
      }

      // For year columns
      const yearNum = parseInt(sortColumn);
      if (!isNaN(yearNum)) {
        if (sortYearType === 'revenue') {
          const aGrowth = a[1].growthArray.find(g => g.year === yearNum)?.growth || 0;
          const bGrowth = b[1].growthArray.find(g => g.year === yearNum)?.growth || 0;
          return sortDirection === 'asc' ? aGrowth - bGrowth : bGrowth - aGrowth;
        }
        if (sortYearType === 'operatingIncome') {
          const aOIRatio = a[1].operatingIncomeRatios.find(g => g.year === yearNum)?.ratio || 0;
          const bOIRatio = b[1].operatingIncomeRatios.find(g => g.year === yearNum)?.ratio || 0;
          return sortDirection === 'asc' ? aOIRatio - bOIRatio : bOIRatio - aOIRatio;
        }
      }

      return 0;
    });
    return _sortedSymbolGrowths;
  }

  const toggleArrow = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  const filteredSymbols: SortedSymbolGrowths = sortedSymbolGrowths.filter(symbolData => {
    const symbol = symbolData[0];
    const price = symbolData[1].price;
    const growthArray = symbolData[1].growthArray;
    const OIRatios = symbolData[1].operatingIncomeRatios;
    const thirdYear = Number(yearsOfTable[2]);
    const yearsOfSymbol = growthArray.map(growth => growth.year);
    if (!yearsOfSymbol.includes(thirdYear)) {
      return false;
    }
    if (applyYearCount) {
      if (Number(growthArray.at(-1)?.year) > Number(yearsOfTable.at(-1))) {
        return false;
      }
    }

    if (excludeWatchlist && watchlist.includes(symbol)) {
      return false;
    }

    if (!applyMinimumGrowth && !applyMinimumOperatingIncomeRatio) {
      return true;
    }

    if (showBBValues) {
      if (filterUnderBBLower && BollingerObject?.[symbol]?.lastLower < price) {
        return false;
      }
      if (filterUnderBBMiddle && BollingerObject?.[symbol]?.lastMiddle < price) {
        return false;
      }
    }

    for (let i = 0; i < growthArray.length; i++) {
      for (const year of yearsOfTable) {
        if (growthArray[i].year == year) {
          if (applyMinimumGrowth) {
            if (!growthArray[i].growth || growthArray[i].growth < minimumGrowth) {
              return false;
            }
          }
          if (applyMinimumOperatingIncomeRatio) {
            if (!OIRatios[i].ratio || OIRatios[i].ratio < minimumOperatingIncomeRatio) {
              return false;
            }
          }
        }
      }
    }
    return true;
  });

  return (
    <div>
      <span>{filteredSymbols.length} symbols found</span>
      <Button
        onClick={executeFMP}
        title="Refresh Filtered Symbols"
        isLoading={false}
        disabled={filteredSymbols.length === 0}
      />
      <div className="flex items-center h-20">
        <CheckboxList
          attributes={['Show BB values']}
          title=""
          defaultChecked={showBBValues ? ['Show BB values'] : []}
          onChange={() => {setShowBBValues(!showBBValues)}}
        />
      </div>
      <div className="flex items-center h-20 -mt-10">
        <CheckboxList
          attributes={['Filter Under BB Lower']}
          title=""
          defaultChecked={showBBValues ? ['Filter Under BB Lower'] : []}
          onChange={() => {setFilterUnderBBLower(!filterUnderBBLower)}}
        />
      </div>
      <div className="flex items-center h-20 -mt-10">
        <CheckboxList
          attributes={['Filter under BB Middle']}
          title=""
          defaultChecked={showBBValues ? ['Filter under BB Middle'] : []}
          onChange={() => {setFilterUnderBBMiddle(!filterUnderBBMiddle)}}
        />
      </div>
      <span className="text-red-500">{filterLoading ? 'Loading...' : ''}</span>
      <ColorInformation />
      <table className="table">
        <thead className="tableHeader">
          <tr>
            <th className="tableCell" rowSpan={2}>Growth (%)</th>
            <th className="tableCell" rowSpan={2}>Type</th>
            <th
              className="tableCell cursor-pointer"
              rowSpan={2}
              onClick={() => handleSort('exchange')}
            >
              Exchange{toggleArrow('exchange')}
            </th>
            <th className="tableCell" rowSpan={2}>Price</th>
            <th className="tableCell" rowSpan={2}>BB Lower</th>
            <th className="tableCell" rowSpan={2}>BB Middle</th>
            <th className="tableCell" rowSpan={2}>BB Upper</th>
            <th
              className="tableCell cursor-pointer"
              rowSpan={2}
              onClick={() => handleSort('psRatio')}
            >
              PS Ratio{toggleArrow('psRatio')}
            </th>
            <th className="tableCell" colSpan={filteredYears.length}>Revenue Growth(%)</th>
            <th className="tableCell" colSpan={filteredYears.length}>Operating Income Ratio(%)</th>
          </tr>
          <tr>
            {filteredYears.map((year) => (
              <th
                key={year}
                className="tableCell cursor-pointer"
                onClick={() => handleSort(year.toString(), 'revenue')}
              >
                {year}{toggleArrow(year.toString())}
              </th>
            ))}
            {filteredYears.map((year) => (
              <th
                key={year}
                className="tableCell cursor-pointer"
                onClick={() => handleSort(year.toString(), 'operatingIncome')}
              >
                {year}{toggleArrow(year.toString())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredSymbols.map(([
            symbol,
            { type_id, exchange_id, growthArray, operatingIncomeRatios, price, psRatio }
          ]) => (
            <tr
              key={symbol}
              ref={lastClickedSymbol === symbol ? lastClickedRowRef : null}
              className={
                lastClickedSymbol === symbol ? 'bg-blue-100' :
                watchlist.includes(symbol) ? 'bg-green-100' : ''
              }
            >
              <td className="tableCell">
                <Link
                  href={`/analysis/${symbol}`}
                  onClick={() => setLastClickedSymbol(symbol)}
                >
                  {symbol}
                </Link>
              </td>
              <td className="tableCell">{type_id}</td>
              <td className="tableCell">{exchange_id}</td>
              <td className="tableCell">{price}</td>
              <td className="tableCell">{BollingerObject?.[symbol]?.lastLower}</td>
              <td className="tableCell">{BollingerObject?.[symbol]?.lastMiddle}</td>
              <td className="tableCell">{BollingerObject?.[symbol]?.lastUpper}</td>
              <td className="tableCell">{psRatio}</td>
              {filteredYears.map((year) => (
                <td key={year} className="tableCell">
                  {growthArray.find(growth => growth.year == year)?.growth}
                </td>
              ))}
              {filteredYears.map((year, index) => {
                const OIRatio = operatingIncomeRatios.find(ratio => ratio.year == year)?.ratio;
                return (
                  <td key={index} className="tableCell">
                    {OIRatio}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const ColorCard = ({ color, title }: { color: string, title: string }) => (
  <div className="flex items-center mr-5">
    <div className={`w-5 h-5 ${color} inline-block mr-1`}></div>
    <span>{title}</span>
  </div>
);

const ColorInformation = () => (
  <div className="flex items-center mt-10">
    <ColorCard color="bg-blue-100" title="Last viewed symbol" />
    <ColorCard color="bg-green-100" title="Symbols in Watchlist" />
  </div>
);