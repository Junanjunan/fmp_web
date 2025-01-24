'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SymbolRow, OrgnizedWatchlistsObject, ExchangeRow } from '@/types';
import {
  requestGetWatchlist, requestInsertSymbolToWatchlist,
  requestDeleteSymbolFromWatchlist, requestInsertWatchlist,
  requestDeleteWatchlist, requestCorrectWatchlistExchange
} from '@/app/axios';
import { Button } from '@/app/components/client/UI';


export const WatchlistToggleBtn = (
  { symbol , exchange}:
  { symbol: SymbolRow["id"], exchange: ExchangeRow["id"] }
) => {
  const [isInWatchlistState, setIsInWatchlistState] = useState(false);
  const [organizedWatchlists, setOrganizedWatchlists] = useState<OrgnizedWatchlistsObject>({});
  const [showWatchlists, setShowWatchlists] = useState(false);
  const [toggleResetWatchlist, setToggleResetWatchlist] = useState(false);
  const [showAddWatchlist, setShowAddWatchlist] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!session) {
        return;
      }

      const { allWatchlists } = await requestGetWatchlist();
      const organizedWatchlists: OrgnizedWatchlistsObject = {};
      allWatchlists.forEach((watchlist) => {
        if (!organizedWatchlists[watchlist.name]) {
          organizedWatchlists[watchlist.name] = [];
        }
        watchlist.user_symbols.forEach((userSymbol) => {
          organizedWatchlists[watchlist.name].push(
            [userSymbol.symbol_id, userSymbol.exchange_id]
          );
        });
      });

      const userSymbolsArray = allWatchlists.map((watchlist) => watchlist.user_symbols);
      const symbolsInWatchlists: string[] = [];
      userSymbolsArray.forEach((userSymbols) => {
        userSymbols.forEach((userSymbol) => {
          symbolsInWatchlists.push(userSymbol.symbol_id);
        });
      });

      setIsInWatchlistState(symbolsInWatchlists.includes(symbol));
      setOrganizedWatchlists(organizedWatchlists);
    }
    fetchWatchlist();
  }, [symbol, toggleResetWatchlist]);

  const handleToggleWatchlist = async () => {
    setShowWatchlists(!showWatchlists);
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

    const response = await requestDeleteWatchlist({watchlistName});
    if (response.success) {
      setToggleResetWatchlist(!toggleResetWatchlist);
    }
  }

  const handleCorrectWatchlistExchange = () => {
    setIsLoading(true);
    requestCorrectWatchlistExchange()
      .then(res => {
        if (res.success) {
          alert("Success");
        }
      })
      .catch(error => {
        alert(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const addSymbolToWatchlist = async (
    watchlistName: string, symbol: string, exchange: string
  ) => {
    const symbolsInWatchlist = organizedWatchlists[watchlistName].map(
      symbolWithExchangeArray => symbolWithExchangeArray[0]
    );
    if (symbolsInWatchlist.includes(symbol)) {
      alert("It is already in watchlist");
    } else {
      const confirm = window.confirm(`Will you add ${symbol} to ${watchlistName}?`);
      if (!confirm) {
        return;
      }

      const insertResult = await requestInsertSymbolToWatchlist({
        watchlistName: watchlistName, symbol, exchange
      });
      if (insertResult.success) {
        setToggleResetWatchlist(!toggleResetWatchlist);
      }
    }
  }

  const deleteSymbolFromWatchlist = async (
    watchlistName: string, symbol: string, exchange: string
  ) => {
    const confirm = window.confirm(`Will you remove ${symbol} from ${watchlistName}?`);
    if (!confirm) {
      return;
    }

    const deleteResult = await requestDeleteSymbolFromWatchlist({
      watchlistName: watchlistName, symbol, exchange
    });
    if (deleteResult.success) {
      setToggleResetWatchlist(!toggleResetWatchlist);
    }
  }

  if (!session) {
    return null;
  }

  return (
    <>
    {isInWatchlistState ? (
      <span onClick={handleToggleWatchlist} className="text-gray-500 border border-gray-500 px-2 py-1 ml-2 cursor-pointer">Remove from Watchlist</span>
    ) : (
      <span onClick={handleToggleWatchlist} className="text-blue-500 border border-blue-500 px-2 py-1 ml-2 cursor-pointer">Add to Watchlist</span>
    )}
    <Button
      onClick={handleCorrectWatchlistExchange}
      title={"Correct watchlist exchange"}
      isLoading={isLoading}
    />
    <div className={`flex ${showWatchlists ? 'block' : 'hidden'}`}>
      {Object.entries(organizedWatchlists).map(([watchlistName, symbolWithExchangeArray]) => {
        return (
          <div key={watchlistName}>
            <table>
              <thead className="bg-green-200">
                <tr className="border border-gray-500">
                  <th className="p-1">
                    {watchlistName}
                    <Button
                      onClick={() => addSymbolToWatchlist(watchlistName, symbol, exchange)}
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
                {symbolWithExchangeArray.map(([symbol, exchange]) => {
                  return (
                    <tr key={symbol} className="border border-gray-500">
                      <td className="p-1">
                        {symbol} ({exchange})
                        <Button
                          onClick={() => deleteSymbolFromWatchlist(watchlistName, symbol, exchange)}
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