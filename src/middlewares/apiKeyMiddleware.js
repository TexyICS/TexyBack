import prisma from "../lib/prisma.js"; // Assurez-vous que le chemin est correct

export const checkApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    console.log(apiKey)
    try {
        const keyExists = await prisma.api_keys_app.findUnique({
            where: { key_id: apiKey }
        });
        console.log(keyExists)
        if (!keyExists || !keyExists.is_active) { // Utiliser isActive
            return res.status(403).json({ message: 'Invalid or inactive API key' });
        }

        req.apiKey = apiKey; 
        next();
    } catch (error) {
        console.error('Error checking API key:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};