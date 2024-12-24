import Link from 'next/link';
import { query } from '@/lib/db';
import {
  BasicInfoTable, SymbolProfilesTable, IncomeStatementsTable
} from '@/app/components/server/Symbol';


const SymbolPage = async (
  { params }
  : { params: Promise<{ symbol: string }> }
) => {
  const { symbol } = await params;
  const [
    resultSymbols, resultSymbolProfiles, resultIncomeStatements
  ] = await Promise.all([
    query('SELECT * FROM symbols WHERE id = $1', [symbol]),
    query('SELECT * FROM symbol_profiles WHERE symbol = $1', [symbol]),
    query(
      'SELECT * FROM income_statements WHERE symbol = $1 ORDER BY date DESC',
      [symbol]
    ),
  ]);
  const symbolRow = resultSymbols.rows[0];
  const symbolProfilesRow = resultSymbolProfiles.rows[0];
  const incomeStatementsRows = resultIncomeStatements.rows;

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
