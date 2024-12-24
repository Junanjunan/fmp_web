import Link from 'next/link';

const SymbolPage = async (
  { params }
  : { params: Promise<{ symbol: string }> }
) => {
  const { symbol } = await params;

  return (
    <div>
      <Link
        href="/analysis"
        className="text-blue-500 hover:text-blue-700 border border-blue-500 px-2 py-1"
      >
        Back to Analysis
      </Link>
      <div>Symbol: {symbol}</div>
    </div>
  );
};


export default SymbolPage;
