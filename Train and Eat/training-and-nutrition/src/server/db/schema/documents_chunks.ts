import {
    serial,
    integer,
    pgTable,
    text,
    vector,
    index
  } from "drizzle-orm/pg-core";
import { documentsTable } from "./documents";



  export const documentChunksTable = pgTable("document_chunks", {
    id: serial().primaryKey(),
    document_id:integer().notNull().references(()=> documentsTable.id, {onDelete:"cascade"}),
    chunk_index:integer().notNull(),
    content:text().notNull(),
    embedding: vector({dimensions:1536}).notNull()
  }, (t) => [
    index("document_chunks_embedding_idx")
      .using("hnsw", t.embedding.op("vector_cosine_ops")),
  ])