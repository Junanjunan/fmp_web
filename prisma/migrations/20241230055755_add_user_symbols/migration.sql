-- CreateTable
CREATE TABLE "user_symbols" (
    "id" SERIAL NOT NULL,
    "user_email" TEXT NOT NULL,
    "symbol_id" TEXT NOT NULL,

    CONSTRAINT "user_symbols_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_symbols" ADD CONSTRAINT "user_symbols_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "auth_user"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_symbols" ADD CONSTRAINT "user_symbols_symbol_id_fkey" FOREIGN KEY ("symbol_id") REFERENCES "symbols"("id") ON DELETE CASCADE ON UPDATE CASCADE;
