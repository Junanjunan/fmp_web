import Link from 'next/link';
import {
  getSymbol, getIncomeStatement, getSymbolProfile
} from '@/lib/sql';
import {
  BasicInfoTable, SymbolProfilesTable, IncomeStatementsTable
} from '@/app/components/server/Symbol';


const SymbolPage = async (
  { params }
  : { params: Promise<{ symbol: string }> }
) => {
  const { symbol } = await params;
  const [
    symbolRow, symbolProfilesRow, incomeStatementsRows
  ] = await Promise.all([
    getSymbol(symbol),
    getSymbolProfile(symbol),
    getIncomeStatement(symbol)
  ]);

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
      </div>
      <BasicInfoTable symbolRow={symbolRow} />
      <SymbolProfilesTable symbolProfilesRow={symbolProfilesRow} />
      <IncomeStatementsTable incomeStatementsRows={incomeStatementsRows} />
    </div>
  );
};


export default SymbolPage;
