'use client';

import { useState, useEffect } from 'react';
import {
  CheckboxList, CheckboxObjectList, Button, Select, InputText
} from '@/app/components/client/UI';
import { RevenueTable } from '@/app/components/client/IncomeStatement';
import { requestGet, requestAnalysis } from '@/app/axios';
import {
  TypeRow, ExchangeRow, ExchangesByCountry, GrowthOfSymbols
} from '@/types';


const AnalysisPage = () => {
  const [typeIds, setTypeIds] = useState<TypeRow["id"][]>([]);
  const [exchanges, setExchanges] = useState<ExchangesByCountry>([]);
  const [selectedTypeIds, setSelectedTypeIds] = useState<TypeRow["id"][]>([]);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<ExchangeRow["id"][]>([]);
  const [yearsOfTable, setYearsOfTable] = useState<number[]>([]);
  const [totalYears, setTotalYears] = useState<number[]>([]);
  const [selectedYearCount, setSelectedYearCount] = useState<string | number>(5);
  const [symbolGrowths, setSymbolGrowths] = useState<GrowthOfSymbols>({});
  const [isLoading, setIsLoading] = useState(false);
  const [minimumGrowth, setMinimumGrowth] = useState<number>(5);
  const filteredYears = yearsOfTable.slice(0, Number(selectedYearCount));
  const defaultCheckedTypes = ["stock"];
  const defaultCheckedExchanges = ["NASDAQ", "NYSE"];

  useEffect(() => {
    setSearchFilters();
    setYearsRows();
    setSelectedTypeIds(defaultCheckedTypes);
    setSelectedExchangeIds(defaultCheckedExchanges);
  }, []);

  useEffect(() => {
    setYearsOfTable(totalYears.slice(0, Number(selectedYearCount)));
  }, [selectedYearCount, totalYears]);

  const setSearchFilters = async () => {
    const searchFilters = await requestGet('search-filters');
    const types = searchFilters.types;
    const exchanges = searchFilters.exchanges;
    const exchangesByCountry: ExchangesByCountry = [];
    setTypeIds(types.map((type: TypeRow) => type.id));
    exchanges.forEach((exchange: ExchangeRow) => {
      const countryId = exchange.country_id;
      const existingCountry = exchangesByCountry.find(item => item.id === countryId);
      if (existingCountry) {
        existingCountry.infoArray.push({ id: exchange.id, name: exchange.name });
      } else {
        exchangesByCountry.push({ id: countryId, infoArray: [{ id: exchange.id, name: exchange.name }] });
      }
    });
    setExchanges(exchangesByCountry);
  };

  const setYearsRows = async () => {
    const years = await requestGet('years');
    setTotalYears(years);
    setYearsOfTable(years);
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

  const SearchedCount = () => {
    if (isLoading) {
      return null;
    }

    const count = Object.keys(symbolGrowths).length;
    return <span>{count} searched</span>;
  };

  return (
    <main>
      <CheckboxList
        attributes={typeIds}
        title="Types"
        defaultChecked={defaultCheckedTypes}
        onChange={handleTypeChange}
      />
      <CheckboxObjectList
        attributes={exchanges}
        title="Exchanges"
        defaultChecked={defaultCheckedExchanges}
        onChange={handleExchangeChange}
      />
      <Button onClick={handleSubmit} isLoading={isLoading} title="Search" />
      <SearchedCount />
      <Select
        options={totalYears.map((_, index) => index+1)}
        value={selectedYearCount}
        onChange={handleYearCountChange}
        title="Year Count"
        id="yearCount"
      />
      <InputText
        inputType="number"
        value={minimumGrowth}
        onChange={(e) => setMinimumGrowth(Number(e.target.value))}
        title="Minimum Growth(%)"
        id="growthLimit"
      />
      <RevenueTable
        filteredYears={filteredYears}
        symbolGrowths={symbolGrowths}
        years={yearsOfTable}
        minimumGrowth={minimumGrowth}
      />
    </main>
  );
};

export default AnalysisPage;