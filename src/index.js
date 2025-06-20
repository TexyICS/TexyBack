import express from 'express';
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js"; 
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';


const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT;
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TexyBack API",
      version: "1.0.0",
      description: "Documentation de l’API TexyBack",
    },
    servers: [
      {
        url: "http://localhost:" + PORT,
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Assure-toi que ce chemin est correct
};

// 👉 Tu dois d'abord générer ce document Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);
// Routes de documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/logs", logsRoutes);
app.use("/apiKey", apiKeyRoutes);


app.get("/", (req, res) => {
  res.send("Server is running!");
});


async function main() {
  app.listen(PORT, () => {
    console.info(`Server is running on http://localhost:${PORT}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });