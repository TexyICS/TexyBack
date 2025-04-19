import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      userType: user.userType
    },
    JWT_SECRET,
    { expiresIn: "1y" }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
