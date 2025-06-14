import { verifyToken } from "../utils/jwt.js"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma.js";
import { findUserById } from "../services/authService.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";


export const verifyAuthToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    const decoded = verifyToken(token);
    console.log("✅ Token decoded:", decoded);
    // Vérifier que l'utilisateur existe toujours et est actif
    const user = await findUserById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(403).json({ error: "User not found or inactive" });
    }
    
    req.user = user; 
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({ 
      error: "API key required" 
    });
  }

  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const keyRecord = await prisma.api_keys.findFirst({
      where: {
        api_key: apiKey,
        is_active: true,
        OR: [
          { expires_at: null },
          { expires_at: { gt: new Date() } }
        ]
      },
      include: {
        users: {
          select: {
            user_id: true,
            username: true,
            email: true,
            is_active: true
          }
        }
      }
    });

    if (!keyRecord || !keyRecord.users || !keyRecord.users.is_active) {
      return res.status(403).json({ 
        error: "Invalid or expired API key" 
      });
    }

    req.apiKey = keyRecord;
    req.user = keyRecord.users;
    next();

  } catch (error) {
    console.error("API key verification error:", error);
    return res.status(500).json({ 
      error: "API key verification failed" 
    });
  }
};


export const extractUserIdFromToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        console.log("Authorization Header:", authHeader);
        // Vérifier la présence de l'en-tête
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Authorization header missing or malformed" });
        }

        const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer"

        // Vérifier et décoder le token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("✅ Token decoded:", decoded);
        // Rechercher l'utilisateur dans la base de données
        const user = await prisma.users.findUnique({
            where: { user_id: decoded.id },
        });
        console.log("User found:", user);
        if (!user || !user.is_active) {
            return res.status(403).json({ error: "Invalid or inactive user" });
        }

        // Attacher l’ID utilisateur à la requête pour les middlewares suivants
        req.userId = user.user_id;
        next();
        
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(403).json({ error: "Invalid token or user" });
    }
};