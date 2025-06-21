import express from "express";
import {
  getUser,updateUserInfo,updatePassword
} from "../controllers/usersController.js";
import {verifyAuthToken} from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     description: Retourne les informations d'un utilisateur spécifique à partir de son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur à récupérer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   example: "123e4567-e89b-12d3-a456-426614174000"
 *                 email:
 *                   type: string
 *                   example: "user@example.com"
 *                 username:
 *                   type: string
 *                   example: "NomUtilisateur"
 *                 phone_number:
 *                   type: string
 *                   example: "+213555555555"
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", getUser);
router.post("/update-user", verifyAuthToken, updateUserInfo);
router.post("/update-password", verifyAuthToken, updatePassword);



export default router;
