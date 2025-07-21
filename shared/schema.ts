import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sparkJobs = pgTable("spark_jobs", {
  id: serial("id").primaryKey(),
  userEmail: text("user_email").notNull(),
  applicationName: text("application_name").notNull().unique(),
  chatId: text("chat_id").notNull(),
  jobRam: integer("job_ram").notNull(),
  jobCore: integer("job_core").notNull(),
  jobExecutor: integer("job_executor").notNull(),
  isActive: boolean("is_active").notNull().default(false),
});

export const icebergTables = pgTable("iceberg_tables", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull().unique(),
  tableJobType: text("table_job_type").notNull(),
  tableLocation: text("table_location").notNull(),
  isActive: boolean("is_active").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSparkJobSchema = createInsertSchema(sparkJobs).omit({
  id: true,
}).extend({
  userEmail: z.string().email().refine(
    (email) => email.endsWith("@vietinbank.vn"),
    { message: "Email must end with @vietinbank.vn" }
  ),
  chatId: z.string().regex(/^\d{8}$/, { message: "Chat ID must be exactly 8 digits" }),
});

export const insertIcebergTableSchema = createInsertSchema(icebergTables).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSparkJob = z.infer<typeof insertSparkJobSchema>;
export type SparkJob = typeof sparkJobs.$inferSelect;

export type InsertIcebergTable = z.infer<typeof insertIcebergTableSchema>;
export type IcebergTable = typeof icebergTables.$inferSelect;
