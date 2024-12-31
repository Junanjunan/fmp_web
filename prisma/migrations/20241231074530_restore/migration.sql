/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `auth_refresh_token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider,provider_user_id]` on the table `auth_social_login` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_refresh_token_token_key" ON "auth_refresh_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "auth_social_login_provider_provider_user_id_key" ON "auth_social_login"("provider", "provider_user_id");

-- AddForeignKey
ALTER TABLE "auth_social_login" ADD CONSTRAINT "auth_social_login_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_refresh_token" ADD CONSTRAINT "auth_refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
