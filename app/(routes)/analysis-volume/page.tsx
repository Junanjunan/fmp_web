'use client';

import { useState, useEffect } from 'react';
import {
  CheckboxList, CheckboxObjectList, Button, InputText
} from '@/app/components/client/UI';
import { AnalysisVolumeTable } from '@/app/components/client/table/AnalysisVolume';
import { requestSearchFilters, requestAnalysisVolume } from '@/app/axios';
import {
  SymbolRow, TypeRow, ExchangeRow, ExchangesByCountry,
  SearchFilters, SymbolVolumeInfo, SymbolVolumeInfoArrayItem
} from '@/types';
import { useAnalysisVolumeStore, useWatchlistStore } from '@/app/stores/useStore';


const AnalysisVolumePage = () => {
  const {
    typeIds, setTypeIds,
    exchanges, setExchanges,
    selectedTypeIds, setSelectedTypeIds,
    selectedExchangeIds, setSelectedExchangeIds,
    symbolsVolumeInfoObject, setSymbolsVolumeInfoObject,
    setWatchlistsToBeExcluded,
    numberOfBindingDays, setNumberOfBindingDays,
    numberOfBinds, setNumberOfBinds,
    setOriginSortedSymbols, setSortedSymbols,
  } = useAnalysisVolumeStore();
  const { watchlistObject } = useWatchlistStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchFilters();
    setSelectedTypeIds(selectedTypeIds);
    setSelectedExchangeIds(selectedExchangeIds);
  }, []);

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

  const handleTypeChange = (selected: TypeRow["id"][]) => {
    setSelectedTypeIds(selected);
  };

  const handleExchangeChange = (selected: ExchangeRow["id"][]) => {
    setSelectedExchangeIds(selected);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const days = numberOfBindingDays * numberOfBinds;
    const data = {
      exchangeIds: selectedExchangeIds,
      days: days
    };
    const response = await requestAnalysisVolume(data);
    const responseData = response.data;
    const symbolsVolumeInfoObject: { [key: SymbolRow["id"]]: SymbolVolumeInfo } = {};
    Object.keys(responseData).forEach((exchangeId) => {
      const exchangeData: { symbol: SymbolRow["id"], close: number, volume: number, mkt_cap: number }[] = responseData[exchangeId];
      for (const symbolData of exchangeData) {
        const { symbol, close, volume, mkt_cap } = symbolData;
        const transactionAmount = close * volume;
        if (!symbolsVolumeInfoObject[symbol]) {
          symbolsVolumeInfoObject[symbol] = {
            type_id: 'stock' as TypeRow["id"],
            exchange_id: exchangeId as ExchangeRow["id"],
            price: close,
            lastAdjustedAmount: mkt_cap > 0 ? transactionAmount / mkt_cap * 100 : 0,
            mkt_cap: mkt_cap,
            volumeArray: [volume]
          }
        } else {
          symbolsVolumeInfoObject[symbol].volumeArray.push(volume);
        }
      }
    });

    const sortedSymbolsArray: SymbolVolumeInfoArrayItem[] = [];
    Object.entries(symbolsVolumeInfoObject).forEach(([symbol, symbolData]) => {
      const sortedSymbolsItem = {
        symbol: symbol,
        type_id: symbolData.type_id,
        exchange_id: symbolData.exchange_id,
        price: symbolData.price,
        mkt_cap: symbolData.mkt_cap,
        lastAdjustedAmount: symbolData.lastAdjustedAmount,
        volumeArray: symbolData.volumeArray
      }
      sortedSymbolsArray.push(sortedSymbolsItem);
    });

    setSymbolsVolumeInfoObject(symbolsVolumeInfoObject);
    setOriginSortedSymbols(sortedSymbolsArray);
    setSortedSymbols(sortedSymbolsArray);
    setIsLoading(false);
  };

  const SearchedCount = () => {
    if (isLoading) {
      return null;
    }

    const count = Object.keys(symbolsVolumeInfoObject).length;
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
        inputType="number"
        value={numberOfBindingDays}
        onChange={(e) => setNumberOfBindingDays(Number(e.target.value))}
        title="Number of binding days"
        id="numberOfBindingDays"
      />
      <InputText
        inputType="number"
        value={numberOfBinds}
        onChange={(e) => setNumberOfBinds(Number(e.target.value))}
        title="Number of binds"
        id="numberOfBinds"
      />
      <Button onClick={handleSubmit} isLoading={isLoading} title="Search" />
      <SearchedCount />
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
      <AnalysisVolumeTable />
    </main>
  );
};

export default AnalysisVolumePage;