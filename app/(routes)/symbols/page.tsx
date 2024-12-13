import { SymbolRow } from "@/types";
import { query } from "@/lib/db";


export default async function Symbols() {
  const result = await query('SELECT * FROM symbols');
  const data = result.rows as SymbolRow[];
  return (
    <div>
      <h1>Symbols</h1>
      <ul>
        {data.map((row) => (
          <li key={row.id}>{row.id}</li>
        ))}
      </ul>
    </div>
  );
}