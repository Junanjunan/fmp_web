import { NextResponse } from "next/server";
import { getSymbolsHistoricalPrices } from "@/lib/sql";


export async function POST(request: Request) {
  const { exchange_id, symbolIds } = await request.json();
  const historicalPrices = await getSymbolsHistoricalPrices(exchange_id, symbolIds);
  return NextResponse.json({ data: historicalPrices });
}