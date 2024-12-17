'use client';

import { useState, useEffect } from 'react';
import { CheckboxList, Button, Select } from '@/app/components/client/UI';
import { RevenueTable } from '@/app/components/client/IncomeStatement';
import { requestGet, requestAnalysis } from '@/app/axios';
import { TypeRow, ExchangeRow, GrowthOfSymbols } from '@/types';


const AnalysisPage = () => {
  const [typeIds, setTypeIds] = useState<TypeRow["id"][]>([]);
  const [exchangeIds, setExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<TypeRow["id"][]>([]);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYearCount, setSelectedYearCount] = useState<string | number>(5);
  const [symbolGrowths, setSymbolGrowths] = useState<GrowthOfSymbols>({});
  const [isLoading, setIsLoading] = useState(false);
  const [minimumGrowth, setMinimumGrowth] = useState<number>(5);
  const filteredYears = years.slice(0, Number(selectedYearCount));

  useEffect(() => {
    setSearchFilters();
    setYearsRows();
  }, []);

  useEffect(() => {
    setYears(years.slice(0, Number(selectedYearCount)));
  }, [selectedYearCount]);

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
    setIsLoading(true);
    const data = {
      typeIds: selectedTypeIds,
      exchangeIds: selectedExchangeIds,
    };
    const response = await requestAnalysis(data);
    setSymbolGrowths(response);
    setIsLoading(false);
  };

  const handleYearCountChange = (selected: string | number) => {
    setSelectedYearCount(selected);
  };

  return (
    <main>
      <CheckboxList attributes={typeIds} title="Types" onChange={handleTypeChange} />
      <CheckboxList attributes={exchangeIds} title="Exchanges" onChange={handleExchangeChange} />
      <Button onClick={handleSubmit} isLoading={isLoading} title="Search" />
      <Select
        options={years.map((_, index) => index+1)}
        value={selectedYearCount}
        onChange={handleYearCountChange}
        title="Year Count"
        id="yearCount"
      />
      <div className="flex items-center">
        <label htmlFor="growthLimit" className="mr-2">Minimum Growth(%): </label>
        <input
          type="number"
          value={minimumGrowth}
          onChange={(e) => setMinimumGrowth(Number(e.target.value))}
          id="growthLimit"
          className="border border-gray-300"
        />
      </div>
      <RevenueTable
        filteredYears={filteredYears}
        symbolGrowths={symbolGrowths}
        years={years}
        minimumGrowth={minimumGrowth}
      />
    </main>
  );
};

export default AnalysisPage;