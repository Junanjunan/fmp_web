import { SymbolRow, SymbolProfileRow, IncomeStatementRow } from "@/types";
import { formatDate } from "@/lib/date";
import { getGrowthArray } from "@/lib/analysis";
import { getPercentageNumber } from "@/lib/math";

export const BasicInfoTable = ({ symbolRow }: { symbolRow: SymbolRow }) => {
  return (
    <div className="mt-10 mb-10">
      <h2 className="text-xl">Basic information</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="tableHeader">Attribute</th>
            <th className="tableHeader">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tableCell">Price</td>
            <td className="tableCell">{symbolRow.price}</td>
          </tr>
          <tr>
            <td className="tableCell">Company Name</td>
            <td className="tableCell">{symbolRow.name}</td>
          </tr>
          <tr>
            <td className="tableCell">Type</td>
            <td className="tableCell">{symbolRow.type_id}</td>
          </tr>
          <tr>
            <td className="tableCell">Exchange</td>
            <td className="tableCell">{symbolRow.exchange_id}</td>
          </tr>
          <tr>
            <td className="tableCell">Is Updated</td>
            <td className="tableCell">{symbolRow.is_updated ? 'O' : 'X'}</td>
          </tr>
          <tr>
            <td className="tableCell">Updated At</td>
            <td className="tableCell">
              {formatDate(symbolRow.updated_at, true, true, true, true, true)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export const SymbolProfilesTable = (
  { symbolProfilesRow }: { symbolProfilesRow: SymbolProfileRow }
) => {
  return (
    <div className="mt-10 mb-10">
      <h2 className="text-xl">Symbol Profiles</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="tableHeader">Attribute</th>
            <th className="tableHeader">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tableCell">Price</td>
            <td className="tableCell">{symbolProfilesRow.price}</td>
          </tr>
          <tr>
            <td className="tableCell">Market Cap</td>
            <td className="tableCell">{symbolProfilesRow.mkt_cap}</td>
          </tr>
          <tr>
            <td className="tableCell">Currency</td>
            <td className="tableCell">{symbolProfilesRow.currency}</td>
          </tr>
          <tr>
            <td className="tableCell">Sector</td>
            <td className="tableCell">{symbolProfilesRow.sector}</td>
          </tr>
          <tr>
            <td className="tableCell">Industry</td>
            <td className="tableCell">{symbolProfilesRow.industry}</td>
          </tr>
          <tr>
            <td className="tableCell">Country</td>
            <td className="tableCell">{symbolProfilesRow.country}</td>
          </tr>
          <tr>
            <td className="tableCell">Full Time Employees</td>
            <td className="tableCell">{symbolProfilesRow.full_time_employees}</td>
          </tr>
          <tr>
            <td className="tableCell">IPO Date</td>
            <td className="tableCell">{symbolProfilesRow.ipo_date}</td>
          </tr>
          <tr>
            <td className="tableCell">Website</td>
            <td className="tableCell">{symbolProfilesRow.website}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export const IncomeStatementsTable = async (
  { incomeStatementsRows }: { incomeStatementsRows: IncomeStatementRow[] }
) => {
  const revenueGrowthArray = await getGrowthArray(incomeStatementsRows, 'revenue');
  const operatingIncomeGrowthArray = await getGrowthArray(incomeStatementsRows, 'operating_income');
  const netIncomeGrowthArray = await getGrowthArray(incomeStatementsRows, 'net_income');
  return (
    <div className="mt-10 mb-10">
      <h2 className="text-xl">Income Statements</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="tableHeader">Year</th>
            {incomeStatementsRows.map((row) => (
              <th key={row.date.toString()} className="tableHeader">
                {formatDate(row.date, true, false, false)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tableCell">Revenue</td>
            {incomeStatementsRows.map((row) => (
              <td key={row.date.toString()} className="tableCell">{row.revenue}</td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Revenue Growth(%)</td>
            {revenueGrowthArray.map((row, index) => (
              <td key={index} className="tableCell">{row.growth}</td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Cost of Revenue</td>
            {incomeStatementsRows.map((row) => (
              <td key={row.date.toString()} className="tableCell">{row.cost_of_revenue}</td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Gross Profit</td>
            {incomeStatementsRows.map((row) => (
              <td key={row.date.toString()} className="tableCell">{row.gross_profit}</td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Gross Profit Ratio(%)</td>
            {incomeStatementsRows.map((row) => (
              <td key={row.date.toString()} className="tableCell">
                {getPercentageNumber(row.gross_profit_ratio as number)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Operating Income Ratio(%)</td>
            {incomeStatementsRows.map((row) => (
              <td key={row.date.toString()} className="tableCell">
                {getPercentageNumber(row.operating_income_ratio as number)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Operating Income Growth(%)</td>
            {operatingIncomeGrowthArray.map((row, index) => (
              <td key={index} className="tableCell">{row.growth}</td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Net Income Ratio(%)</td>
            {incomeStatementsRows.map((row) => (
              <td key={row.date.toString()} className="tableCell">
                {getPercentageNumber(row.net_income_ratio as number)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="tableCell">Net Income Growth(%)</td>
            {netIncomeGrowthArray.map((row, index) => (
              <td key={index} className="tableCell">{row.growth}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}