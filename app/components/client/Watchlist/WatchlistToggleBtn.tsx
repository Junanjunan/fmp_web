'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SymbolRow } from '@/types';
import { isApiError } from '@/lib/error';
import {
  requestGetWatchList, requestInsertWatchList,
  requestDeleteWatchList
} from '@/app/axios';


export const WatchlistToggleBtn = ({ symbol }: { symbol: SymbolRow["id"] }) => {
  const [isInWatchListState, setIsInWatchListState] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    const fetchWatchList = async () => {
      if (!session) {
        return;
      }
      const { watchlist } = await requestGetWatchList();
      setIsInWatchListState(watchlist.includes(symbol));
    }
    fetchWatchList();
  }, [symbol]);

  const handleToggleWatchlist = async () => {
    if (isInWatchListState) {
      // Remove from watchlist
      try {
        await requestDeleteWatchList({ symbol });
        setIsInWatchListState(false);
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        } else if (isApiError(e)) {
          alert(e.response?.data?.message || 'An error occurred');
        } else {
          alert('An error occurred');
        }
      }
    } else {
      // Add to watchlist
      try {
        await requestInsertWatchList({ symbol });
        setIsInWatchListState(true);
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message);
        } else if (isApiError(e)) {
          alert(e.response?.data?.message || 'An error occurred');
        } else {
          alert('An error occurred');
        }
      }
    }
  }

  if (!session) {
    return null;
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