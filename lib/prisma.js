import { PrismaClient } from "@prisma/client";

// Prevent creating a new PrismaClient on every hot-reload in dev,
// and avoid exhausting connections on serverless in production.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
