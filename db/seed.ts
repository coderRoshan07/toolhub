import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    // Check if categories already exist to avoid duplicates
    const existingCategories = await db.query.categories.findMany();
    
    if (existingCategories.length === 0) {
      console.log("Seeding categories...");
      
      // Define categories
      const categoryData: schema.CategoryInsert[] = [
        {
          name: "Design",
          description: "Tools for graphic design, UI/UX, and visual content creation",
          slug: "design",
          iconName: "brush",
          color: "primary",
        },
        {
          name: "Productivity",
          description: "Tools to improve efficiency and manage tasks effectively",
          slug: "productivity",
          iconName: "calendar-check",
          color: "secondary",
        },
        {
          name: "Development",
          description: "Tools for coding, programming, and software development",
          slug: "development",
          iconName: "code",
          color: "green",
        },
        {
          name: "Marketing",
          description: "Tools for digital marketing, SEO, and analytics",
          slug: "marketing",
          iconName: "line-chart",
          color: "purple",
        },
        {
          name: "Writing",
          description: "Tools for writing, editing, and content creation",
          slug: "writing",
          iconName: "pen-tool",
          color: "blue",
        },
        {
          name: "Utilities",
          description: "General purpose tools for everyday tasks",
          slug: "utilities",
          iconName: "tool",
          color: "yellow",
        },
        {
          name: "SEO",
          description: "Tools for search engine optimization and visibility",
          slug: "seo",
          iconName: "search",
          color: "red",
        },
        {
          name: "File Conversion",
          description: "Tools to convert files between different formats",
          slug: "file-conversion",
          iconName: "file-type",
          color: "indigo",
        },
        {
          name: "AI Tools",
          description: "Artificial Intelligence tools for various tasks and automations",
          slug: "ai-tools",
          iconName: "bot",
          color: "sky",
        },
        {
          name: "Education",
          description: "Learning resources and educational tools for all ages",
          slug: "education",
          iconName: "graduation-cap",
          color: "teal",
        },
        {
          name: "Finance",
          description: "Tools for budgeting, financial planning, and money management",
          slug: "finance",
          iconName: "calculator",
          color: "emerald",
        },
        {
          name: "Video Tools",
          description: "Tools for video creation, editing, and optimization",
          slug: "video-tools",
          iconName: "video",
          color: "rose",
        },
        {
          name: "Audio Tools",
          description: "Tools for audio recording, editing, and enhancement",
          slug: "audio-tools",
          iconName: "headphones",
          color: "amber",
        },
        {
          name: "Social Media",
          description: "Tools for social media management and content creation",
          slug: "social-media",
          iconName: "share-2",
          color: "cyan",
        },
      ];
      
      // Insert categories and collect their IDs
      const insertedCategories = await db.insert(schema.categories)
        .values(categoryData)
        .returning({ id: schema.categories.id, name: schema.categories.name });
      
      console.log(`Inserted ${insertedCategories.length} categories`);
      
      // Create a mapping of category names to IDs
      const categoryMap = insertedCategories.reduce((acc, category) => {
        acc[category.name] = category.id;
        return acc;
      }, {} as Record<string, number>);
      
      // Define tools
      const toolsData: schema.ToolInsert[] = [
        // Design Tools
        {
          name: "Canva",
          description: "Free graphic design platform with templates for social media, presentations, and more.",
          url: "https://canva.com",
          iconName: "palette",
          categoryId: categoryMap["Design"],
          popular: true,
          isNew: false,
        },
        {
          name: "Figma",
          description: "Collaborative interface design tool for creating UI/UX designs and prototypes.",
          url: "https://figma.com",
          iconName: "layout",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: false,
        },
        {
          name: "Coolors",
          description: "Fast color schemes generator to create beautiful color palettes for your designs.",
          url: "https://coolors.co",
          iconName: "droplet",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: false,
        },
        {
          name: "Unsplash",
          description: "Free high-resolution photos for personal and commercial use.",
          url: "https://unsplash.com",
          iconName: "image",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: false,
        },
        {
          name: "FontPair",
          description: "Free resource for finding perfect font combinations and typography pairs.",
          url: "https://fontpair.co",
          iconName: "type",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: false,
        },
        {
          name: "Remove.bg",
          description: "Remove image backgrounds automatically in 5 seconds with just one click.",
          url: "https://remove.bg",
          iconName: "scissors",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: false,
        },
        {
          name: "Color Hunt",
          description: "Curated collection of color palettes for designers and artists.",
          url: "https://colorhunt.co",
          iconName: "droplets",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: false,
        },
        {
          name: "Behance",
          description: "Showcase and discover creative work from around the world.",
          url: "https://behance.net",
          iconName: "folder-open",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: false,
        },
        
        // Productivity Tools
        {
          name: "Notion",
          description: "All-in-one workspace for notes, project management, documents, and collaboration.",
          url: "https://notion.so",
          iconName: "clipboard-check",
          categoryId: categoryMap["Productivity"],
          popular: true,
          isNew: false,
        },
        {
          name: "Trello",
          description: "Visual tool for organizing work and managing projects with boards, lists, and cards.",
          url: "https://trello.com",
          iconName: "trello",
          categoryId: categoryMap["Productivity"],
          popular: false,
          isNew: false,
        },
        {
          name: "Todoist",
          description: "Task manager and to-do list app that helps organize work and life.",
          url: "https://todoist.com",
          iconName: "check-square",
          categoryId: categoryMap["Productivity"],
          popular: false,
          isNew: false,
        },
        {
          name: "Forest",
          description: "Stay focused and be present with an app that helps you stop using your phone.",
          url: "https://www.forestapp.cc",
          iconName: "tree",
          categoryId: categoryMap["Productivity"],
          popular: false,
          isNew: false,
        },
        {
          name: "Toggl",
          description: "Simple time tracking tool that helps boost your productivity.",
          url: "https://toggl.com",
          iconName: "clock",
          categoryId: categoryMap["Productivity"],
          popular: false,
          isNew: false,
        },
        
        // Development Tools
        {
          name: "GitHub",
          description: "Version control platform for code hosting, collaboration, and project management.",
          url: "https://github.com",
          iconName: "github",
          categoryId: categoryMap["Development"],
          popular: true,
          isNew: false,
        },
        {
          name: "CodePen",
          description: "Social development environment for front-end designers and developers.",
          url: "https://codepen.io",
          iconName: "codepen",
          categoryId: categoryMap["Development"],
          popular: false,
          isNew: false,
        },
        {
          name: "Replit",
          description: "Collaborative browser-based IDE that lets you code in 50+ languages.",
          url: "https://replit.com",
          iconName: "terminal",
          categoryId: categoryMap["Development"],
          popular: false,
          isNew: false,
        },
        {
          name: "VSCode",
          description: "Free, open-source code editor with built-in Git commands and debugging support.",
          url: "https://code.visualstudio.com",
          iconName: "code",
          categoryId: categoryMap["Development"],
          popular: false,
          isNew: false,
        },
        {
          name: "Stack Overflow",
          description: "Q&A platform for developers to learn, share, and solve programming problems.",
          url: "https://stackoverflow.com",
          iconName: "layers",
          categoryId: categoryMap["Development"],
          popular: false,
          isNew: false,
        },
        
        // Marketing Tools
        {
          name: "Google Analytics",
          description: "Free web analytics service to track website traffic and user behavior.",
          url: "https://analytics.google.com",
          iconName: "bar-chart-2",
          categoryId: categoryMap["Marketing"],
          popular: true,
          isNew: false,
        },
        {
          name: "Mailchimp",
          description: "Marketing automation platform and email marketing service.",
          url: "https://mailchimp.com",
          iconName: "mail",
          categoryId: categoryMap["Marketing"],
          popular: false,
          isNew: false,
        },
        {
          name: "Hubspot",
          description: "CRM platform with free marketing, sales, and customer service tools.",
          url: "https://hubspot.com",
          iconName: "users",
          categoryId: categoryMap["Marketing"],
          popular: false,
          isNew: false,
        },
        {
          name: "Buffer",
          description: "Schedule and manage social media posts across multiple platforms.",
          url: "https://buffer.com",
          iconName: "share-2",
          categoryId: categoryMap["Marketing"],
          popular: false,
          isNew: false,
        },
        
        // Writing Tools
        {
          name: "Grammarly",
          description: "Digital writing assistant that checks grammar, spelling, punctuation, and more.",
          url: "https://grammarly.com",
          iconName: "check",
          categoryId: categoryMap["Writing"],
          popular: true,
          isNew: false,
        },
        {
          name: "Hemingway Editor",
          description: "Makes your writing bold and clear by highlighting wordy sentences and common errors.",
          url: "https://hemingwayapp.com",
          iconName: "edit",
          categoryId: categoryMap["Writing"],
          popular: false,
          isNew: true,
        },
        {
          name: "Notion.so",
          description: "All-in-one workspace that supports long-form writing, notes, and wikis.",
          url: "https://notion.so",
          iconName: "book-open",
          categoryId: categoryMap["Writing"],
          popular: false,
          isNew: false,
        },
        {
          name: "LanguageTool",
          description: "Grammar, style, and spell checker that supports multiple languages.",
          url: "https://languagetool.org",
          iconName: "globe",
          categoryId: categoryMap["Writing"],
          popular: false,
          isNew: false,
        },
        
        // Utilities Tools
        {
          name: "TinyPNG",
          description: "Compress PNG and JPEG images while preserving transparency and quality.",
          url: "https://tinypng.com",
          iconName: "minimize-2",
          categoryId: categoryMap["Utilities"],
          popular: true,
          isNew: false,
        },
        {
          name: "WeTransfer",
          description: "Simple way to send large files to anyone, without registration.",
          url: "https://wetransfer.com",
          iconName: "upload-cloud",
          categoryId: categoryMap["Utilities"],
          popular: false,
          isNew: false,
        },
        {
          name: "PDF24",
          description: "Free online PDF tools to merge, split, compress, and convert PDFs.",
          url: "https://tools.pdf24.org",
          iconName: "file",
          categoryId: categoryMap["Utilities"],
          popular: false,
          isNew: false,
        },
        {
          name: "Wolfram Alpha",
          description: "Computational intelligence engine that answers factual queries.",
          url: "https://wolframalpha.com",
          iconName: "cpu",
          categoryId: categoryMap["Utilities"],
          popular: false,
          isNew: false,
        },
        
        // SEO Tools
        {
          name: "Ubersuggest",
          description: "Free SEO tool that provides insights on keywords, content ideas, and backlinks.",
          url: "https://neilpatel.com/ubersuggest",
          iconName: "search",
          categoryId: categoryMap["SEO"],
          popular: false,
          isNew: false,
        },
        {
          name: "Google Search Console",
          description: "Monitor and optimize your website's presence in Google Search results.",
          url: "https://search.google.com/search-console",
          iconName: "trending-up",
          categoryId: categoryMap["SEO"],
          popular: true,
          isNew: false,
        },
        {
          name: "Ahrefs Webmaster Tools",
          description: "Free SEO toolset to check backlinks, analyze site health, and track rankings.",
          url: "https://ahrefs.com/webmaster-tools",
          iconName: "activity",
          categoryId: categoryMap["SEO"],
          popular: false,
          isNew: false,
        },
        
        // File Conversion Tools
        {
          name: "Convertio",
          description: "Convert files between different formats with this easy-to-use tool.",
          url: "https://convertio.co",
          iconName: "refresh-cw",
          categoryId: categoryMap["File Conversion"],
          popular: true,
          isNew: false,
        },
        {
          name: "Online-Convert",
          description: "Convert media files online for free in high quality.",
          url: "https://online-convert.com",
          iconName: "repeat",
          categoryId: categoryMap["File Conversion"],
          popular: false,
          isNew: false,
        },
        {
          name: "Zamzar",
          description: "Free online file converter supporting over 1100 file formats.",
          url: "https://zamzar.com",
          iconName: "file-plus",
          categoryId: categoryMap["File Conversion"],
          popular: false,
          isNew: false,
        },
        
        // AI Tools
        {
          name: "ChatGPT",
          description: "AI assistant for answering questions, drafting content, and problem-solving.",
          url: "https://chat.openai.com",
          iconName: "message-square",
          categoryId: categoryMap["AI Tools"],
          popular: true,
          isNew: false,
        },
        {
          name: "DALL-E",
          description: "AI system that creates images from textual descriptions.",
          url: "https://openai.com/dall-e-2",
          iconName: "image-plus",
          categoryId: categoryMap["AI Tools"],
          popular: false,
          isNew: false,
        },
        {
          name: "Midjourney",
          description: "AI art generator that creates images from text descriptions.",
          url: "https://midjourney.com",
          iconName: "sparkles",
          categoryId: categoryMap["AI Tools"],
          popular: false,
          isNew: false,
        },
        
        // Education Tools
        {
          name: "Khan Academy",
          description: "Free world-class education for anyone, anywhere through instructional videos and exercises.",
          url: "https://khanacademy.org",
          iconName: "book",
          categoryId: categoryMap["Education"],
          popular: true,
          isNew: false,
        },
        {
          name: "Duolingo",
          description: "Free language learning app with bite-sized lessons and gamified experience.",
          url: "https://duolingo.com",
          iconName: "globe",
          categoryId: categoryMap["Education"],
          popular: false,
          isNew: false,
        },
        {
          name: "Codecademy",
          description: "Interactive platform that offers free coding classes in programming languages.",
          url: "https://codecademy.com",
          iconName: "code",
          categoryId: categoryMap["Education"],
          popular: false,
          isNew: false,
        },
        
        // Finance Tools
        {
          name: "Mint",
          description: "Personal finance app that brings together your accounts, bills, and more.",
          url: "https://mint.intuit.com",
          iconName: "dollar-sign",
          categoryId: categoryMap["Finance"],
          popular: true,
          isNew: false,
        },
        {
          name: "NerdWallet",
          description: "Personal finance website offering advice and tools for financial decisions.",
          url: "https://nerdwallet.com",
          iconName: "credit-card",
          categoryId: categoryMap["Finance"],
          popular: false,
          isNew: false,
        },
        
        // Video Tools
        {
          name: "DaVinci Resolve",
          description: "Professional video editing, color correction, and audio post-production in one tool.",
          url: "https://www.blackmagicdesign.com/products/davinciresolve",
          iconName: "film",
          categoryId: categoryMap["Video Tools"],
          popular: true,
          isNew: false,
        },
        {
          name: "Shotcut",
          description: "Free, open-source, cross-platform video editor for all skill levels.",
          url: "https://shotcut.org",
          iconName: "scissors",
          categoryId: categoryMap["Video Tools"],
          popular: false,
          isNew: false,
        },
        
        // Audio Tools
        {
          name: "Audacity",
          description: "Free, open-source audio editor and recording application.",
          url: "https://audacityteam.org",
          iconName: "mic",
          categoryId: categoryMap["Audio Tools"],
          popular: true,
          isNew: false,
        },
        {
          name: "Anchor",
          description: "Free platform to create, distribute, and monetize your podcast.",
          url: "https://anchor.fm",
          iconName: "headphones",
          categoryId: categoryMap["Audio Tools"],
          popular: false,
          isNew: false,
        },
        
        // Social Media Tools
        {
          name: "Later",
          description: "Social media scheduling platform to plan and publish content.",
          url: "https://later.com",
          iconName: "calendar",
          categoryId: categoryMap["Social Media"],
          popular: true,
          isNew: false,
        },
        {
          name: "Canva Social Media Templates",
          description: "Pre-designed templates for social media posts, stories, and ads.",
          url: "https://canva.com/social-media",
          iconName: "grid",
          categoryId: categoryMap["Social Media"],
          popular: false,
          isNew: false,
        },
        
        // New tools
        {
          name: "Excalidraw",
          description: "Virtual whiteboard for sketching hand-drawn like diagrams.",
          url: "https://excalidraw.com",
          iconName: "edit-3",
          categoryId: categoryMap["Design"],
          popular: false,
          isNew: true,
        },
        {
          name: "Descript",
          description: "All-in-one audio/video editing that works like a document editor.",
          url: "https://descript.com",
          iconName: "video",
          categoryId: categoryMap["Video Tools"],
          popular: false,
          isNew: true,
        },
        {
          name: "Claude",
          description: "AI assistant from Anthropic focused on helpfulness, harmlessness, and honesty.",
          url: "https://claude.ai",
          iconName: "message-circle",
          categoryId: categoryMap["AI Tools"],
          popular: false,
          isNew: true,
        },
        {
          name: "Otter.ai",
          description: "Voice meeting notes and real-time transcription for interviews and lectures.",
          url: "https://otter.ai",
          iconName: "mic",
          categoryId: categoryMap["Productivity"],
          popular: false,
          isNew: true,
        },
        {
          name: "Miro",
          description: "Online collaborative whiteboard platform for distributed teams.",
          url: "https://miro.com",
          iconName: "maximize",
          categoryId: categoryMap["Productivity"],
          popular: false,
          isNew: true,
        }
      ];
      
      // Insert tools
      const insertedTools = await db.insert(schema.tools)
        .values(toolsData)
        .returning({ id: schema.tools.id, name: schema.tools.name });
      
      console.log(`Inserted ${insertedTools.length} tools`);
    } else {
      console.log("Database already contains categories. Skipping category/tool seed.");
    }
    
    // Add admin user if it doesn't exist
    const existingAdminUser = await db.select().from(schema.users).where(eq(schema.users.username, "admin")).limit(1);
    
    if (existingAdminUser.length === 0) {
      console.log("Creating admin user...");
      
      const hashedPassword = await hashPassword("adminpassword");
      
      await db.insert(schema.users).values({
        username: "admin",
        password: hashedPassword,
        isAdmin: true,
      }).returning();
      
      console.log("Admin user created successfully");
    } else {
      console.log("Admin user already exists. Skipping.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
