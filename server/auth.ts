
import { type Request, type Response, type NextFunction } from "express";
import { storage } from "./storage";

// Generate a random 12-character password
export function generateRandomPassword(length = 12): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Verify password (plain text comparison)
export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  return password === storedPassword;
}

// Simple session store (in production, use Redis or database)
interface Session {
  userId: number;
  username: string;
  createdAt: Date;
}

const sessions = new Map<string, Session>();

// Generate session token
export function generateSessionToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Create session
export function createSession(userId: number, username: string): string {
  const token = generateSessionToken();
  sessions.set(token, {
    userId,
    username,
    createdAt: new Date()
  });
  return token;
}

// Get session
export function getSession(token: string): Session | undefined {
  return sessions.get(token);
}

// Delete session
export function deleteSession(token: string): void {
  sessions.delete(token);
}

// Authentication middleware
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ message: "Invalid session" });
  }
  
  // Add user info to request
  (req as any).user = session;
  next();
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: Session;
    }
  }
}