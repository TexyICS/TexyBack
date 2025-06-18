// src/mqttClient.js
import mqtt from "mqtt";

const brokerUrl = "mqtt://broker.hivemq.com"; // ou ton broker local
const requestTopic = "texy/sms/request";
const responseTopic = "texy/sms/response";

const mqttClient = mqtt.connect(brokerUrl);

mqttClient.on("connect", () => {
  console.log("✅ MQTT connected");
  mqttClient.subscribe(responseTopic);
});

export { mqttClient, requestTopic, responseTopic };
