'use client';

import { useState, useEffect } from 'react';
import { CheckboxList } from '@/app/components/UI';
import { requestSearchFilters } from '@/app/axios';
import { TypeRow, ExchangeRow } from '@/types';

const AnalysisPage = () => {
  const [typeIds, setTypeIds] = useState<TypeRow["id"][]>([]);
  const [exchangeIds, setExchangeIds] = useState<ExchangeRow["id"][]>([]);
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

  return (
    <div>
      <CheckboxList attributes={typeIds} title="Types" />
      <br />
      <CheckboxList attributes={exchangeIds} title="Exchanges" />
    </div>
  );
};

export default AnalysisPage;