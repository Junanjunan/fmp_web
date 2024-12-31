-- CreateTable
CREATE TABLE "auth_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "hashed_password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_social_login" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "auth_social_login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_refresh_token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "device_info" TEXT,

    CONSTRAINT "auth_refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_symbols" (
    "id" SERIAL NOT NULL,
    "symbol" VARCHAR(20),
    "error_message" VARCHAR(255),
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_symbols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchanges" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "country_id" VARCHAR(50),

    CONSTRAINT "exchanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "income_statements" (
    "symbol" VARCHAR(20) NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "period" VARCHAR(10) NOT NULL,
    "reported_currency" VARCHAR(10),
    "cik" VARCHAR(20),
    "filling_date" TIMESTAMP(6),
    "accepted_date" TIMESTAMP(6),
    "calendar_year" VARCHAR(4),
    "revenue" BIGINT,
    "cost_of_revenue" BIGINT,
    "gross_profit" BIGINT,
    "gross_profit_ratio" DECIMAL(45,20),
    "research_and_development_expenses" BIGINT,
    "general_and_administrative_expenses" BIGINT,
    "selling_and_marketing_expenses" BIGINT,
    "selling_general_and_administrative_expenses" BIGINT,
    "other_expenses" BIGINT,
    "operating_expenses" BIGINT,
    "cost_and_expenses" BIGINT,
    "interest_income" BIGINT,
    "interest_expense" BIGINT,
    "depreciation_and_amortization" BIGINT,
    "ebitda" BIGINT,
    "ebitda_ratio" DECIMAL(45,20),
    "operating_income" BIGINT,
    "operating_income_ratio" DECIMAL(45,20),
    "total_other_income_expenses_net" BIGINT,
    "income_before_tax" BIGINT,
    "income_before_tax_ratio" DECIMAL(45,20),
    "income_tax_expense" BIGINT,
    "net_income" BIGINT,
    "net_income_ratio" DECIMAL(45,20),
    "eps" DECIMAL(25,10),
    "eps_diluted" DECIMAL(25,10),
    "weighted_average_shs_out" BIGINT,
    "weighted_average_shs_out_dil" BIGINT,
    "link" VARCHAR(255),
    "final_link" VARCHAR(255),

    CONSTRAINT "income_statements_pkey" PRIMARY KEY ("symbol","date","period")
);

-- CreateTable
CREATE TABLE "symbol_profiles" (
    "symbol" VARCHAR(20) NOT NULL,
    "exchange_short_name" VARCHAR(20),
    "price" DECIMAL(30,10),
    "beta" DECIMAL(45,20),
    "vol_avg" BIGINT,
    "mkt_cap" BIGINT,
    "last_div" DECIMAL(45,20),
    "range" VARCHAR(50),
    "changes" DECIMAL(45,20),
    "company_name" VARCHAR(200),
    "currency" VARCHAR(10),
    "cik" VARCHAR(50),
    "isin" VARCHAR(50),
    "cusip" VARCHAR(50),
    "exchange" VARCHAR(50),
    "industry" VARCHAR(200),
    "website" VARCHAR(255),
    "description" VARCHAR(255),
    "ceo" VARCHAR(100),
    "sector" VARCHAR(50),
    "country" VARCHAR(50),
    "full_time_employees" VARCHAR(255),
    "phone" VARCHAR(50),
    "address" VARCHAR(100),
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "zip" VARCHAR(20),
    "dcf_diff" DECIMAL(35,15),
    "dcf" DECIMAL(40,20),
    "image" VARCHAR(100),
    "ipo_date" VARCHAR(20),
    "default_image" BOOLEAN,
    "is_etf" BOOLEAN,
    "is_actively_trading" BOOLEAN,
    "is_adr" BOOLEAN,
    "is_fund" BOOLEAN,

    CONSTRAINT "symbol_profiles_pkey" PRIMARY KEY ("symbol")
);

-- CreateTable
CREATE TABLE "symbols" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "price" DECIMAL(30,10),
    "type_id" VARCHAR(20) NOT NULL,
    "exchange_id" VARCHAR(20),
    "is_updated" BOOLEAN DEFAULT false,
    "is_existing" BOOLEAN DEFAULT true,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symbols_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "types" (
    "id" VARCHAR(20) NOT NULL,

    CONSTRAINT "types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_symbols" (
    "id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "symbol_id" TEXT NOT NULL,

    CONSTRAINT "user_symbols_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "auth_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_symbols_email_symbol_unique" ON "user_symbols"("user_email", "symbol_id");

-- AddForeignKey
ALTER TABLE "error_symbols" ADD CONSTRAINT "error_symbols_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "income_statements" ADD CONSTRAINT "income_statements_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbol_profiles" ADD CONSTRAINT "symbol_profiles_exchange_short_name_fkey" FOREIGN KEY ("exchange_short_name") REFERENCES "exchanges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbol_profiles" ADD CONSTRAINT "symbol_profiles_symbol_fkey" FOREIGN KEY ("symbol") REFERENCES "symbols"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbols" ADD CONSTRAINT "symbols_exchange_id_fkey" FOREIGN KEY ("exchange_id") REFERENCES "exchanges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "symbols" ADD CONSTRAINT "symbols_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_symbols" ADD CONSTRAINT "user_symbols_symbol_id_fkey" FOREIGN KEY ("symbol_id") REFERENCES "symbols"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_symbols" ADD CONSTRAINT "user_symbols_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "auth_user"("email") ON DELETE CASCADE ON UPDATE CASCADE;
