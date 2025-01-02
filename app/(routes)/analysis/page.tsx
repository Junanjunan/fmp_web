'use client';

import { useState, useEffect } from 'react';
import {
  CheckboxList, CheckboxObjectList, Button, Select, InputText
} from '@/app/components/client/UI';
import { RevenueTable } from '@/app/components/client/IncomeStatement';
import { requestGet, requestAnalysis } from '@/app/axios';
import { TypeRow, ExchangeRow, ExchangesByCountry } from '@/types';
import { useAnalysisStore, useSearchStore } from '@/app/stores/useStore';


const AnalysisPage = () => {
  const {
    typeIds, setTypeIds,
    exchanges, setExchanges,
    selectedTypeIds, setSelectedTypeIds,
    selectedExchangeIds, setSelectedExchangeIds,
    yearsOfTable, setYearsOfTable,
    totalYears, setTotalYears,
    symbolGrowths, setSymbolGrowths,
    minimumGrowth, setMinimumGrowth,
    minimumOperatingIncomeRatio, setMinimumOperatingIncomeRatio,
    selectedYearCount, setSelectedYearCount,
    excludeWatchlist, setExcludeWatchlist,
    setSortedSymbolGrowths,
  } = useAnalysisStore();
  const {
    limitYearCount, setLimitYearCount,
    searchSymbol, setSearchSymbol,
  } = useSearchStore();
  const [isLoading, setIsLoading] = useState(false);
  const filteredYears = limitYearCount
    ? yearsOfTable.slice(0, Number(selectedYearCount))
    : yearsOfTable;

  useEffect(() => {
    setSearchFilters();
    setYearsRows();
    setSelectedTypeIds(selectedTypeIds);
    setSelectedExchangeIds(selectedExchangeIds);
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
    // Table can be fulfilled after search when sortedSymbolGrowths is empty
    // app/components/client/IncomeStatement.tsx 17 line: if (sortedSymbolGrowths.length > 0)
    setSortedSymbolGrowths([]);
    setIsLoading(true);
    setSearchSymbol("");
    const data = {
      typeIds: selectedTypeIds,
      exchangeIds: selectedExchangeIds,
    };
    const response = await requestAnalysis(data);
    setSymbolGrowths(response);
    setLimitYearCount(true);
    setIsLoading(false);
  };

  const handleSearchSymbolSubmit = async () => {
    setSortedSymbolGrowths([]);
    setIsLoading(true);
    const data = {
      typeIds: selectedTypeIds,
      exchangeIds: selectedExchangeIds,
      symbol: searchSymbol,
    }
    const response = await requestAnalysis(data);
    setSymbolGrowths(response);
    setSelectedYearCount(totalYears.length);
    setMinimumGrowth(-9999999999);
    setMinimumOperatingIncomeRatio(-9999999999);
    setLimitYearCount(false);
    setIsLoading(false);
  }

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
        defaultChecked={selectedTypeIds}
        onChange={handleTypeChange}
      />
      <CheckboxObjectList
        attributes={exchanges}
        title="Exchanges"
        defaultChecked={selectedExchangeIds}
        onChange={handleExchangeChange}
      />
      <Button onClick={handleSubmit} isLoading={isLoading} title="Search" />
      <SearchedCount />
      <div className="flex items-center">
        <InputText
          inputType="text"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value)}
          title="Search Symbol"
          id="searchSymbol"
          placeholder="ex: AA, AAP, AAPL, aapl"
        />
        <Button
          onClick={handleSearchSymbolSubmit}
          isLoading={isLoading}
          title="Search"
          additionalClass="mt-5"
        />
      </div>
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
      <InputText
        inputType="number"
        value={minimumOperatingIncomeRatio}
        onChange={(e) => setMinimumOperatingIncomeRatio(Number(e.target.value))}
        title="Minimum Operating Income Ratio(%)"
        id="operatingIncomeRatioLimit"
      />
      <CheckboxList
        attributes={['Exclude']}
        title="Exclude Watchlist"
        defaultChecked={excludeWatchlist ? ['Exclude'] : []}
        onChange={() => {setExcludeWatchlist(!excludeWatchlist)}}
      />
      <RevenueTable filteredYears={filteredYears} />
    </main>
  );
};

export default AnalysisPage;