import axios from 'axios';
import { SearchFilters, TypeRow, ExchangeRow } from '@/types/db';


export const serverApi = axios.create({
  baseURL: `${process.env.SERVER_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestSearchFilters = async (): Promise<SearchFilters> => {
  const response = await serverApi.get('/search-filters');
  return response.data;
}