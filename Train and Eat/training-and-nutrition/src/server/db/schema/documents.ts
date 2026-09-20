import {
    serial,
    pgTable,
    text,
    timestamp,
  } from "drizzle-orm/pg-core";


  export const documentsTable = pgTable("documents", {
    id:serial().primaryKey(),
    title:text().notNull(),
    category:text().notNull(),
    topic:text().notNull(),
    source:text().notNull(),
    language:text().notNull().default("bg"),
    created_at: timestamp({withTimezone:true}).defaultNow().notNull()

    


  })