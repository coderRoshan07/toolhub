import { db } from "@db";
import * as schema from "@shared/schema";
import { eq, like, and, or } from "drizzle-orm";
import { ToolSuggestionInsert, ToolSuggestion, ToolInsert, Tool } from "@shared/schema";

export const storage = {
  // Category operations
  async getAllCategories() {
    return await db.query.categories.findMany({
      orderBy: (categories) => categories.name,
    });
  },

  async getCategoryBySlug(slug: string) {
    return await db.query.categories.findFirst({
      where: eq(schema.categories.slug, slug),
    });
  },

  // Tool operations
  async getAllTools() {
    return await db.query.tools.findMany({
      with: {
        category: true,
      },
      orderBy: (tools) => tools.name,
    });
  },

  async getToolsByCategory(categoryId: number) {
    return await db.query.tools.findMany({
      where: eq(schema.tools.categoryId, categoryId),
      with: {
        category: true,
      },
      orderBy: (tools) => tools.name,
    });
  },

  async getToolsBySearch(searchTerm: string) {
    try {
      // Log the search request
      console.log(`Searching for tools with term: ${searchTerm}`);
      
      // Get all tools first
      const allTools = await db.query.tools.findMany({
        with: {
          category: true,
        },
      });
      
      // Perform case-insensitive filtering in JavaScript
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      const results = allTools.filter(tool => {
        if (!tool.name || !tool.description) return false;
        return (
          tool.name.toLowerCase().includes(lowercaseSearchTerm) || 
          tool.description.toLowerCase().includes(lowercaseSearchTerm)
        );
      });
      
      // Log the search results
      console.log(`Found ${results.length} matching tools for "${searchTerm}"`);
      return results;
    } catch (error) {
      console.error('Error in search query:', error);
      throw error;
    }
  },

  async getPopularTools(limit = 6) {
    return await db.query.tools.findMany({
      where: eq(schema.tools.popular, true),
      with: {
        category: true,
      },
      limit,
    });
  },

  async getNewTools(limit = 3) {
    return await db.query.tools.findMany({
      where: eq(schema.tools.isNew, true),
      with: {
        category: true,
      },
      limit,
    });
  },

  async getCategoriesWithToolCount() {
    const categories = await db.query.categories.findMany();
    const toolCounts = await Promise.all(
      categories.map(async (category) => {
        const tools = await db.query.tools.findMany({
          where: eq(schema.tools.categoryId, category.id),
        });
        return {
          ...category,
          toolCount: tools.length,
        };
      })
    );
    return toolCounts;
  },
  
  // Tool operations
  async addTool(data: ToolInsert): Promise<Tool> {
    const [tool] = await db.insert(schema.tools)
      .values(data)
      .returning();
    return tool;
  },
  
  // Tool suggestion operations
  async addToolSuggestion(data: ToolSuggestionInsert): Promise<ToolSuggestion> {
    const [suggestion] = await db.insert(schema.toolSuggestions)
      .values(data)
      .returning();
    return suggestion;
  },
};
