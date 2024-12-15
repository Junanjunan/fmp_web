import { NextResponse } from 'next/server';
import { getYearsOfIncomeStatements } from '@/lib/sql';

export async function GET(): Promise<NextResponse<number[]>> {
  const years = await getYearsOfIncomeStatements();
  return NextResponse.json(years);
}