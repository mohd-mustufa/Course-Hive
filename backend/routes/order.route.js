import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import userMiddleware from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/", userMiddleware, createOrder);

export default router;
