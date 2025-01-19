'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SymbolRow, OrgnizedWatchListsObject } from '@/types';
import { isApiError } from '@/lib/error';
import {
  requestGetWatchList, requestInsertWatchList,
  requestDeleteWatchList
} from '@/app/axios';


export const WatchlistToggleBtn = ({ symbol }: { symbol: SymbolRow["id"] }) => {
  const [isInWatchListState, setIsInWatchListState] = useState(false);
  const [organizedWatchLists, setOrganizedWatchLists] = useState<OrgnizedWatchListsObject>({});
  const { data: session } = useSession();
  useEffect(() => {
    const fetchWatchList = async () => {
      if (!session) {
        return;
      }
      const { allWatchLists } = await requestGetWatchList();
      const organizedWatchLists: OrgnizedWatchListsObject = {};
      allWatchLists.forEach((watchlist) => {
        if (!organizedWatchLists[watchlist.user_symbols_list.name]) {
          organizedWatchLists[watchlist.user_symbols_list.name] = [watchlist.symbol_id];
        } else {
          organizedWatchLists[watchlist.user_symbols_list.name].push(watchlist.symbol_id);
        }
      });
      const symbolsInWatchLists = allWatchLists.map((watchlist) => watchlist.symbol_id);
      setIsInWatchListState(symbolsInWatchLists.includes(symbol));
      setOrganizedWatchLists(organizedWatchLists);
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
    <div className="flex">
      {Object.entries(organizedWatchLists).map(([watchlistName, symbols]) => {
        return (
          <div key={watchlistName}>
            <table>
              <thead className="bg-green-200">
                <tr className="border border-gray-500">
                  <th className="p-1">{watchlistName}</th>
                </tr>
              </thead>
              <tbody className="border border-gray-500">
                {symbols.map((symbol) => {
                  return (
                    <tr key={symbol} className="border border-gray-500">
                      <td className="p-1">{symbol}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
    </>
  );
}