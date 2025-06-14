// controllers/logController.js
import { getLogsByApiKey, getLogsByApiKeyAndUserId } from '../services/logsService.js';
import prisma from "../lib/prisma.js";
import axios from 'axios';

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

export const sendSMS = async (req, res) => {
    try {
      const { number, message } = req.body;
      const user = req.user; // From authMiddleware
  
      if (!number || !message) {
        return res.status(400).json({
          success: false,
          error: "Phone number and message are required"
        });
      }

      // Check for active API key
    const apiKey = await prisma.api_keys_app.findFirst({
        where: {
          phone: user.phone_number,
          is_active: true,
          OR: [
            { created_at: { not: null } } // You can adapt expiration logic if needed
          ]
        }
      });
  
      if (!apiKey) {
        return res.status(403).json({
          success: false,
          error: "No active API key found for user"
        });
      }
  
      const esp32Ip = process.env.ESP32_IP;
      const url = `http://${esp32Ip}/send-sms`;
  
      // Log SMS before sending
      const smsLog = await prisma.logs_message.create({
        data: {
          key_id: apiKey.key_id,
          phone_number: number,
          message: message,
          id_user: user.user_id,
          status: 'pending'
        }
      });
  
      try {
        const params = new URLSearchParams();
        params.append('number', number);
        params.append('message', message);
  
        const response = await axios.post(url, params, {
          timeout: 45000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
  
        console.log("ESP32 SMS response:", response.data);
  
        // Update log to 'sent'
        await prisma.logs_message.update({
          where: { id: smsLog.id },
          data: {
            status: 'success'
          }
        });
  
        console.log("✅ SMS sent successfully:", {
          logId: smsLog.id,
          number,
          status: 'sent'
        });
  
        return res.status(200).json({
          success: true,
          data: {
            log_id: smsLog.id,
            message_id: smsLog.id.toString(),
            status: 'sent'
          }
        });
  
      } catch (esp32Error) {
        // Keep status as 'pending'
        await prisma.logs_message.update({
          where: { id: smsLog.id },
          data: {
            status: 'error'
          }
        });
  
        console.error("❌ ESP32 SMS sending failed:", esp32Error.message);
  
        return res.status(500).json({
          success: false,
          error: esp32Error.response?.data || "Failed to send SMS via ESP32",
          log_id: smsLog.id
        });
      }
  
    } catch (error) {
      console.error("SMS Controller error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error"
      });
    }
};
  