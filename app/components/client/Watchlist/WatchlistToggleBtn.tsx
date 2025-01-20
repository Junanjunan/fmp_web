'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SymbolRow, OrgnizedWatchListsObject } from '@/types';
import {
  requestGetWatchList, requestInsertSymbolToWatchList,
  requestDeleteSymbolFromWatchList, requestInsertWatchlist,
  requestDeleteWatchList
} from '@/app/axios';
import { Button } from '@/app/components/client/UI';


export const WatchlistToggleBtn = ({ symbol }: { symbol: SymbolRow["id"] }) => {
  const [isInWatchListState, setIsInWatchListState] = useState(false);
  const [organizedWatchLists, setOrganizedWatchLists] = useState<OrgnizedWatchListsObject>({});
  const [showWatchLists, setShowWatchLists] = useState(false);
  const [toggleResetWatchlist, setToggleResetWatchlist] = useState(false);
  const [showAddWatchlist, setShowAddWatchlist] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchWatchList = async () => {
      if (!session) {
        return;
      }

      const { allWatchLists } = await requestGetWatchList();
      const organizedWatchLists: OrgnizedWatchListsObject = {};
      allWatchLists.forEach((watchlist) => {
        if (!organizedWatchLists[watchlist.name]) {
          organizedWatchLists[watchlist.name] = [];
        }
        watchlist.user_symbols.forEach((userSymbol) => {
          organizedWatchLists[watchlist.name].push(userSymbol.symbol_id);
        });
      });

      const userSymbolsArray = allWatchLists.map((watchlist) => watchlist.user_symbols);
      const symbolsInWatchLists: string[] = [];
      userSymbolsArray.forEach((userSymbols) => {
        userSymbols.forEach((userSymbol) => {
          symbolsInWatchLists.push(userSymbol.symbol_id);
        });
      });

      setIsInWatchListState(symbolsInWatchLists.includes(symbol));
      setOrganizedWatchLists(organizedWatchLists);
    }
    fetchWatchList();
  }, [symbol, toggleResetWatchlist]);

  const handleToggleWatchlist = async () => {
    setShowWatchLists(!showWatchLists);
  }

  const handleShowAddWatchlist = () => {
    setShowAddWatchlist(!showAddWatchlist);
  }

  const handleAddWatchlist = async () => {
    const response = await requestInsertWatchlist({watchlistName: newWatchlistName});
    if (response.success) {
      setToggleResetWatchlist(!toggleResetWatchlist);
      setNewWatchlistName("");
      setShowAddWatchlist(false);
    }
  }

  const handleDeleteWatchlist = async (watchlistName: string) => {
    const confirm = window.confirm(`Will you remove ${watchlistName}?\nAll symbols in the ${watchlistName} will be removed also`);
    if (!confirm) {
      return;
    }

    const response = await requestDeleteWatchList({watchlistName});
    if (response.success) {
      setToggleResetWatchlist(!toggleResetWatchlist);
    }
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

      const insertResult = await requestInsertSymbolToWatchList({ watchlistName: watchListName, symbol });
      if (insertResult.success) {
        setToggleResetWatchlist(!toggleResetWatchlist);
      }
    }
  }

  const deleteSymbolFromWatchlist = async (watchListName: string, symbol: string) => {
    const confirm = window.confirm(`Will you remove ${symbol} from ${watchListName}?`);
    if (!confirm) {
      return;
    }

    const deleteResult = await requestDeleteSymbolFromWatchList({ watchlistName: watchListName, symbol });
    if (deleteResult.success) {
      setToggleResetWatchlist(!toggleResetWatchlist);
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
          <div key={watchlistName}>
            <table>
              <thead className="bg-green-200">
                <tr className="border border-gray-500">
                  <th className="p-1">
                    {watchlistName}
                    <Button
                      onClick={() => addSymbolToWatchList(watchlistName, symbol)}
                      title="+"
                      isLoading={null}
                      additionalClass="ml-2 cursor-pointer"
                    />
                    <Button
                      onClick={() => handleDeleteWatchlist(watchlistName)}
                      title="✕"
                      isLoading={null}
                      additionalClass="ml-2 cursor-pointer bg-gray-500"
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="border border-gray-500">
                {symbols.map((symbol) => {
                  return (
                    <tr key={symbol} className="border border-gray-500">
                      <td className="p-1">
                        {symbol}
                        <Button
                          onClick={() => deleteSymbolFromWatchlist(watchlistName, symbol)}
                          title="✕"
                          isLoading={null}
                          additionalClass="ml-2"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
      <input
        type="text"
        placeholder="New Watchlist Name"
        className={`border border-gray-500 p-1 ${showAddWatchlist ? 'block' : 'hidden'}`}
        value={newWatchlistName}
        onChange={(e) => setNewWatchlistName(e.target.value)}
      />
      <Button
        onClick={handleAddWatchlist}
        title={"Submit"}
        isLoading={null}
        additionalClass={`${showAddWatchlist ? 'block' : 'hidden'} ml-2 cursor-pointer`}
      />
      <Button
        onClick={handleShowAddWatchlist}
        title={showAddWatchlist ? "Cancel" : "Add Watchlist"}
        isLoading={null}
        additionalClass={`${showAddWatchlist ? 'bg-gray-400' : 'bg-blue-500'} ml-2 cursor-pointer`}
      />
    </div>
    </>
  );
}