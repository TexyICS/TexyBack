import express from 'express';
import cors from "cors";
import { PrismaClient } from '@prisma/client';
import authRoutes from "./routes/authRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

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