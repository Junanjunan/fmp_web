import type { NextConfig } from "next";

const env = process.env;
const isProduction = env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  env: {
    DB_USER: isProduction ? env.PRODUCTION_DB_USER : env.LOCAL_DB_USER,
    DB_HOST: isProduction ? env.PRODUCTION_DB_HOST : env.LOCAL_DB_HOST,
    DB_NAME: isProduction ? env.PRODUCTION_DB_NAME : env.LOCAL_DB_NAME,
    DB_PASSWORD: isProduction ? env.PRODUCTION_DB_PASSWORD : env.LOCAL_DB_PASSWORD,
    DB_PORT: isProduction ? env.PRODUCTION_DB_PORT : env.LOCAL_DB_PORT,
    SERVER_URL: isProduction ? env.PRODUCTION_SERVER_URL : env.LOCAL_SERVER_URL,
    FMP_ROOT: env.FMP_ROOT,
  }
};

export default nextConfig;
