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