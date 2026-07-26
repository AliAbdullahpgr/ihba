import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { schema } from "@/lib/db/schema";

function required(name: "TURSO_DATABASE_URL" | "TURSO_AUTH_TOKEN") {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

const client = createClient({
  url: required("TURSO_DATABASE_URL"),
  authToken: required("TURSO_AUTH_TOKEN"),
});

export const db = drizzle(client, { schema });
