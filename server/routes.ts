import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { toolSuggestionInsertSchema, toolInsertSchema, type ToolInsert } from "@shared/schema";
import { setupAuth } from "./auth";
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

// Function to fetch favicon from a URL
async function fetchFavicon(url: string): Promise<string | null> {
  try {
    // Make sure URL has proper format
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    // Parse the URL to get the domain
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    console.log('Attempting to fetch favicon for domain:', domain);
    
    // First try Google's favicon service which is most reliable
    try {
      const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      console.log('Trying Google favicon service:', googleFaviconUrl);
      
      const response = await axios.get(googleFaviconUrl, { 
        responseType: 'arraybuffer',
        timeout: 5000, // 5 second timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const contentType = response.headers['content-type'];
      console.log('Google favicon service response type:', contentType);
      
      // Convert the binary data to a base64 string
      const base64 = Buffer.from(response.data).toString('base64');
      return `data:${contentType};base64,${base64}`;
    } catch (error: any) {
      console.error('Error fetching from Google Favicon service:', error?.message || 'Unknown error');
      
      // If Google service fails, try direct favicon.ico
      try {
        console.log('Trying direct favicon.ico fetch');
        const faviconUrl = `${urlObj.protocol}//${domain}/favicon.ico`;
        const response = await axios.get(faviconUrl, { 
          responseType: 'arraybuffer',
          timeout: 5000, // 5 second timeout
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const contentType = response.headers['content-type'] || 'image/x-icon';
        console.log('Direct favicon.ico response type:', contentType);
        
        // Convert the binary data to a base64 string
        const base64 = Buffer.from(response.data).toString('base64');
        return `data:${contentType};base64,${base64}`;
      } catch (e: any) {
        console.error('Error fetching direct favicon.ico:', e?.message || 'Unknown error');
        return null;
      }
    }
  } catch (error: any) {
    console.error('Error in favicon fetch process:', error?.message || 'Unknown error');
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  const { isAdmin } = setupAuth(app);
  
  // API prefix
  const apiPrefix = "/api";

  // Get all categories with tool counts
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await storage.getCategoriesWithToolCount();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get a specific category by slug
  app.get(`${apiPrefix}/categories/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get tools by category slug
  app.get(`${apiPrefix}/categories/:slug/tools`, async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const tools = await storage.getToolsByCategory(category.id);
      res.json(tools);
    } catch (error) {
      console.error("Error fetching tools by category:", error);
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  // Get popular tools
  app.get(`${apiPrefix}/tools/popular`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const tools = await storage.getPopularTools(limit);
      res.json(tools);
    } catch (error) {
      console.error("Error fetching popular tools:", error);
      res.status(500).json({ message: "Failed to fetch popular tools" });
    }
  });

  // Get new tools
  app.get(`${apiPrefix}/tools/new`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const tools = await storage.getNewTools(limit);
      res.json(tools);
    } catch (error) {
      console.error("Error fetching new tools:", error);
      res.status(500).json({ message: "Failed to fetch new tools" });
    }
  });

  // Search tools
  app.get(`${apiPrefix}/tools/search`, async (req, res) => {
    try {
      const searchTerm = req.query.q as string;
      
      if (!searchTerm || searchTerm.trim() === "") {
        return res.status(400).json({ message: "Search term is required" });
      }
      
      const tools = await storage.getToolsBySearch(searchTerm);
      res.json(tools);
    } catch (error) {
      console.error("Error searching tools:", error);
      res.status(500).json({ message: "Failed to search tools" });
    }
  });

  // Get all tools
  app.get(`${apiPrefix}/tools`, async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error) {
      console.error("Error fetching all tools:", error);
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  // Add a new tool (admin only)
  app.post(`${apiPrefix}/tools`, isAdmin, async (req: Request, res: Response) => {
    try {
      console.log('Received tool data:', req.body);
      console.log('Files:', req.files ? Object.keys(req.files) : 'No files');
      
      let toolData = { ...req.body };
      
      // Convert string boolean values to actual booleans
      if (typeof toolData.popular === 'string') {
        toolData.popular = toolData.popular === 'true';
      }
      
      if (typeof toolData.isNew === 'string') {
        toolData.isNew = toolData.isNew === 'true';
      }
      
      // Ensure categoryId is a number
      if (toolData.categoryId && typeof toolData.categoryId === 'string') {
        toolData.categoryId = parseInt(toolData.categoryId);
      }
      
      // Check if there's a file being uploaded
      if (req.files && req.files.iconFile) {
        const iconFile = req.files.iconFile as any;
        
        // Rather than handling the file upload here, we're going to use a base64 representation
        // This avoids filesystem issues in the Replit environment
        const fileContents = iconFile.data.toString('base64');
        const fileExt = iconFile.name.split('.').pop();
        const dataUrl = `data:image/${fileExt};base64,${fileContents}`;
        
        // Set the iconUrl to be the data URL instead of a file path
        toolData.iconUrl = dataUrl;
        
        // Keep iconName if it's provided, otherwise remove it
        if (!toolData.iconName) {
          delete toolData.iconName;
        }
      } else if (!toolData.iconName && !toolData.iconUrl) {
        // Try to fetch favicon from the URL if it exists
        if (toolData.url) {
          console.log('Attempting to fetch favicon from URL:', toolData.url);
          try {
            // First try to get a basic check if the URL is reachable
            const urlCheck = await axios.head(toolData.url, { timeout: 3000 }).catch(() => null);
            
            if (urlCheck) {
              const favicon = await fetchFavicon(toolData.url);
              if (favicon) {
                toolData.iconUrl = favicon;
                console.log('Successfully fetched favicon from website');
              } else {
                // If favicon fetching fails, use a default icon
                toolData.iconName = 'wrench';
                console.log('Failed to fetch favicon, using default icon');
              }
            } else {
              console.log('URL not reachable, using default icon');
              toolData.iconName = 'wrench';
            }
          } catch (err: any) {
            console.error('Error fetching favicon:', err?.message || 'Unknown error');
            toolData.iconName = 'wrench';
          }
        } else {
          // No URL provided
          toolData.iconName = 'wrench';
          console.log('No URL provided, using default icon');
        }
      }
      
      console.log('Processed tool data before validation:', toolData);
      
      // Ensure popular and isNew are booleans
      if (typeof toolData.popular === 'string') {
        toolData.popular = toolData.popular === 'true';
      }
      
      if (typeof toolData.isNew === 'string') {
        toolData.isNew = toolData.isNew === 'true';
      }
      
      // Force values to be the correct types
      const cleanedData: Record<string, any> = {
        name: String(toolData.name),
        description: String(toolData.description),
        url: String(toolData.url),
        categoryId: Number(toolData.categoryId),
        popular: Boolean(toolData.popular),
        isNew: Boolean(toolData.isNew),
      };
      
      // Add icon data
      if (toolData.iconUrl) {
        cleanedData.iconUrl = String(toolData.iconUrl);
      }
      
      if (toolData.iconName) {
        cleanedData.iconName = String(toolData.iconName);
      }
      
      console.log('Cleaned data for validation:', cleanedData);
      
      // Validate request body using the schema
      const result = toolInsertSchema.safeParse(cleanedData);
      
      if (!result.success) {
        console.error('Validation error details:', JSON.stringify(result.error.errors, null, 2));
        return res.status(400).json({ 
          message: "Invalid tool data", 
          errors: result.error.errors 
        });
      }
      
      // Add the valid tool using the cleaned data (type assertion to satisfy TypeScript)
      const tool = await storage.addTool(cleanedData as ToolInsert);
      res.status(201).json(tool);
    } catch (error) {
      console.error("Error adding tool:", error);
      res.status(500).json({ message: "Failed to add tool" });
    }
  });

  // Favicon fetching debug endpoint
  app.get(`${apiPrefix}/fetchFavicon`, async (req: Request, res: Response) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ message: "URL parameter is required" });
      }
      
      console.log('Testing favicon fetch for URL:', url);
      const favicon = await fetchFavicon(url);
      
      if (favicon) {
        return res.status(200).json({ 
          success: true, 
          favicon,
          message: "Favicon fetched successfully" 
        });
      } else {
        return res.status(404).json({ 
          success: false, 
          message: "Could not fetch favicon" 
        });
      }
    } catch (error: any) {
      console.error("Error fetching favicon:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error fetching favicon", 
        error: error?.message || "Unknown error" 
      });
    }
  });
  
  // Add tool suggestion
  app.post(`${apiPrefix}/suggestions`, async (req: Request, res: Response) => {
    try {
      // Validate request body using the schema
      const result = toolSuggestionInsertSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid tool suggestion data", 
          errors: result.error.errors 
        });
      }
      
      // Store the valid tool suggestion
      const suggestion = await storage.addToolSuggestion(req.body);
      res.status(201).json(suggestion);
    } catch (error) {
      console.error("Error adding tool suggestion:", error);
      res.status(500).json({ message: "Failed to add tool suggestion" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
