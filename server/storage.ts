import { commands, type Command, type InsertCommand } from "@shared/schema";
import { db } from "./db";
import { ilike, or } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  searchCommands(query: string): Promise<Command[]>;
  getAllCommands(): Promise<Command[]>;
  createCommand(command: InsertCommand): Promise<Command>;
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

  async searchCommands(query: string): Promise<Command[]> {
    const searchTerm = `%${query}%`;
    
    const results = await db
      .select()
      .from(commands)
      .where(
        or(
          ilike(commands.command, searchTerm),
          ilike(commands.description, searchTerm),
          ilike(commands.category, searchTerm),
          ilike(commands.syntax, searchTerm)
        )
      )
      .limit(20);

    return results;
  }

  async getAllCommands(): Promise<Command[]> {
    const results = await db.select().from(commands).limit(20);
    return results;
  }

  async createCommand(insertCommand: InsertCommand): Promise<Command> {
    const [command] = await db
      .insert(commands)
      .values(insertCommand)
      .returning();
    return command;
  }
}

export const storage = new DatabaseStorage();
