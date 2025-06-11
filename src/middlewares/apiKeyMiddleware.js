import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const checkApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    console.log(apiKey)
    try {
        const keyExists = await prisma.apiKeysApp.findUnique({
            where: { keyId: apiKey }
        });

        if (!keyExists || !keyExists.isActive) { // Utiliser isActive
            return res.status(403).json({ message: 'Invalid or inactive API key' });
        }

        req.apiKey = apiKey; 
        next();
    } catch (error) {
        console.error('Error checking API key:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};