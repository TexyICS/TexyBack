import express from 'express';
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import logsRoutes from "./routes/logsRoutes.js";
import apiKeyRoutes from "./routes/apiKeyRoutes.js"; 
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Current directory:", __dirname);
console.log("Current file:", __filename);
// Sert les fichiers statiques depuis /src/assets via /public
app.use('/public', express.static(path.join(__dirname, '/assets')));

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/logs", logsRoutes);
app.use("/apiKey", apiKeyRoutes);


app.get("/", (req, res) => {
  res.send("Server is running!");
});


async function main() {
  app.listen(PORT, () => {
    console.info("Server is running on http://localhost:${PORT}");
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