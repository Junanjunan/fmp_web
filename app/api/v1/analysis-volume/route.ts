import { NextResponse } from 'next/server';
import { ExchangeHistoricalPriceObject } from '@/types/db';
import {
  getSymbolsHistoricalPricesByDate,
  getDatesOfSymbolsHistoricalPrices
} from '@/lib/sql';


export async function POST(request: Request) {
  const data = await request.json();
  const { exchangeIds, days } = data;
  const exchangeHistoricalPricesObject: ExchangeHistoricalPriceObject = {};
  for (const exchangeId of exchangeIds) {
    const dateRows = await getDatesOfSymbolsHistoricalPrices(exchangeId);
    const sliceNum = Math.min(dateRows.length, days);
    const dateArray = dateRows.map(row => row.date).slice(0, sliceNum);
    const startDate = dateArray[dateArray.length - 1].toISOString();
    const endDate = dateArray[0].toISOString();
    const symbolsHistoricalPrices = await getSymbolsHistoricalPricesByDate(exchangeId, startDate, endDate);
    exchangeHistoricalPricesObject[exchangeId] = symbolsHistoricalPrices;
  }
  return NextResponse.json({ 'success': true, 'data': exchangeHistoricalPricesObject });
}