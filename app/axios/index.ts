import axios from 'axios';
import { FilteredIds } from '@/types/db';


export const serverApi = axios.create({
  baseURL: `${process.env.SERVER_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestGet = async (path: string): Promise<any> => {
  const response = await serverApi.get(`/${path}`);
  return response.data;
}

export const requestAnalysis = async (data: FilteredIds) => {
  const response = await serverApi.post('/analysis', data);
  return response.data;
}

export const requestGetWatchList = async (
) => {
  const response = await serverApi.get('/watchlist');
  return response.data;
}

export const requestInsertWatchList = async (
  data: { symbol: string }
) => {
  const response = await serverApi.post('/watchlist', data);
  return response.data;
}

export const requestSignup = async (
  data: { email: string, password: string, passwordConfirm: string }
) => {
  const response = await serverApi.post('/auth/signup', data);
  return response.data;
}