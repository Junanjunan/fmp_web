import { useEffect, useRef } from 'react';
import { useWatchlistStore } from '@/app/stores/useStore';
import { requestGetWatchList } from '@/app/axios';

export const useWatchlistData = () => {
  const { setWatchlist } = useWatchlistStore();
  const isDataFetched = useRef(false);

  useEffect(() => {
    if (isDataFetched.current) {
      return;
    }

    requestGetWatchList()
      .then((res) => {
        isDataFetched.current = true;
        setWatchlist(res.watchlist);
      });
  }, []);
};