import { NextResponse } from 'next/server';
import { getTypes, getExchanges } from '@/lib/sql';
import { TypeRow, ExchangeRow } from '@/types/db';

export async function GET(): Promise<
  NextResponse<{ types: TypeRow[], exchanges: ExchangeRow[] }>
> {
  const types = await getTypes();
  const exchanges = await getExchanges();
  return NextResponse.json({ types, exchanges });
}