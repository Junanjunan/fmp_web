import axios from 'axios';
import { FilteredIds, ExchangeRow, AllWatchListsRow } from '@/types/db';


export const serverApi = axios.create({
  baseURL: `${process.env.SERVER_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestGet = async <T>(path: string): Promise<T> => {
  const response = await serverApi.get(`/${path}`);
  return response.data;
}

export const requestAnalysis = async (data: FilteredIds) => {
  const response = await serverApi.post('/analysis', data);
  return response.data;
}

export const requestAnalysisVolume = async (
  data: {exchangeIds: ExchangeRow['id'][], days: number}
) => {
  const response = await serverApi.post('/analysis-volume', data);
  return response.data;
}

export const requestSymbolHistoricalPrices = async (data: { exchange_id: string, symbolIds: string[] }) => {
  const response = await serverApi.post('/symbols/historical-prices', data);
  return response.data;
}

export const requestGetWatchList = async (
): Promise<{allWatchLists: AllWatchListsRow[]}> => {
  const response = await serverApi.get('/watchlist');
  return response.data;
}

export const requestInsertSymbolToWatchList = async (
  data: { watchlistName:string, symbol: string }
) => {
  const response = await serverApi.post('/watchlist', data);
  return response.data;
}

export const requestDeleteSymbolFromWatchList = async (
  data: { watchlistName: string, symbol: string }
) => {
  const response = await serverApi.delete('/watchlist', { data });
  return response.data;
}

export const requestInsertWatchlist = async (
  data: { watchlistName: string }
) => {
  const response = await serverApi.post('/watchlists-all', data);
  return response.data;
}

export const requestDeleteWatchList = async (
  data: { watchlistName: string }
) => {
  const response = await serverApi.delete('/watchlists-all', { data } );
  return response.data;
}

export const requestSignup = async (
  data: { email: string, password: string, passwordConfirm: string }
) => {
  const response = await serverApi.post('/auth/signup', data);
  return response.data;
}