import { getIncomeStatement } from '@/lib/sql';
import { SymbolRow, IncomeStatementRow } from '@/types';
import { getGrowthArray } from '@/lib/analysis';

export const Revenues = async ({ symbol }: { symbol: SymbolRow["id"] }) => {
    const incomeStatements = await getIncomeStatement(symbol);

    return (
        <div>
            {incomeStatements.map((statement) => {
                const year = statement.date.getFullYear();
                const revenue = statement.revenue;
                return (
                    <div key={year}>
                        <p>{year}: {revenue}</p>
                    </div>
                );
            })}
        </div>
    );
};

export const RevenueGrowth = async (
    { symbol, attribute }: { symbol: SymbolRow["id"], attribute: keyof IncomeStatementRow }
) => {
    const revenueGrowthArray = await getGrowthArray(symbol, attribute);

    return (
        <div>
            {revenueGrowthArray.map((growth, index) => {
                return <p key={index}>{growth.year}: {growth.growth}</p>;
            })}
        </div>
    )
};