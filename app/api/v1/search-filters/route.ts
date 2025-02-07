import { NextResponse } from 'next/server';
import { getTypes, getExchanges } from '@/lib/sql';
import { TypeRow, ExchangeRow } from '@/types/db';

export async function GET(request: Request): Promise<
  NextResponse<{ types: TypeRow[], exchanges: ExchangeRow[] }>
> {
  const url = new URL(request.url);
  const params = url.searchParams;
  const exchangesString = params.get('exchangesString');
  const countriesString = params.get('countriesString');
  const types = await getTypes();
  const exchanges = await getExchanges(exchangesString, countriesString);
  return NextResponse.json({ types, exchanges });
}