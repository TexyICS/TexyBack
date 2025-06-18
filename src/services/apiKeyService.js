// services/apiKeyService.js
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer'; // Assurez-vous d'installer nodemailer
import crypto from 'crypto';
import prisma from '../lib/prisma.js'; // Assurez-vous que le chemin est correct
import dotenv from 'dotenv';
import validator from 'validator';

// Fonction pour générer une clé API sécurisée
export const generateApiKey2 = (phone, mail) => {
    const timestamp = Date.now(); // Obtient l'heure actuelle
    const rawKey = `${uuidv4()}-${phone}-${mail}-${timestamp}`; // Crée une clé brute

    // Hachage de la clé brute pour la sécuriser
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');

    return hash; // Retourne la clé hachée
};
export const generateApiKey = () => {
    return uuidv4(); // Génère un UUID valide
};
dotenv.config();

export const sendApiKey = async (phone, mail, apiKey) => {
    if (!validator.isEmail(mail)) {
        console.error("❌ Email invalide :", mail);
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const htmlContent = `
  <div style="background-color: #FFF5F5; padding: 2rem; font-family: sans-serif;">
    <div style="max-width: 600px; margin: auto; background-color: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center;">
      
      <div style="margin-bottom: 1rem;">
        <img src="https://png.pngtree.com/png-vector/20211023/ourmid/pngtree-salon-logo-png-image_4004444.png" alt="Logo" style="width: 60px; height: auto;" />
      </div>
      
      <h1 style="font-size: 1.5rem; color: #111; margin-bottom: 1rem;">🎉 Your API Key</h1>
      
      <p style="margin-bottom: 1rem;">Here is your personal API Key:</p>
      
      <div style="padding: 1rem; background-color: #FEE2E2; border: 1px solid #FCA5A5; border-radius: 8px; font-weight: bold; color: #B91C1C; display: inline-block;">
        ${apiKey}
      </div>
      
      <p style="margin-top: 1.5rem;">You can use this key to access the Texy API services securely.</p>
      
      <a href="" target="_blank" style="display: inline-block; margin-top: 2rem; background-color: #FF1F17; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 8px;">
        Go to Website
      </a>
    </div>
  </div>
`;


    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: mail,
            subject: 'Your Texy API Key',
            html: htmlContent,
        });
        console.log("✅ Email envoyé à", mail);
    } catch (error) {
        console.error("❌ Erreur d'envoi de l'email :", error.message);
    }
};

export const createApiKeyEntry = async (data) => {
    return await prisma.api_keys_app.create({
        data,
    });
};

export const deleteApiKeyEntry = async (keyId) => {
  await db.api_keys.delete({ where: { key_id: keyId } }); // adapt selon ton ORM ou query SQL
};


