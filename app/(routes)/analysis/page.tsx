'use client';

import { useState, useEffect } from 'react';
import { CheckboxList, Button } from '@/app/components/UI';
import { requestGet, requestAnalysis } from '@/app/axios';
import { TypeRow, ExchangeRow, GrowthOfSymbols } from '@/types';


const AnalysisPage = () => {
  const [typeIds, setTypeIds] = useState<TypeRow["id"][]>([]);
  const [exchangeIds, setExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<TypeRow["id"][]>([]);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [symbolGrowths, setSymbolGrowths] = useState<GrowthOfSymbols>({});

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
    setSymbolGrowths(response);
  };

  return (
    <main>
      <CheckboxList attributes={typeIds} title="Types" onChange={handleTypeChange} />
      <br />
      <CheckboxList attributes={exchangeIds} title="Exchanges" onChange={handleExchangeChange} />
      <Button onClick={handleSubmit} title="Search" />
      <table className="min-w-full border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Growth (%)</th>
            {years.map((year) => (
              <th key={year} className="border border-gray-300 px-4 py-2">{year}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(symbolGrowths).map(([symbol, growthArray]) => (
            <tr key={symbol}>
              <td className="border border-gray-300 px-4 py-2">{symbol}</td>
              {years.map((year) => (
                <td key={year} className="border border-gray-300 px-4 py-2">
                  {growthArray.find(growth => growth.year == year)?.growth}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default AnalysisPage;