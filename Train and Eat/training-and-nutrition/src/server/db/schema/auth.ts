import {
    index,
    integer,
    pgTable,
    text,
    timestamp,
  } from "drizzle-orm/pg-core";
import { usersTable } from "./users";



export const sessionsTable = pgTable("sessions", {
    id: text().primaryKey().$defaultFn(()=> crypto.randomUUID()),
    user_id: integer().notNull().references(()=> usersTable.id,{onDelete:"cascade"}),
    expires_at: timestamp({ withTimezone: true }).notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull()
}, (table) => [index("sessions_user_id_idx").on(table.user_id)])

export const passwordResetTokensTable = pgTable("reset_token", {
    id:text().primaryKey().$defaultFn(()=> crypto.randomUUID()),
    user_id: integer().notNull().references(()=> usersTable.id,{onDelete:"cascade"}),
    token_hash: text().notNull(),
    created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
    expires_at: timestamp({withTimezone:true}).notNull(),
    used_at:timestamp({ withTimezone: true })
}, (table) => [index("reset_token_hash_idx").on(table.token_hash),
    index("reset_token_user_id_idx").on(table.user_id)])


export type SelectSession = typeof sessionsTable.$inferSelect;
export type InsertSession = typeof sessionsTable.$inferInsert;
export type SelectPasswordResetToken = typeof passwordResetTokensTable.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokensTable.$inferInsert;