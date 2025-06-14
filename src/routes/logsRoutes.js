import express from "express";
import { checkApiKey } from "../middlewares/apiKeyMiddleware.js";
import {verifyAuthToken,  extractUserIdFromToken} from "../middlewares/authMiddleware.js";
import { 
    fetchLogsByApiKey, 
    fetchLogsByApiKeyAndUser, 
    fetchLogsByApiKeyAndUserId,
    sendSMS
} from '../controllers/logsController.js';

const router = express.Router();

router.get('/apikey', checkApiKey, fetchLogsByApiKey); // Récupérer logs d'un API key
router.get('/user', checkApiKey, extractUserIdFromToken, fetchLogsByApiKeyAndUser); // Récupérer logs pour un utilisateur avec token
router.get('/apiKey/user/:userId', checkApiKey, fetchLogsByApiKeyAndUserId); // Récupérer logs pour un utilisateur avec ID
router.post("/send",checkApiKey,verifyAuthToken, sendSMS);
export default router;