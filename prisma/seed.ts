import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedEmpty } from "./seeds/empty";

// Load .env.local so this script works when run directly via `npm run db:seed`
dotenv.config({ path: ".env.local" });

// Safety guard — refuse to run against a production database
if (process.env.NODE_ENV === "production") {
  console.error("ERROR: Refusing to seed in production (NODE_ENV=production).");
  process.exit(1);
}

const VALID_SCENARIOS = ["empty"] as const;
type Scenario = (typeof VALID_SCENARIOS)[number];

const scenario = (process.env.SEED_SCENARIO ?? "empty") as Scenario;

if (!VALID_SCENARIOS.includes(scenario)) {
  console.error(
    `ERROR: Unknown SEED_SCENARIO "${scenario}". Valid options: ${VALID_SCENARIOS.join(", ")}`
  );
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "ERROR: DATABASE_URL is not set. Copy .env.example to .env.local and fill in your connection string."
  );
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Running seed scenario: "${scenario}"`);

  switch (scenario) {
    case "empty":
      await seedEmpty(prisma);
      break;
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
