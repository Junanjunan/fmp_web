import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useWatchlistStore } from '@/app/stores/useStore';
import { requestGetWatchList } from '@/app/axios';

export const useWatchlistData = () => {
  const { setWatchlist } = useWatchlistStore();
  const { data: session } = useSession();
  const isDataFetched = useRef(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    if (isDataFetched.current) {
      return;
    }

    requestGetWatchList()
      .then((res) => {
        isDataFetched.current = true;
        setWatchlist(res.allWatchLists.map(
          watchlistObject => watchlistObject.symbol_id
        ));
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