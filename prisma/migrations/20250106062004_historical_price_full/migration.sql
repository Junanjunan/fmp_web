-- CreateTable
CREATE TABLE "symbol_historical_price_full" (
    "symbol" VARCHAR(20) NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "open" DECIMAL(30,10),
    "high" DECIMAL(30,10),
    "low" DECIMAL(30,10),
    "close" DECIMAL(30,10),
    "adj_close" DECIMAL(30,10),
    "volume" BIGINT,
    "unadjusted_volume" BIGINT,
    "change" DECIMAL(30,10),
    "change_percent" DECIMAL(30,10),
    "vwap" DECIMAL(30,10),
    "label" VARCHAR(50),
    "change_over_time" DECIMAL(30,20),

    CONSTRAINT "symbol_historical_price_full_pkey" PRIMARY KEY ("symbol","date")
);

-- AddForeignKey
ALTER TABLE "symbol_historical_price_full" ADD CONSTRAINT "symbol_historical_price_full_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
