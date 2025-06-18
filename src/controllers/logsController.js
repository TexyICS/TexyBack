// controllers/logController.js
import { getLogsByApiKey, getLogsByApiKeyAndUserId } from '../services/logsService.js';
import prisma from "../lib/prisma.js";
import axios from 'axios';
import { mqttClient, requestTopic, responseTopic } from "../mqttClient.js";

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
    const user = req.user;

    if (!number || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone number and message are required"
      });
    }

    const apiKey = await prisma.api_keys_app.findFirst({
      where: {
        phone: user.phone,
        is_active: true,
      }
    });

    if (!apiKey) {
      return res.status(403).json({
        success: false,
        error: "No active API key found for user"
      });
    }

    const smsLog = await prisma.logs_message.create({
      data: {
        key_id: apiKey.key_id,
        phone_number: number,
        message: message,
        id_user: user.user_id,
        status: 'pending'
      }
    });

    const smsPayload = {
      number,
      message,
      log_id: smsLog.id,
      sender: user.user_id
    };

    mqttClient.publish(requestTopic, JSON.stringify(smsPayload));
    console.log("📤 MQTT message sent to ESP32");

    let responded = false;
    let timeout;

    const handleResponse = async (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString());
        console.log("📩 MQTT response received:", data);
        if (data.log_id == smsLog.id) {
          console.log("✅ Valid response received for log ID:", smsLog.id);
          mqttClient.removeListener("message", handleResponse);
          clearTimeout(timeout); // ✅ Prevent timeout after valid response

          const newStatus = data.status === "success" ? "success" : "error";

          await prisma.logs_message.update({
            where: { id: smsLog.id },
            data: { status: newStatus }
          });

          if (!responded) {
            responded = true;
            return res.status(200).json({
              success: data.status === "success",
              data: {
                log_id: smsLog.id,
                status: data.status
              }
            });
          }
        }
      } catch (e) {
        console.error("❌ Error parsing MQTT response:", e.message);
      }
    };

    mqttClient.on("message", handleResponse);

    // ⏱️ Timeout if ESP32 does not respond in time
    timeout = setTimeout(async () => {
      mqttClient.removeListener("message", handleResponse);

      if (!responded) {
        responded = true;

        await prisma.logs_message.update({
          where: { id: smsLog.id },
          data: { status: "error" }
        });

        console.warn("⏰ Timeout: ESP32 did not respond in time");
        return res.status(504).json({
          success: false,
          error: "ESP32 did not respond in time",
          log_id: smsLog.id
        });
      }
    }, 50000); // ⏱️ 10 seconds timeout

  } catch (error) {
    console.error("❌ SMS Controller error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

// Route to test if GSM module can send an SMS
export const testGSM = async (req, res) => {
  const testNumber = "+213782964272"; 
  const testMessage = "✅ Test GSM from backend";
  const logId = "test-" + Date.now();

  const payload = {
    number: testNumber,
    message: testMessage,
    log_id: logId,
    sender: "system"
  };

  mqttClient.publish("texy/sms/request", JSON.stringify(payload));
  console.log("📤 Test SMS request sent via MQTT:", payload);

  return res.status(200).json({
    success: true,
    message: "Test SMS command sent to ESP32",
    log_id: logId
  });
};


// Route to check GSM signal and registration status
export const checkGSMStatus = async (req, res) => {
  const logId = "status-" + Date.now();

  const payload = {
    command: "check_status",
    log_id: logId,
    sender: "system"
  };

  mqttClient.publish("texy/sms/request", JSON.stringify(payload));
  console.log("📤 GSM status check command sent via MQTT:", payload);

  return res.status(200).json({
    success: true,
    message: "GSM status command sent to ESP32",
    log_id: logId
  });
};




  