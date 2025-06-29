import express from "express";
import { generateAIContent } from "../controllers/ai.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/generate-content", adminMiddleware, generateAIContent);

export default router; 