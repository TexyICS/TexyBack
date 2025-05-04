import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";  
import { findUserByEmail } from "../services/authService.js";
 

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" }); 
    }

    const accessToken = signToken(user);
    const { password: _, ...userWithoutPassword } = user;

    console.log("✅ Login successful:", {
      token: accessToken,
      user: userWithoutPassword
    });

    return res.status(200).json({
      token: accessToken, 
      user: userWithoutPassword
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(400).json({ 
      error: "Login failed"  
    });
  }
};

// export const validateToken = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ valid: false, error: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token); 

//     console.log("✅ Token valid for user:", decoded);

//     return res.status(200).json({
//       valid: true,
//       user: decoded
//     });

//   } catch (error) {
//     console.error("❌ Token validation failed:", error.message);
//     return res.status(401).json({ valid: false, error: "Invalid or expired token" });
//   }
// };