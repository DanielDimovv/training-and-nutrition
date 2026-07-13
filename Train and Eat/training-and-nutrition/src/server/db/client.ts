import "server-only"
// import { sql } from "drizzle-orm";
import postgres from "postgres"
import {drizzle} from "drizzle-orm/postgres-js"
import * as schema from "./schema"

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("DATABASE_URL is not set");
  }

const client = postgres(dbUrl,{max:10})
export const db = drizzle(client,{schema})

