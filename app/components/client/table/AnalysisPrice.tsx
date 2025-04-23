import { useEffect, useRef, useState } from 'react';
import { Button } from '@/app/components/client/UI';
import Link from 'next/link';
import { useAnalysisPriceStore, useWatchlistStore } from '@/app/stores/useStore';
import { useWatchlistData, usePagination } from '@/hooks';


export const AnalysisPriceTable = () => {
  const lastClickedRowRef = useRef<HTMLTableRowElement | null>(null);
  const {
    watchlistsToBeExcluded,
    symbolPriceInfos,
    lastClickedSymbol, setLastClickedSymbol,
    sortedSymbols, setSortedSymbols,
    originSortedSymbols,
    savedPage, setSavedPage,
  } = useAnalysisPriceStore();
  const { watchlist } = useWatchlistStore();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const {
    currentItems: currentSymbols,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToSpecificPage,
  } = usePagination(sortedSymbols, 20, savedPage);

  useWatchlistData();

  useEffect(() => {
    setSavedPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (lastClickedSymbol && lastClickedRowRef.current) {
      lastClickedRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [lastClickedSymbol]);

  useEffect(() => {
    const filteredSymbols = originSortedSymbols.filter(symbolInfo => {
      return !watchlistsToBeExcluded.includes(symbolInfo.symbol);
    });
    setSortedSymbols(filteredSymbols);
  }, [watchlistsToBeExcluded]);

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
    } catch (error) {
      console.error('FMP execution error:', error);
    }
  }

  const symbolDatas = Object.entries(symbolPriceInfos).filter(([symbol, _]) => {
    if (watchlistsToBeExcluded.includes(symbol)) {
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

      return 0;
    })
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

  const toggleArrow = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? '↑' : '↓';
    }
    return '';
  }

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
        <thead className="tableHeader sticky top-0 z-10">
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
          </tr>
        </thead>
        <tbody>
          {currentSymbols.map(({
            symbol, type_id, exchange_id, price
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
                  href={`/analysis/${exchange_id}/${symbol}`}
                  onClick={() => setLastClickedSymbol(symbol)}
                >
                  {symbol}
                </Link>
              </td>
              <td className="tableCell">{type_id}</td>
              <td className="tableCell">{exchange_id}</td>
              <td className="tableCell">{price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <Button
          onClick={() => goToSpecificPage(1)}
          title="To First"
          isLoading={null}
          disabled={currentPage === 1}
        />
        <Button
          onClick={goToPreviousPage}
          title="Previous"
          isLoading={null}
          disabled={currentPage === 1}
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