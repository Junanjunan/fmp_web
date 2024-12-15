import axios from 'axios';
import { SearchFilters, FilteredIds } from '@/types/db';


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

export const requestAnalysis = async (data: FilteredIds) => {
  const response = await serverApi.post('/analysis', data);
  return response.data;
}