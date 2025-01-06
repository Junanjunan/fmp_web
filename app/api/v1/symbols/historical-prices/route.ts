import { NextResponse } from "next/server";
import { getSymbolsHistoricalPrices } from "@/lib/sql";


export async function POST(request: Request) {
  const { symbolIds } = await request.json();
  const historicalPrices = await getSymbolsHistoricalPrices(symbolIds);
  return NextResponse.json({data: historicalPrices});
}