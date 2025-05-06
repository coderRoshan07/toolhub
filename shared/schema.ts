import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Category table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(),
  iconName: text("icon_name").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tool table
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  iconName: text("icon_name"),  // Can be null if using custom icon
  iconUrl: text("icon_url"),    // For uploaded/custom icons
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  popular: boolean("popular").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  tools: many(tools),
}));

export const toolsRelations = relations(tools, ({ one }) => ({
  category: one(categories, {
    fields: [tools.categoryId],
    references: [categories.id],
  }),
}));

// Define schemas for validation
export const categoryInsertSchema = createInsertSchema(categories, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  description: (schema) => schema.min(5, "Description must be at least 5 characters"),
  slug: (schema) => schema.min(2, "Slug must be at least 2 characters"),
  iconName: (schema) => schema.min(2, "Icon name must be at least 2 characters"),
  color: (schema) => schema.min(2, "Color must be at least 2 characters"),
});

export const toolInsertSchema = createInsertSchema(tools, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  description: (schema) => schema.min(5, "Description must be at least 5 characters"),
  url: (schema) => schema.url("URL must be a valid URL"),
  iconName: (schema) => schema.optional(),
  iconUrl: (schema) => schema.optional(),
}).refine(
  (data) => {
    // Either iconName or iconUrl must be provided
    return !!(data.iconName || data.iconUrl);
  },
  {
    message: "Either icon name or icon URL must be provided",
    path: ["iconName"],
  }
);

// Export types
export type Category = typeof categories.$inferSelect;
export type CategoryInsert = z.infer<typeof categoryInsertSchema>;
export type Tool = typeof tools.$inferSelect;
export type ToolInsert = z.infer<typeof toolInsertSchema>;

export const toolSuggestions = pgTable("tool_suggestions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  submitterEmail: text("submitter_email"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const toolSuggestionInsertSchema = createInsertSchema(toolSuggestions, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  description: (schema) => schema.min(5, "Description must be at least 5 characters"),
  url: (schema) => schema.url("URL must be a valid URL"),
  submitterEmail: (schema) => schema.email("Please provide a valid email").optional(),
});

export type ToolSuggestion = typeof toolSuggestions.$inferSelect;
export type ToolSuggestionInsert = z.infer<typeof toolSuggestionInsertSchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
