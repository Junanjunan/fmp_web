import { useEffect, useRef } from 'react';
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
        setWatchlist(res.watchlist);
      });
  }, []);
};