import { verifyToken } from "../utils/jwt.js"; 
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma.js";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";


export const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    const decoded = verifyToken(token); 
    console.log("✅ Token verified for user:", decoded);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
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