import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const signToken = (user) => {
  console.log("Signing token for user:", user.user_id);
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      userType: user.userType || "user",
    },
    JWT_SECRET
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
