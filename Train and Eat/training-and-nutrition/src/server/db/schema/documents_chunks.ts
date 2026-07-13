import {
    serial,
    integer,
    pgTable,
    text,
    timestamp,
    varchar,
    vector
  } from "drizzle-orm/pg-core";
import { documentsTable } from "./documents";



  export const documentChunksTable = pgTable("document_chunks", {
    id: serial().primaryKey(),
    document_id:integer().notNull().references(()=> documentsTable.id, {onDelete:"cascade"}),
    chunk_index:integer().notNull(),
    conntent:text().notNull(),
    embeddinng: vector({dimensions:1536}).notNull()
  })