'use client';

import { useState, useEffect } from 'react';
import { CheckboxList } from '@/app/components/UI';
import { requestSearchFilters, requestAnalysis } from '@/app/axios';
import { TypeRow, ExchangeRow } from '@/types';


const AnalysisPage = () => {
  const [typeIds, setTypeIds] = useState<TypeRow["id"][]>([]);
  const [exchangeIds, setExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<TypeRow["id"][]>([]);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<ExchangeRow["id"][]>([]);

  const setSearchFilters = async () => {
    const searchFilters = await requestSearchFilters();
    const types = searchFilters.types;
    const exchanges = searchFilters.exchanges;
    setTypeIds(types.map((type: TypeRow) => type.id));
    setExchangeIds(exchanges.map((exchange: ExchangeRow) => exchange.id));
  };

  useEffect(() => {
    setSearchFilters();
  }, []);

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
    </main>
  );
};

export default AnalysisPage;