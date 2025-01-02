import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';


export const getServerSession_ = async () => {
  return await getServerSession(authOptions);
}