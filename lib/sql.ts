import { query } from '@/lib/db';
import { IncomeStatementRow } from '@/types';

export const getIncomeStatement = async (
    symbol: string
): Promise<IncomeStatementRow[]> => {
    const sql = `
        SELECT *
        FROM income_statements
        WHERE symbol = $1
        ORDER BY date DESC;
    `;
    const result = await query(sql, [symbol]);
    return result.rows as IncomeStatementRow[];
}