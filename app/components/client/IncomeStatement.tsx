import React, { useState, useEffect, useRef } from 'react';
import { ExchangeRow, SortedSymbolGrowths, SymbolRow } from '@/types';
import { Button, CheckboxList } from '@/app/components/client/UI';
import Link from 'next/link';
import { useAnalysisStore, useWatchlistStore } from '@/app/stores/useStore';
import { useWatchlistData, usePagination } from '@/hooks';
import { requestSymbolHistoricalPrices } from '@/app/axios';
import { calculateLastBollingerBands } from '@/lib/chart';
import { SymbolInfoObject } from '@/types/chart';
import { formatDate } from '@/lib/date';
import { WatchlistToggleBtn } from '@/app/components/client/Watchlist/WatchlistToggleBtn';


export const RevenueTable = (
  { filteredYears, isOnlyPriceInfo }:
    { filteredYears: number[], isOnlyPriceInfo: boolean }
) => {
  const lastClickedRowRef = useRef<HTMLTableRowElement | null>(null);
  const {
    symbolGrowths, yearsOfTable, watchlistsToBeExcluded,
    minimumPERatio, minimumGrowthOfGrowth, minimumGrowth, minimumOperatingIncomeRatio,
    applyMinimumPERatio, applyYearCount, applyMinimumGrowthOfGrowth,
    applyMinimumGrowth, applyMinimumOperatingIncomeRatio,
    sortedSymbolGrowths, setSortedSymbolGrowths,
    originSortedSymbolGrowths, setOriginSortedSymbolGrowths,
    lastClickedSymbol, setLastClickedSymbol,
    showBBValues, setShowBBValues,
    filterUnderBBLower, setFilterUnderBBLower,
    filterUnderBBMiddle, setFilterUnderBBMiddle,
    BollingerObject, setBollingerObject,
    filterLoading, setFilterLoading,
    savedPage, setSavedPage,
  } = useAnalysisStore();
  const { watchlist } = useWatchlistStore();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortYearType, setSortYearType] = useState<'revenue' | 'operatingIncome' | 'growthOfGrowthOfRevenue' | null>(null);

  const filteredSymbols: SortedSymbolGrowths = sortedSymbolGrowths.filter(symbolData => {
    const symbol = symbolData[0];
    const price = symbolData[1].price;
    const peRatio = symbolData[1].peRatio;
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

    if (watchlistsToBeExcluded.includes(symbol)) {
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
          if (applyMinimumGrowthOfGrowth) {
            if (!growthArray[i].growthOfGrowth || growthArray[i].growthOfGrowth < minimumGrowthOfGrowth) {
              return false;
            }
          }
          if (applyMinimumPERatio) {
            if (peRatio < minimumPERatio) {
              return false;
            }
          }
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

  const {
    currentItems: currentSymbols,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToSpecificPage,
  } = usePagination(filteredSymbols, 20, savedPage);

  useWatchlistData();

  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    setSavedPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (sortedSymbolGrowths.length > 0) {
      return;
    }
    const sortedSymbolGrowths_ = getSortedSymbolGrowths();
    setSortedSymbolGrowths(sortedSymbolGrowths_);
    setOriginSortedSymbolGrowths(sortedSymbolGrowths_);
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
    const filteredSymbols = originSortedSymbolGrowths.filter(symbolInfo => {
      return !watchlistsToBeExcluded.includes(symbolInfo[0]);
    });
    setSortedSymbolGrowths(filteredSymbols);
  }, [watchlistsToBeExcluded]);

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
          exchange_id: exchangeId,
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: {
            filePath: 'services.subprocess',
            method: 'update_filtered_symbols',
            symbols: symbolsToBeAnalyzed
          },
        }),
      });
      const data = await response.json();
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

  const handleHeaderCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setIsAllSelected(true);
      setSelectedRows(
        currentSymbols.map(([symbol, { exchange_id }]) => `${symbol}::${exchange_id}`)
      );
    } else {
      setIsAllSelected(false);
      setSelectedRows([]);
    }
  }

  const handleRowCheckboxChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
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

      if (sortColumn === 'peRatio') {
        return sortDirection === 'asc'
          ? a[1].peRatio - b[1].peRatio
          : b[1].peRatio - a[1].peRatio;
      }

      if (sortColumn === 'eps') {
        return sortDirection === 'asc'
          ? a[1].eps - b[1].eps
          : b[1].eps - a[1].eps;
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
        if (sortYearType === 'growthOfGrowthOfRevenue') {
          const aGrowth = a[1].growthArray.find(g => g.year === yearNum)?.growthOfGrowth || 0;
          const bGrowth = b[1].growthArray.find(g => g.year === yearNum)?.growthOfGrowth || 0;
          return sortDirection === 'asc' ? aGrowth - bGrowth : bGrowth - aGrowth;
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
          onChange={() => { setShowBBValues(!showBBValues) }}
        />
      </div>
      <div className="flex items-center h-20 -mt-10">
        <CheckboxList
          attributes={['Filter Under BB Lower']}
          title=""
          defaultChecked={showBBValues ? ['Filter Under BB Lower'] : []}
          onChange={() => { setFilterUnderBBLower(!filterUnderBBLower) }}
        />
      </div>
      <div className="flex items-center h-20 -mt-10">
        <CheckboxList
          attributes={['Filter under BB Middle']}
          title=""
          defaultChecked={showBBValues ? ['Filter under BB Middle'] : []}
          onChange={() => { setFilterUnderBBMiddle(!filterUnderBBMiddle) }}
        />
      </div>
      <span className="text-red-500">{filterLoading ? 'Loading...' : ''}</span>
      <ColorInformation />
      <WatchlistToggleBtn symbolWithExchangeArrayData={selectedRows} />
      <table className="table">
        <thead className="tableHeader sticky top-0 z-10">
          <tr>
            <th className="tableCell" rowSpan={2}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleHeaderCheckboxChange}
              />
            </th>
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
            <th
              className="tableCell cursor-pointer"
              rowSpan={2}
              onClick={() => handleSort('peRatio')}
            >
              PE Ratio{toggleArrow('peRatio')}
            </th>
            <th
              className="tableCell cursor-pointer"
              rowSpan={2}
              onClick={() => handleSort('eps')}
            >
              EPS{toggleArrow('eps')}
            </th>
            {isOnlyPriceInfo ? null :
              <>
                <th className="tableCell" colSpan={filteredYears.length}>Growth of Revenue Growth(%)</th>
                <th className="tableCell" colSpan={filteredYears.length}>Revenue Growth(%)</th>
                <th className="tableCell" colSpan={filteredYears.length}>Operating Income Ratio(%)</th>
              </>
            }
          </tr>
          <tr>
            {isOnlyPriceInfo ? null : filteredYears.map((year) => (
              <th
                key={year}
                className="tableCell cursor-pointer"
                onClick={() => handleSort(year.toString(), 'growthOfGrowthOfRevenue')}
              >
                {year}{toggleArrow(year.toString())}
              </th>
            ))}
            {isOnlyPriceInfo ? null : filteredYears.map((year) => (
              <th
                key={year}
                className="tableCell cursor-pointer"
                onClick={() => handleSort(year.toString(), 'revenue')}
              >
                {year}{toggleArrow(year.toString())}
              </th>
            ))}
            {isOnlyPriceInfo ? null : filteredYears.map((year) => (
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
          {currentSymbols.map(([
            symbol,
            {
              type_id,
              exchange_id,
              growthArray,
              operatingIncomeRatios,
              price,
              psRatio,
              peRatio,
              eps,
            }
          ]) => {
            const rowId = `${symbol}::${exchange_id}`;
            return (
              <tr
                key={symbol}
                ref={lastClickedSymbol === symbol ? lastClickedRowRef : null}
                className={
                  lastClickedSymbol === symbol ? 'bg-blue-100' :
                    watchlist.includes(symbol) ? 'bg-green-100' : ''
                }
              >
                <td className="tableCell">
                  <input
                    type="checkbox"
                    id={rowId}
                    checked={selectedRows.includes(rowId)}
                    onChange={handleRowCheckboxChange(rowId)}
                  />
                </td>
                <td className="tableCell">
                  <Link
                    href={`/analysis/${exchange_id}/${symbol}`}
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
                <td className="tableCell">{peRatio}</td>
                <td className="tableCell">{eps}</td>
                {filteredYears.map((year) => (
                  <td key={year} className="tableCell">
                    {growthArray.find(growth => growth.year == year)?.growthOfGrowth}
                  </td>
                ))}
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
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <Button
          onClick={() => goToSpecificPage(1)}
          title="To First"
          isLoading={null}
          disabled={savedPage === 1}
        />
        <Button
          onClick={goToPreviousPage}
          title="Previous"
          isLoading={null}
          disabled={savedPage === 1}
        />
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={goToNextPage}
          title="Next"
          isLoading={null}
          disabled={currentPage === totalPages}
        />
        <Button
          onClick={() => goToSpecificPage(totalPages)}
          title="To Last"
          isLoading={null}
          disabled={currentPage === totalPages}
        />
      </div>
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