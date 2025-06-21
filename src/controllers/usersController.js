import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"
const prisma = new PrismaClient();


export const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await prisma.users.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }


  
};


export const updateUserInfo = async (req, res) => {
  try {

    console.log("🔍 USER UPDATE INFO ", req.body);
    const {new_username, new_email, new_phone_number } = req.body;
    const user = req.user;

    console.log("🔍 USER GET BY TOKEN ", user);

    


   

    // Recherche de l'utilisateur
    const existingUser = await prisma.users.findFirst({
      where: {
       user_id: user.user_id // Utilisation de l'ID utilisateur du token
      }
    });

    if (!existingUser) {
      console.error("❌ User not found:", user.id);
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Mise à jour des champs spécifiés
    const updatedUser = await prisma.users.update({
      where: { user_id: existingUser.user_id },
      data: {
        username: new_username || undefined,
        email: new_email || undefined,
        phone_number: new_phone_number || undefined
      }
    });

    return res.status(200).json({
      success: true,
      message: "User information updated successfully",
      data: {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        email: updatedUser.email,
        phone_number: updatedUser.phone_number
      }
    });

  } catch (error) {
    console.error("❌ Error in updateUserInfo:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


export const updatePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = req.user; // injecté par `verifyAuthToken`

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        error: "Current and new passwords are required"
      });
    }



    // Trouver l'utilisateur dans la DB
    const existingUser = await prisma.users.findUnique({
      where: { user_id: user.user_id }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    // Comparer le mot de passe actuel
    const isMatch = await bcrypt.compare(current_password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect"
      });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Mettre à jour le mot de passe
    await prisma.users.update({
      where: { user_id: user.user_id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("❌ Error in updatePassword:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};


