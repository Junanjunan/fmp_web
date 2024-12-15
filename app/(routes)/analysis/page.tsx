'use client';

import { useState, useEffect } from 'react';
import { CheckboxList } from '@/app/components/UI';
import { requestGet, requestAnalysis } from '@/app/axios';
import { TypeRow, ExchangeRow } from '@/types';


const AnalysisPage = () => {
  const [typeIds, setTypeIds] = useState<TypeRow["id"][]>([]);
  const [exchangeIds, setExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<TypeRow["id"][]>([]);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    setSearchFilters();
    setYearsRows();
  }, []);

  const setSearchFilters = async () => {
    const searchFilters = await requestGet('search-filters');
    const types = searchFilters.types;
    const exchanges = searchFilters.exchanges;
    setTypeIds(types.map((type: TypeRow) => type.id));
    setExchangeIds(exchanges.map((exchange: ExchangeRow) => exchange.id));
  };

  const setYearsRows = async () => {
    const years = await requestGet('years');
    setYears(years);
  }

  const handleTypeChange = (selected: TypeRow["id"][]) => {
    setSelectedTypeIds(selected);
  };

  const handleExchangeChange = (selected: ExchangeRow["id"][]) => {
    setSelectedExchangeIds(selected);
  };

  const handleSubmit = async () => {
    const data = {
      typeIds: selectedTypeIds,
      exchangeIds: selectedExchangeIds,
    };
    const response = await requestAnalysis(data);
    console.log(response);
  };

  return (
    <main>
      <CheckboxList attributes={typeIds} title="Types" onChange={handleTypeChange} />
      <br />
      <CheckboxList attributes={exchangeIds} title="Exchanges" onChange={handleExchangeChange} />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-1 py-1 rounded-md mt-2"
      >
        Submit
      </button>
      <table className="min-w-full border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Growth (%)</th>
            {years.map((year) => (
              <th key={year} className="border border-gray-300 px-4 py-2">{year}</th>
            ))}
          </tr>
        </thead>
      </table>
    </main>
  );
};

export default AnalysisPage;