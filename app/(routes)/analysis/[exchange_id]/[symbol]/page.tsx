import Link from 'next/link';
import {
  getSymbol, getIncomeStatement, getSymbolProfile,
  getHistoricalPrices
} from '@/lib/sql';
import {
  BasicInfoTable, SymbolProfilesTable, IncomeStatementsTable
} from '@/app/components/server/Symbol';
import { WatchlistToggleBtn } from '@/app/components/client/Watchlist/WatchlistToggleBtn';
import { PriceChart } from '@/app/components/client/chart/priceChart';
import { formatDate } from '@/lib/date';


const SymbolPage = async (
  { params }
  : { params: Promise<{ exchange_id: string, symbol: string }> }
) => {
  const { exchange_id, symbol } = await params;
  const [
    symbolRow,
    symbolProfilesRow,
    incomeStatementsRows,
    historicalPricesRows,
  ] = await Promise.all([
    getSymbol(symbol),
    getSymbolProfile(symbol),
    getIncomeStatement(symbol),
    getHistoricalPrices(exchange_id, symbol)
  ]);

  let historicalPriceData = historicalPricesRows.map(row => ({
    time: formatDate(row.date),
    open: row.open ? parseFloat(row.open.toString()) : 0,
    high: row.high ? parseFloat(row.high.toString()) : 0,
    low: row.low ? parseFloat(row.low.toString()) : 0,
    close: row.close ? parseFloat(row.close.toString()) : 0,
    volume: row.volume ? parseInt(row.volume.toString()) : 0,
  }));
  historicalPriceData.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return (
    <div>
      <Link
        href="/analysis"
        className="text-blue-500 hover:text-blue-700 border border-blue-500 px-2 py-1"
      >
        Back to Analysis
      </Link>
      <div className="mt-10">
        <span className="text-xl">Symbol: </span>
        <span className="text-xl font-bold">{symbol}</span>
        <WatchlistToggleBtn symbol={symbol} />
      </div>
      <BasicInfoTable symbolRow={symbolRow} />
      <SymbolProfilesTable symbolProfilesRow={symbolProfilesRow} />
      <IncomeStatementsTable incomeStatementsRows={incomeStatementsRows} />
      <PriceChart data={historicalPriceData} />
    </div>
  );
};


export default SymbolPage;
