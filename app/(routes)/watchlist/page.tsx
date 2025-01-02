'use client';

import Link from 'next/link';
import { useWatchlistStore } from '@/app/stores/useStore';
import { useWatchlistData } from '@/hooks';
import { WatchlistToggleBtn } from '@/app/components/client/Watchlist/WatchlistToggleBtn';


const WatchlistPage = () => {
  const { watchlist } = useWatchlistStore();

  useWatchlistData();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Symbol</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((symbol) => (
            <tr key={symbol} className="hover:bg-gray-50">
              <td className="border p-2">
                <Link 
                  href={`/analysis/${symbol}`}
                  className="text-blue-600 hover:underline"
                >
                  {symbol}
                </Link>
              </td>
              <td className="border p-2">
                <WatchlistToggleBtn symbol={symbol} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WatchlistPage;