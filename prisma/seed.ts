import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedEmpty } from "./seeds/empty";

// Resolve .env.local from the project root (process.cwd()).
// npm scripts always run from the project root, so this is safe and predictable.
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Safety guard — fail closed. Only allow seeding in known-safe environments.
// Checking for explicit allowlist (not just blocking "production") so an
// unset or unknown NODE_ENV also fails rather than silently running.
const allowedEnvs = ["development", "test"];
if (!allowedEnvs.includes(process.env.NODE_ENV ?? "")) {
  console.error(
    `ERROR: Refusing to seed. NODE_ENV is "${process.env.NODE_ENV ?? "unset"}" — ` +
      `seeding is only permitted when NODE_ENV is one of: ${allowedEnvs.join(", ")}.`
  );
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
