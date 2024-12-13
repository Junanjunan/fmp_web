import { getIncomeStatement } from '@/lib/sql';
import { IncomeStatementRow } from '@/types';
import { getGrowth } from '@/lib/math';

export const Revenues = async ({ symbol }: { symbol: string }) => {
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

export const RevenueGrowth = async ({ symbol }: { symbol: string }) => {
    const incomeStatements = await getIncomeStatement(symbol);
    const revenueGrowthArray = [];
    for (let i = 0; i < incomeStatements.length - 1; i++) {
        const currentYear: IncomeStatementRow = incomeStatements[i];
        const previousYear: IncomeStatementRow = incomeStatements[i + 1];

        if (!currentYear.revenue || !previousYear.revenue) {
            break;
        }

        const growth = getGrowth(currentYear.revenue, previousYear.revenue);
        const year = currentYear.date.getFullYear();
        revenueGrowthArray.push({ year, growth });
    }
    
    return (
        <div>
            {revenueGrowthArray.map((growth, index) => {
                return <p key={index}>{growth.year}: {growth.growth}</p>;
            })}
        </div>
    )
};