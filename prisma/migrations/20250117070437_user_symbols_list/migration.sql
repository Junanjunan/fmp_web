/*
  Warnings:

  - A unique constraint covering the columns `[user_email,symbol_id,user_symbols_list_id]` on the table `user_symbols` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_symbols_list_id` to the `user_symbols` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_symbols_user_email_symbol_id_key";

-- AlterTable
ALTER TABLE "user_symbols" ADD COLUMN     "user_symbols_list_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "user_symbols_list" (
    "id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_symbols_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbol_historical_price_full_amex" (
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

    CONSTRAINT "symbol_historical_price_full_amex_pkey" PRIMARY KEY ("symbol","date")
);

-- CreateTable
CREATE TABLE "symbol_historical_price_full_koe" (
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

    CONSTRAINT "symbol_historical_price_full_koe_pkey" PRIMARY KEY ("symbol","date")
);

-- CreateTable
CREATE TABLE "symbol_historical_price_full_ksc" (
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

    CONSTRAINT "symbol_historical_price_full_ksc_pkey" PRIMARY KEY ("symbol","date")
);

-- CreateTable
CREATE TABLE "symbol_historical_price_full_nasdaq" (
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

    CONSTRAINT "symbol_historical_price_full_nasdaq_pkey" PRIMARY KEY ("symbol","date")
);

-- CreateTable
CREATE TABLE "symbol_historical_price_full_nyse" (
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

    CONSTRAINT "symbol_historical_price_full_nyse_pkey" PRIMARY KEY ("symbol","date")
);

-- CreateTable
CREATE TABLE "symbols_check_updated" (
    "symbol" VARCHAR(20) NOT NULL,
    "update_function" VARCHAR(100) NOT NULL,
    "executed_date" TIMESTAMP(6) NOT NULL,
    "is_updated" BOOLEAN DEFAULT false,

    CONSTRAINT "symbols_check_updated_pkey" PRIMARY KEY ("symbol","update_function","executed_date")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_symbols_list_user_email_name_key" ON "user_symbols_list"("user_email", "name");

-- CreateIndex
CREATE UNIQUE INDEX "user_symbols_user_email_symbol_id_user_symbols_list_id_key" ON "user_symbols"("user_email", "symbol_id", "user_symbols_list_id");

-- AddForeignKey
ALTER TABLE "user_symbols_list" ADD CONSTRAINT "user_symbols_list_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "auth_user"("email") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_symbols" ADD CONSTRAINT "user_symbols_user_symbols_list_id_fkey" FOREIGN KEY ("user_symbols_list_id") REFERENCES "user_symbols_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbol_historical_price_full_amex" ADD CONSTRAINT "symbol_historical_price_full_amex_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbol_historical_price_full_koe" ADD CONSTRAINT "symbol_historical_price_full_koe_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbol_historical_price_full_ksc" ADD CONSTRAINT "symbol_historical_price_full_ksc_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbol_historical_price_full_nasdaq" ADD CONSTRAINT "symbol_historical_price_full_nasdaq_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbol_historical_price_full_nyse" ADD CONSTRAINT "symbol_historical_price_full_nyse_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbols_check_updated" ADD CONSTRAINT "symbols_check_updated_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
