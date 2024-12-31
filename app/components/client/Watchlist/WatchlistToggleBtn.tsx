'use client';

import { useState, useEffect } from 'react';
import { SymbolRow } from '@/types';
import { requestGetWatchList, requestInsertWatchList } from '@/app/axios';


export const WatchlistToggleBtn = ({ symbol }: { symbol: SymbolRow["id"] }) => {
  const [isInWatchListState, setIsInWatchListState] = useState(false);

  useEffect(() => {
    const fetchWatchList = async () => {
      const { watchlist } = await requestGetWatchList();
      setIsInWatchListState(watchlist.includes(symbol));
    }
    fetchWatchList();
  }, [symbol]);

  const handleToggleWatchlist = async () => {
    if (isInWatchListState) {
      // Remove from watchlist
      setIsInWatchListState(false);
    } else {
      // Add to watchlist
      try {
        await requestInsertWatchList({ symbol });
        setIsInWatchListState(true);
      } catch (e: any) {
        alert(e.response?.data?.message || 'An error occurred');
      }
    }
  }

  return (
    <>
    {isInWatchListState ? (
      <span onClick={handleToggleWatchlist} className="text-gray-500 border border-gray-500 px-2 py-1 ml-2 cursor-pointer">Remove from Watchlist</span>
    ) : (
      <span onClick={handleToggleWatchlist} className="text-blue-500 border border-blue-500 px-2 py-1 ml-2 cursor-pointer">Add to Watchlist</span>
    )}
    </>
  );
}