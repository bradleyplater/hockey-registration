import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Prisma CLI doesn't load .env.local automatically (that's a Next.js convention).
// Load it explicitly so migrate / generate / studio all pick up the right DATABASE_URL.
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
