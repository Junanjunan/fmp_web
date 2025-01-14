'use client';

import { useState, useEffect } from 'react';
import {
  CheckboxList, CheckboxObjectList, Button, InputText
} from '@/app/components/client/UI';
import { AnalysisVolumeTable } from '@/app/components/client/table/AnalysisVolume';
import { requestGet, requestAnalysisVolume } from '@/app/axios';
import { TypeRow, ExchangeRow, ExchangesByCountry, SearchFilters } from '@/types';
import { useAnalysisVolumeStore } from '@/app/stores/useStore';


const AnalysisVolumePage = () => {
  const {
    typeIds, setTypeIds,
    exchanges, setExchanges,
    selectedTypeIds, setSelectedTypeIds,
    selectedExchangeIds, setSelectedExchangeIds,
    symbolGrowths,
    excludeWatchlist, setExcludeWatchlist,
    numberOfBindingDays, setNumberOfBindingDays,
    numberOfBinds, setNumberOfBinds,
  } = useAnalysisVolumeStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchFilters();
    setSelectedTypeIds(selectedTypeIds);
    setSelectedExchangeIds(selectedExchangeIds);
  }, []);

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
    console.log("response", response);
    setIsLoading(false);
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
      <div className="flex items-center h-20">
        <CheckboxList
          attributes={['Exclude Watchlist']}
          title=""
          defaultChecked={excludeWatchlist ? ['Exclude Watchlist'] : []}
          onChange={() => {setExcludeWatchlist(!excludeWatchlist)}}
        />
      </div>
      <AnalysisVolumeTable />
    </main>
  );
};

export default AnalysisVolumePage;