import { Revenues, RevenueGrowth } from '@/app/components/IncomeStatement';

const AnalysisPage = () => {
    const symbol = 'AAPL'; // Replace with the desired symbol or pass it dynamically

    return (
        <div>
            <h1>Analysis for {symbol}</h1>
            <Revenues symbol={symbol} />
            <br />
            <RevenueGrowth symbol={symbol} attribute="revenue" />
        </div>
    );
};

export default AnalysisPage;