'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SymbolRow } from '@/types';


export const WatchlistToggleBtn = ({ symbol }: { symbol: SymbolRow["id"] }) => {
  const { data: session } = useSession();
  const { watch_list } = session?.user;
  const isInWatchList = watch_list.includes(symbol);
  const [isInWatchListState, setIsInWatchListState] = useState(isInWatchList);

  useEffect(() => {
    setIsInWatchListState(watch_list.includes(symbol));
  }, [watch_list, symbol]);

  const handleToggleWatchlist = () => {
    if (isInWatchListState) {
      // Remove from watchlist
      setIsInWatchListState(false);
    } else {
      // Add to watchlist
      setIsInWatchListState(true);
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