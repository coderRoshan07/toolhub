import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";
import createMemoryStore from "memorystore";

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      isAdmin: boolean;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const MemoryStore = createMemoryStore(session);
  
  const sessionSettings: session.SessionOptions = {
    secret: "toolfinderapp-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
        const user = result[0];
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin || false
          });
        }
      } catch (error) {
        return done(error as Error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      const user = result[0];
      
      if (user) {
        done(null, {
          id: user.id,
          username: user.username,
          isAdmin: user.isAdmin || false
        });
      } else {
        done(new Error("User not found"));
      }
    } catch (error) {
      done(error);
    }
  });

  function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    return res.status(403).json({ message: "Admin access required" });
  }

  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      
      const result = await db.insert(users).values({
        username,
        password: hashedPassword,
        createdAt: new Date(),
        isAdmin: false // By default users are not admins
      }).returning();

      const newUser = result[0];

      // Log the user in
      req.login({
        id: newUser.id,
        username: newUser.username,
        isAdmin: newUser.isAdmin || false
      }, (err) => {
        if (err) return next(err);
        return res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          isAdmin: newUser.isAdmin || false
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req: Request, res: Response) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/user", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    return res.status(401).json({ message: "Not authenticated" });
  });

  return { isAdmin };
}
