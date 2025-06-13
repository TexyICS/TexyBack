import prisma from "../lib/prisma.js";

export const getLogsByApiKey = async (apiKey) => {
    return await prisma.logs_message.findMany({
        where: { key_id: apiKey },
    });
};

export const getLogsByApiKeyAndUserId = async (apiKey, userId) => {
    return await prisma.logs_message.findMany({
        where: {
            key_id: apiKey,
            id_user: userId,
        },
    });
};