'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SymbolRow, OrgnizedWatchListsObject, AllWatchListsRow } from '@/types';
import {
  requestGetWatchList, requestInsertWatchList,
  requestDeleteWatchList
} from '@/app/axios';


export const WatchlistToggleBtn = ({ symbol }: { symbol: SymbolRow["id"] }) => {
  const [isInWatchListState, setIsInWatchListState] = useState(false);
  const [organizedWatchLists, setOrganizedWatchLists] = useState<OrgnizedWatchListsObject>({});
  const [showWatchLists, setShowWatchLists] = useState(false);
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
    setShowWatchLists(!showWatchLists);
  }

  const addSymbolToWatchList = async (watchListName: string, symbol: string) => {
    const symbolsInWatchlist = organizedWatchLists[watchListName];
    if (symbolsInWatchlist.includes(symbol)) {
      alert("It is already in watchlist");
    } else {
      const confirm = window.confirm(`Will you add ${symbol} to ${watchListName}?`);
      if (!confirm) {
        return;
      }

      const insertResult = await requestInsertWatchList({ watchlistName: watchListName, symbol });
      if (insertResult.success) {
        const allWatchLists: AllWatchListsRow[] = insertResult.allWatchLists;
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
    <div className={`flex ${showWatchLists ? 'block' : 'hidden'}`}>
      {Object.entries(organizedWatchLists).map(([watchlistName, symbols]) => {
        return (
          <div
            key={watchlistName}
            onClick={() => addSymbolToWatchList(watchlistName, symbol)}
            className="cursor-pointer"
          >
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