import { verifyToken } from "../utils/jwt.js"; 

export const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ error: "Token required" });
  }

  try {
    const decoded = verifyToken(token); 
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
