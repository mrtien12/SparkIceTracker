import { users, sparkJobs, icebergTables, type User, type InsertUser, type SparkJob, type InsertSparkJob, type IcebergTable, type InsertIcebergTable } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Spark Jobs
  getAllSparkJobs(): Promise<SparkJob[]>;
  getSparkJobsByUserId(userId: number): Promise<SparkJob[]>;
  getSparkJobById(id: number): Promise<SparkJob | undefined>;
  createSparkJob(sparkJob: InsertSparkJob, userId: number): Promise<SparkJob>;
  updateSparkJob(id: number, sparkJob: Partial<SparkJob>): Promise<SparkJob>;
  deleteSparkJob(id: number): Promise<void>;
  getSparkJobByApplicationName(applicationName: string): Promise<SparkJob | undefined>;
  
  // Iceberg Tables
  getAllIcebergTables(): Promise<IcebergTable[]>;
  getIcebergTablesByUserId(userId: number): Promise<IcebergTable[]>;
  getIcebergTableById(id: number): Promise<IcebergTable | undefined>;
  createIcebergTable(icebergTable: InsertIcebergTable, userId: number): Promise<IcebergTable>;
  updateIcebergTable(id: number, icebergTable: Partial<IcebergTable>): Promise<IcebergTable>;
  deleteIcebergTable(id: number): Promise<void>;
  getIcebergTableByTableName(tableName: string): Promise<IcebergTable | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Spark Jobs
  async getAllSparkJobs(): Promise<SparkJob[]> {
    return await db.select().from(sparkJobs);
  }

  async getSparkJobsByUserId(userId: number): Promise<SparkJob[]> {
    return await db.select().from(sparkJobs).where(eq(sparkJobs.userId, userId));
  }

  async getSparkJobById(id: number): Promise<SparkJob | undefined> {
    const [sparkJob] = await db.select().from(sparkJobs).where(eq(sparkJobs.id, id));
    return sparkJob || undefined;
  }

  async createSparkJob(insertSparkJob: InsertSparkJob, userId: number): Promise<SparkJob> {
    const [sparkJob] = await db
      .insert(sparkJobs)
      .values({ ...insertSparkJob, userId })
      .returning();
    return sparkJob;
  }

  async updateSparkJob(id: number, updateData: Partial<SparkJob>): Promise<SparkJob> {
    const [sparkJob] = await db
      .update(sparkJobs)
      .set(updateData)
      .where(eq(sparkJobs.id, id))
      .returning();
    return sparkJob;
  }

  async deleteSparkJob(id: number): Promise<void> {
    await db.delete(sparkJobs).where(eq(sparkJobs.id, id));
  }

  async getSparkJobByApplicationName(applicationName: string): Promise<SparkJob | undefined> {
    const [sparkJob] = await db.select().from(sparkJobs).where(eq(sparkJobs.applicationName, applicationName));
    return sparkJob || undefined;
  }

  // Iceberg Tables
  async getAllIcebergTables(): Promise<IcebergTable[]> {
    return await db.select().from(icebergTables);
  }

  async getIcebergTableById(id: number): Promise<IcebergTable | undefined> {
    const [icebergTable] = await db.select().from(icebergTables).where(eq(icebergTables.id, id));
    return icebergTable || undefined;
  }

  async getIcebergTablesByUserId(userId: number): Promise<IcebergTable[]> {
    return await db.select().from(icebergTables).where(eq(icebergTables.userId, userId));
  }

  async createIcebergTable(insertIcebergTable: InsertIcebergTable, userId: number): Promise<IcebergTable> {
    const [icebergTable] = await db
      .insert(icebergTables)
      .values({ ...insertIcebergTable, userId })
      .returning();
    return icebergTable;
  }

  async updateIcebergTable(id: number, updateData: Partial<IcebergTable>): Promise<IcebergTable> {
    const [icebergTable] = await db
      .update(icebergTables)
      .set(updateData)
      .where(eq(icebergTables.id, id))
      .returning();
    return icebergTable;
  }

  async deleteIcebergTable(id: number): Promise<void> {
    await db.delete(icebergTables).where(eq(icebergTables.id, id));
  }

  async getIcebergTableByTableName(tableName: string): Promise<IcebergTable | undefined> {
    const [icebergTable] = await db.select().from(icebergTables).where(eq(icebergTables.tableName, tableName));
    return icebergTable || undefined;
  }
}

export const storage = new DatabaseStorage();
