import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useWatchlistStore } from '@/app/stores/useStore';
import { requestGetWatchlist } from '@/app/axios';
import { OrgnizedWatchlistsObject, SymbolRow } from '@/types/db';

export const useWatchlistData = () => {
  const { setWatchlistObject, setWatchlist } = useWatchlistStore();
  const { data: session } = useSession();
  const isDataFetched = useRef(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (isDataFetched.current) {
      return;
    }

    requestGetWatchlist()
      .then((res) => {
        const allWatchlists = res.allWatchlists;
        const organizedWatchlists: OrgnizedWatchlistsObject = {};
        const symbolsInWatchlists: SymbolRow["id"][] = [];
        allWatchlists.forEach((watchlist) => {
          if (!organizedWatchlists[watchlist.name]) {
            organizedWatchlists[watchlist.name] = [];
          }
          watchlist.user_symbols.forEach((userSymbol) => {
            organizedWatchlists[watchlist.name].push(userSymbol.symbol_id);
            symbolsInWatchlists.push(userSymbol.symbol_id);
          });
        });
        setWatchlistObject(organizedWatchlists);
        setWatchlist(symbolsInWatchlists);
      });
  }, []);
};

export const usePagination = <T, >(items: T[], itemsPerPage: number, savedPage: number) => {
  const [currentPage, setCurrentPage] = useState(savedPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToSpecificPage = (page: number) => {
    setCurrentPage(page);
  }

  return {
    currentItems,
    currentPage, setCurrentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToSpecificPage,
  };
};