// controllers/logController.js
import { getLogsByApiKey, getLogsByApiKeyAndUserId } from '../services/logsService.js';

export const fetchLogsByApiKey = async (req, res) => {
    const { apiKey } = req;

    try {
        const logs = await getLogsByApiKey(apiKey);
        res.json(logs);
    } catch (error) {
        console.error('Error retrieving logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const fetchLogsByApiKeyAndUser = async (req, res) => {
    const { apiKey, userId } = req;

    try {
        const logs = await getLogsByApiKeyAndUserId(apiKey, userId);
        res.json(logs);
    } catch (error) {
        console.error('Error retrieving logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const fetchLogsByApiKeyAndUserId = async (req, res) => {
    const { apiKey } = req;
    const userId = req.params.userId; // Récupérer l'ID utilisateur du paramètre

    try {
        const logs = await getLogsByApiKeyAndUserId(apiKey, userId);
        res.json(logs);
    } catch (error) {
        console.error('Error retrieving logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};