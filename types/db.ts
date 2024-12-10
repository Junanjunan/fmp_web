export interface TypeRow {
    id: string;
}

export interface ExchangeRow {
    id: string;
    name: string;
}

export interface SymbolRow {
    id: string;
    name: string;
    price: number;
    type_id: TypeRow["id"];
    exchange_id: ExchangeRow["id"];
    is_updated: boolean;
    is_existing: boolean;
    updated_at: Date;
}