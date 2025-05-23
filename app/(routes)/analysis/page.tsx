'use client';

import { useState, useEffect } from 'react';
import {
  CheckboxList, CheckboxObjectList, Button, Select, InputText
} from '@/app/components/client/UI';
import { RevenueTable } from '@/app/components/client/IncomeStatement';
import { requestGet, requestSearchFilters, requestAnalysis, requestWatchlistsAnalysis } from '@/app/axios';
import { TypeRow, ExchangeRow, ExchangesByCountry, SearchFilters, SymbolRow } from '@/types';
import { useAnalysisStore, useWatchlistStore } from '@/app/stores/useStore';


const AnalysisPage = () => {
  const {
    typeIds, setTypeIds,
    exchanges, setExchanges,
    isOnlyPriceInfo, setIsOnlyPriceInfo,
    selectedTypeIds, setSelectedTypeIds,
    selectedExchangeIds, setSelectedExchangeIds,
    yearsOfTable, setYearsOfTable,
    totalYears, setTotalYears,
    symbolPriceInfos, setSymbolPriceInfos,
    symbolGrowths, setSymbolGrowths,
    applyMinimumPERatio, setApplyMinimumPERatio,
    minimumPERatio, setMinimumPERatio,
    applyMinimumGrowthOfGrowth, setApplyMinimumGrowthOfGrowth,
    minimumGrowthOfGrowth, setMinimumGrowthOfGrowth,
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
    if (isOnlyPriceInfo) {
      setApplyYearCount(false);
      setApplyMinimumGrowthOfGrowth(false);
      setApplyMinimumGrowth(false);
      setApplyMinimumOperatingIncomeRatio(false);
    } else {
      setApplyYearCount(true);
      setApplyMinimumGrowthOfGrowth(true);
      setApplyMinimumGrowth(true);
      setApplyMinimumOperatingIncomeRatio(true);
    }
  }, [isOnlyPriceInfo]);

  useEffect(() => {
    setYearsOfTable(totalYears.slice(0, Number(selectedYearCount)));
  }, [selectedYearCount, totalYears]);

  const setSearchFilters = async () => {
    const defaultCountries = ['US', 'KOR'];
    const countriesString = defaultCountries.join(',');
    const searchFilters: SearchFilters = await requestSearchFilters(null, countriesString);
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

  const handleIsOnlyPriceInfo = () => {
    setIsOnlyPriceInfo(!isOnlyPriceInfo);
  }

  const handleSubmit = async () => {
    // Table can be fulfilled after search when sortedSymbolGrowths is empty
    // app/components/client/IncomeStatement.tsx 17 line: if (sortedSymbolGrowths.length > 0)
    setSortedSymbolGrowths([]);
    setIsLoading(true);
    const data = {
      typeIds: selectedTypeIds,
      exchangeIds: selectedExchangeIds,
      symbol: searchSymbol,
      isOnlyPriceInfo,
    };
    const response = await requestAnalysis(data);
    if (isOnlyPriceInfo) {
      setSymbolPriceInfos(response);
    } else {
      setSymbolGrowths(response);
    }
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

    const count = isOnlyPriceInfo ? Object.keys(symbolGrowths).length : Object.keys(symbolPriceInfos).length;
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
      <CheckboxList
        attributes={['See only price info']}
        title=""
        defaultChecked={isOnlyPriceInfo ? ['See only price info'] : []}
        onChange={handleIsOnlyPriceInfo}
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

      {isOnlyPriceInfo ? null :
        <>
          <div className="flex items-center h-20">
            <CheckboxList
              attributes={['Year Count']}
              title=""
              defaultChecked={applyYearCount || !isOnlyPriceInfo ? ['Year Count'] : []}
              onChange={handleApplyYearCount}
            />
            <div className={`mb-10 ml-5 ${applyYearCount ? 'block' : 'hidden'}`}>
              <Select
                options={totalYears.map((_, index) => index + 1)}
                value={selectedYearCount}
                onChange={handleYearCountChange}
                title=""
                id="yearCount"
              />
            </div>
          </div>

          <div className="flex items-center h-20 -mt-10">
            <CheckboxList
              attributes={['PE Ratio']}
              title=""
              defaultChecked={applyMinimumPERatio || !isOnlyPriceInfo ? ['PE Ratio'] : []}
              onChange={() => setApplyMinimumPERatio(!applyMinimumPERatio)}
            />
            <div className={`mb-10 ml-5 ${applyMinimumPERatio ? 'block' : 'hidden'}`}>
              <InputText
                inputType="number"
                value={minimumPERatio}
                onChange={(e) => setMinimumPERatio(Number(e.target.value))}
                title=""
                id="peRatio"
              />
            </div>
          </div>

          <div className="flex items-center h-20 -mt-10">
            <CheckboxList
              attributes={['Minimum Growth of Growth(%)']}
              title=""
              defaultChecked={applyMinimumGrowthOfGrowth || !isOnlyPriceInfo ? ['Minimum Growth of Growth(%)'] : []}
              onChange={() => setApplyMinimumGrowthOfGrowth(!applyMinimumGrowthOfGrowth)}
            />
            <div className={`mb-10 ml-5 ${applyMinimumGrowthOfGrowth ? 'block' : 'hidden'}`}>
              <InputText
                inputType="number"
                value={minimumGrowthOfGrowth}
                onChange={(e) => setMinimumGrowthOfGrowth(Number(e.target.value))}
                title=""
                id="growthOfGrowthLimit"
              />
            </div>
          </div>

          <div className="flex items-center h-20 -mt-10">
            <CheckboxList
              attributes={['Minimum Growth(%)']}
              title=""
              defaultChecked={applyMinimumGrowth || !isOnlyPriceInfo ? ['Minimum Growth(%)'] : []}
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
                applyMinimumOperatingIncomeRatio || !isOnlyPriceInfo ? ['Minimum Operating Income Ratio(%)'] : []
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
        </>
      }

      <div className="flex items-center h-20">
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
      <RevenueTable filteredYears={filteredYears} isOnlyPriceInfo={isOnlyPriceInfo} />
    </main>
  );
};

export default AnalysisPage;