import prisma from "../lib/prisma.js";

export const getLogsByApiKey = async (apiKey) => {
    return await prisma.lOGS_MESSAGE.findMany({
        where: { keyId: apiKey },
    });
};

export const getLogsByApiKeyAndUserId = async (apiKey, userId) => {
    return await prisma.lOGS_MESSAGE.findMany({
        where: {
            keyId: apiKey,
            idUser: userId,
        },
    });
};