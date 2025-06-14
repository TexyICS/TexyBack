// routes/apiKeyRoutes.js
import express from 'express';
import { createApiKey } from '../controllers/apiKeyController.js';
import { checkUniqueApiKey } from '../middlewares/apiKeyMiddleware.js';
import { checkValidEmail } from '../middlewares/checkValidEmail.js';


const router = express.Router();

router.post('/', checkValidEmail,checkUniqueApiKey, createApiKey);

export default router;