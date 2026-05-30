import { PrismaClient } from "@prisma/client";

/**
 * Empty seed — resets the database to a clean slate with no data.
 * Extend this file once the Season and other models are added to the schema.
 */
export async function seedEmpty(_prisma: PrismaClient) {
  console.log("Seeding: empty state");

  // No models exist yet — this is a placeholder.
  // When the Season model lands (issue #20), add:
  //   await prisma.season.create({ data: { label: '25/26', ... } })

  console.log("Empty seed complete.");
}
