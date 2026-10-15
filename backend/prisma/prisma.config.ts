import dotenv from "dotenv";
dotenv.config();

import { defineConfig } from "@prisma/config";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://neondb_owner:npg_Gwcs0PmDE9TY@ep-raspy-paper-b3emy8ck-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});