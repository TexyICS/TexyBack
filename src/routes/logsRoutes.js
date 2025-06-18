import express from "express";
import { checkApiKey } from "../middlewares/apiKeyMiddleware.js";
import { verifyAuthToken, extractUserIdFromToken } from "../middlewares/authMiddleware.js";
import {
  checkGSMStatus,
  fetchLogsByApiKey,
  fetchLogsByApiKeyAndUser,
  fetchLogsByApiKeyAndUserId,
  sendSMS,
  testGSM
} from '../controllers/logsController.js';

const router = express.Router();

/**
 * @swagger
 * /logs/apikey:
 *   get:
 *     summary: Récupérer les logs par API Key
 *     description: Récupère tous les logs liés à une API key spécifique.
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: La clé API de l'application
 *     responses:
 *       200:
 *         description: Liste des logs récupérés
 *       401:
 *         description: Clé API invalide ou manquante
 */
router.get('/apikey', checkApiKey, fetchLogsByApiKey);

/**
 * @swagger
 * /logs/user:
 *   get:
 *     summary: Récupérer les logs d'un utilisateur via token
 *     description: Récupère les logs associés à l'utilisateur authentifié avec l'API key et le token.
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Clé API de l'application
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT commençant par "Bearer "
 *     responses:
 *       200:
 *         description: Liste des logs de l'utilisateur
 *       401:
 *         description: Clé API ou token invalide
 */
router.get('/user', checkApiKey, extractUserIdFromToken, fetchLogsByApiKeyAndUser);

/**
 * @swagger
 * /logs/apiKey/user/{userId}:
 *   get:
 *     summary: Récupérer les logs d'un utilisateur par ID
 *     description: Récupère les logs d'un utilisateur spécifique en fonction de son ID.
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Clé API de l'application
 *     responses:
 *       200:
 *         description: Liste des logs de l'utilisateur par ID
 *       401:
 *         description: Clé API invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/apiKey/user/:userId', checkApiKey, fetchLogsByApiKeyAndUserId);

/**
 * @swagger
 * /logs/send:
 *   post:
 *     summary: Envoyer un SMS
 *     description: Envoie un message SMS à un utilisateur.
 *     tags:
 *       - Logs
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Clé API
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone_number
 *               - message
 *             properties:
 *               phone_number:
 *                 type: string
 *                 example: "+213555411700"
 *               message:
 *                 type: string
 *                 example: "Bonjour, votre code est 1234."
 *     responses:
 *       200:
 *         description: SMS envoyé avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Authentification échouée
 *       500:
 *         description: Erreur serveur
 */
router.post("/send", checkApiKey, verifyAuthToken, sendSMS);


router.post("/test-gsm", testGSM);
router.post("/check-gsm", checkGSMStatus);


export default router;
