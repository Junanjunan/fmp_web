'use client';

import { useState, useEffect } from 'react';
import {
  CheckboxList, CheckboxObjectList, Button, Select, InputText
} from '@/app/components/client/UI';
import { RevenueTable } from '@/app/components/client/IncomeStatement';
import { requestGet, requestAnalysis, requestWatchlistsAnalysis } from '@/app/axios';
import { TypeRow, ExchangeRow, ExchangesByCountry, SearchFilters, SymbolRow } from '@/types';
import { useAnalysisStore, useWatchlistStore } from '@/app/stores/useStore';


const AnalysisPage = () => {
  const {
    typeIds, setTypeIds,
    exchanges, setExchanges,
    selectedTypeIds, setSelectedTypeIds,
    selectedExchangeIds, setSelectedExchangeIds,
    yearsOfTable, setYearsOfTable,
    totalYears, setTotalYears,
    symbolGrowths, setSymbolGrowths,
    applyMinimumGrowth, setApplyMinimumGrowth,
    minimumGrowth, setMinimumGrowth,
    applyMinimumOperatingIncomeRatio, setApplyMinimumOperatingIncomeRatio,
    minimumOperatingIncomeRatio, setMinimumOperatingIncomeRatio,
    applyYearCount, setApplyYearCount,
    selectedYearCount, setSelectedYearCount,
    searchSymbol, setSearchSymbol,
    setSortedSymbolGrowths,
    setWatchlistsToBeExcluded,
  } = useAnalysisStore();
  const { watchlistObject } = useWatchlistStore();
  const [isLoading, setIsLoading] = useState(false);
  const filteredYears = applyYearCount
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
    const searchFilters = await requestGet<SearchFilters>('search-filters');
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
    const years = await requestGet<number[]>('years');
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
    const data = {
      typeIds: selectedTypeIds,
      exchangeIds: selectedExchangeIds,
      symbol: searchSymbol,
    };
    const response = await requestAnalysis(data);
    setSymbolGrowths(response);
    setIsLoading(false);
  };

  const showWatchlistsAnalysis = async () => {
    setSortedSymbolGrowths([]);
    setIsLoading(true);
    const response = await requestWatchlistsAnalysis();
    setSymbolGrowths(response);
    setIsLoading(false);
  }

  const handleApplyYearCount = () => {
      if (!applyYearCount) {
        setSelectedYearCount(5);
      } else {
        setSelectedYearCount(totalYears.length);
      }
      setApplyYearCount(!applyYearCount);
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
      <InputText
        inputType="text"
        value={searchSymbol}
        onChange={(e) => setSearchSymbol(e.target.value)}
        title="Symbol Keyword"
        id="searchSymbol"
        placeholder="ex: AA, AAP, AAPL, aapl"
      />
      <Button onClick={handleSubmit} isLoading={isLoading} title="Search" />
      <div>
        <Button
          onClick={showWatchlistsAnalysis}
          isLoading={isLoading}
          title="Search Watchlist Symbols"
        />
      </div>
      <SearchedCount />

      <div className="flex items-center h-20">
        <CheckboxList
          attributes={['Year Count']}
          title=""
          defaultChecked={applyYearCount ? ['Year Count'] : []}
          onChange={handleApplyYearCount}
        />
        <div className={`mb-10 ml-5 ${applyYearCount ? 'block' : 'hidden'}`}>
          <Select
            options={totalYears.map((_, index) => index+1)}
            value={selectedYearCount}
            onChange={handleYearCountChange}
            title=""
            id="yearCount"
          />
        </div>
      </div>

      <div className="flex items-center h-20 -mt-10">
        <CheckboxList
          attributes={['Minimum Growth(%)']}
          title=""
          defaultChecked={applyMinimumGrowth ? ['Minimum Growth(%)'] : []}
          onChange={() => setApplyMinimumGrowth(!applyMinimumGrowth)}
        />
        <div className={`mb-10 ml-5 ${applyMinimumGrowth ? 'block' : 'hidden'}`}>
          <InputText
            inputType="number"
            value={minimumGrowth}
            onChange={(e) => setMinimumGrowth(Number(e.target.value))}
            title=""
            id="growthLimit"
          />
        </div>
      </div>

      <div className="flex items-center h-20 -mt-10">
        <CheckboxList
          attributes={['Minimum Operating Income Ratio(%)']}
          title=""
          defaultChecked={
            applyMinimumOperatingIncomeRatio ? ['Minimum Operating Income Ratio(%)'] : []
          }
          onChange={
            () => setApplyMinimumOperatingIncomeRatio(!applyMinimumOperatingIncomeRatio)
          }
        />
        <div className={`mb-10 ml-5 ${applyMinimumOperatingIncomeRatio ? 'block' : 'hidden'}`}>
          <InputText
            inputType="number"
            value={minimumOperatingIncomeRatio}
            onChange={(e) => setMinimumOperatingIncomeRatio(Number(e.target.value))}
            title=""
            id="operatingIncomeRatioLimit"
          />
        </div>
      </div>

      <div className="flex items-center h-20 -mt-10">
        <CheckboxList
          attributes={Object.keys(watchlistObject)}
          title="Check watchlist to be not shown in table"
          defaultChecked={[]}
          onChange={(selectedArray) => {
            const symbolsToBeExcluded: SymbolRow["id"][] = [];
            for (const watchlistName of selectedArray) {
              const symbolWithExchangeArray = watchlistObject[watchlistName];
              for (const symbolWithExchange of symbolWithExchangeArray) {
                symbolsToBeExcluded.push(symbolWithExchange[0])
              }
            }
            setWatchlistsToBeExcluded(symbolsToBeExcluded);
          }}
        />
      </div>
      <RevenueTable filteredYears={filteredYears} />
    </main>
  );
};

export default AnalysisPage;