import express from "express";
import { login } from "../controllers/authController.js";
import { validateToken } from "../controllers/authController.js";

const router = express.Router();

router.post("/", login);
router.get("/validate", validateToken);

export default router;