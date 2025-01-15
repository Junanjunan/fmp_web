import { useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/client/UI';
import Link from 'next/link';
import { useAnalysisVolumeStore, useWatchlistStore } from '@/app/stores/useStore';
import { useWatchlistData } from '@/hooks';


export const AnalysisVolumeTable = () => {
  const lastClickedRowRef = useRef<HTMLTableRowElement | null>(null);
  const {
    excludeWatchlist,
    symbolsVolumeInfoObject,
    numberOfBinds,
    lastClickedSymbol, setLastClickedSymbol,
    sortedSymbols, setSortedSymbols
  } = useAnalysisVolumeStore();
  const { watchlist } = useWatchlistStore();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useWatchlistData();

  useEffect(() => {
    if (lastClickedSymbol && lastClickedRowRef.current) {
      lastClickedRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [lastClickedSymbol]);

  const executeFMP = async () => {
    const confirm = window.confirm('Are you sure you want to refresh the filtered symbols?');
    if (!confirm) {
      return;
    }

    const symbolsToBeAnalyzed = symbolDatas.map(symbol => symbol[0]);
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

  const symbolDatas = Object.entries(symbolsVolumeInfoObject).filter(([symbol, _]) => {
    if (excludeWatchlist && watchlist.includes(symbol)) {
      return false;
    }

    return true;
  });

  function getSortedSymbols() {
    const _sortedSymbols = [...sortedSymbols];

    _sortedSymbols.sort((a, b) => {
      if (!sortColumn) {
        return 0;
      }

      if (sortColumn === 'lastAdjustedAmount') {
        return sortDirection === 'asc'
          ? a.lastAdjustedAmount - b.lastAdjustedAmount
          : b.lastAdjustedAmount - a.lastAdjustedAmount;
      }

      return 0;
    })
    console.log(_sortedSymbols)
    return _sortedSymbols;
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
    setSortedSymbols(getSortedSymbols());
  };

  return (
    <div>
      <span>{symbolDatas.length} symbols found</span>
      <Button
        onClick={executeFMP}
        title="Refresh Filtered Symbols"
        isLoading={false}
        disabled={symbolDatas.length === 0}
      />
      <ColorInformation />
      <table className="table">
        <thead className="tableHeader">
          <tr>
            <th className="tableCell">Symbol</th>
            <th className="tableCell">Type</th>
            <th
              className="tableCell cursor-pointer"
              rowSpan={2}
            >
              Exchange
            </th>
            <th className="tableCell">Price</th>
            <th className="tableCell">Market Cap</th>
            <th
              className="tableCell"
              onClick={() => handleSort('lastAdjustedAmount')}
            >
              Last adjusted amount <br />
              (price * bind_of_days_0 / market_cap * 100)
            </th>
            {Array.from({ length: numberOfBinds }).map((_, index) => (
              <th key={index}>Binds of days {index}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedSymbols.map(({
            symbol, type_id, exchange_id, price, lastAdjustedAmount, mkt_cap, volumeArray
          }) => (
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
              <td className="tableCell">{mkt_cap}</td>
              <td className="tableCell">{lastAdjustedAmount}</td>
              {Array.from({ length: numberOfBinds }).map((_, index) => (
                <td key={index} className="tableCell">
                  {volumeArray[index]}
                </td>
              ))}
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