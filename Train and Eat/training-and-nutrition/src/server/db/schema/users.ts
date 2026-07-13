import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar().notNull(),
    email: varchar().notNull().unique(),
    password:text().notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    failed_login_attempts: integer().default(0),
    locked_until:timestamp({withTimezone:true}),

  });

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;