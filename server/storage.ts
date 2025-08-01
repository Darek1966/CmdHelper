import { polecenia_cmd, type PoleceniaCMD } from "@shared/schema";
import { db } from "./db";
import { ilike, or, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  searchCommands(query: string): Promise<any[]>;
  getAllCommands(): Promise<any[]>;
  createCommand(command: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<any | undefined> {
    // User functionality kept for compatibility
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    // User functionality kept for compatibility
    return undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    // User functionality kept for compatibility
    return undefined;
  }

  async searchCommands(query: string): Promise<any[]> {
    const searchTerm = `%${query}%`;
    
    const results = await db
      .select({
        id: polecenia_cmd.id,
        command: polecenia_cmd.polecenie,
        description: polecenia_cmd.opis_krotki,
        syntax: polecenia_cmd.polecenie,
        category: sql<string>`'Polecenia CMD'`.as('category'),
        difficulty: sql<string>`'Średni'`.as('difficulty'),
        examples: sql<string[]>`array[polecenia_cmd.opis_szczegolowy]`.as('examples')
      })
      .from(polecenia_cmd)
      .where(
        or(
          ilike(polecenia_cmd.polecenie, searchTerm),
          ilike(polecenia_cmd.opis_krotki, searchTerm),
          ilike(polecenia_cmd.opis_szczegolowy, searchTerm),
          sql`exists (select 1 from unnest(polecenia_cmd.slowa_kluczowe) as keyword where keyword ilike ${searchTerm})`
        )
      )
      .limit(20);

    return results;
  }

  async getAllCommands(): Promise<any[]> {
    const results = await db
      .select({
        id: polecenia_cmd.id,
        command: polecenia_cmd.polecenie,
        description: polecenia_cmd.opis_krotki,
        syntax: polecenia_cmd.polecenie,
        category: sql<string>`'Polecenia CMD'`.as('category'),
        difficulty: sql<string>`'Średni'`.as('difficulty'),
        examples: sql<string[]>`array[polecenia_cmd.opis_szczegolowy]`.as('examples')
      })
      .from(polecenia_cmd)
      .limit(20);
    return results;
  }

  async createCommand(insertCommand: any): Promise<any> {
    return insertCommand; // Not implemented for polecenia_cmd table
  }
}

export const storage = new DatabaseStorage();
