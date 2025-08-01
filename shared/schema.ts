import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const commands = pgTable("commands", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  command: text("command").notNull(),
  description: text("description").notNull(),
  syntax: text("syntax").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  examples: text("examples").array().notNull().default([]),
});

export const polecenia_cmd = pgTable("polecenia_cmd", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  opis_krotki: text("opis_krotki"),
  polecenie: text("polecenie"),
  opis_szczegolowy: text("opis_szczegolowy"),
  slowa_kluczowe: text("slowa_kluczowe").array(),
  przyklady_uzycia: text("przyklady_uzycia").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCommandSchema = createInsertSchema(commands).omit({
  id: true,
});

export const searchCommandSchema = z.object({
  query: z.string().min(1, "Search query is required").max(200, "Query too long"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Command = typeof commands.$inferSelect;
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type SearchCommand = z.infer<typeof searchCommandSchema>;
export type PoleceniaCMD = typeof polecenia_cmd.$inferSelect;
