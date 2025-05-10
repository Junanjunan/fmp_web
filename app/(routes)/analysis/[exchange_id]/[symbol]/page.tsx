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

  if (symbolRow.exchange_id !== exchange_id) {
    return (
      <div>
        <div>
          <h3>The {symbol} does not exist in {exchange_id}, It is in {symbolRow.exchange_id}</h3>
        </div>
        <div className='rounded bg-blue-500 mt-5 p-3 w-72 text-white'>
          <Link href={`/analysis/${symbolRow.exchange_id}/${symbol}`} className="">
            Go to /{symbolRow.exchange_id}/{symbol} analysis page
          </Link>
        </div>
      </div>
    )
  }

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
      <div className="mt-10">
        <span className="text-xl">Symbol: </span>
        <span className="text-xl font-bold">{symbol}</span>
        <WatchlistToggleBtn symbol={symbol} exchange={exchange_id} />
      </div>
      <BasicInfoTable symbolRow={symbolRow} />
      <SymbolProfilesTable symbolProfilesRow={symbolProfilesRow} />
      <IncomeStatementsTable incomeStatementsRows={incomeStatementsRows} />
      <PriceChart data={historicalPriceData} />
    </div>
  );
};


export default SymbolPage;
