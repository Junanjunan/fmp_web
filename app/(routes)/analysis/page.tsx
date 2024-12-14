import { CheckboxList } from '@/app/components/UI';
import { Revenues, RevenueGrowth } from '@/app/components/IncomeStatement';
import { getTypes, getExchanges } from '@/lib/sql';

const AnalysisPage = async () => {
  const symbol = 'AAPL'; // Replace with the desired symbol or pass it dynamically
  const types = await getTypes();
  const exchanges = await getExchanges();
  const typeIds = types.map((type) => type.id);
  const exchangeIds = exchanges.map((exchange) => exchange.id);

  return (
    <div>
      <CheckboxList attributes={typeIds} title="Types" />
      <br />
      <CheckboxList attributes={exchangeIds} title="Exchanges" />
      <br />
      <h1>Analysis for {symbol}</h1>
      <Revenues symbol={symbol} />
      <br />
      <RevenueGrowth symbol={symbol} attribute="revenue" />
    </div>
  );
};

export default AnalysisPage;