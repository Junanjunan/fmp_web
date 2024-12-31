-- DropForeignKey
ALTER TABLE "user_symbols" DROP CONSTRAINT "user_symbols_symbol_id_fkey";

-- DropForeignKey
ALTER TABLE "user_symbols" DROP CONSTRAINT "user_symbols_user_email_fkey";

-- AddForeignKey
ALTER TABLE "user_symbols" ADD CONSTRAINT "user_symbols_symbol_id_fkey" FOREIGN KEY ("symbol_id") REFERENCES "symbols"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_symbols" ADD CONSTRAINT "user_symbols_user_email_fkey" FOREIGN KEY ("user_email") REFERENCES "auth_user"("email") ON DELETE CASCADE ON UPDATE NO ACTION;
