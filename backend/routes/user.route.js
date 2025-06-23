import express from "express";
import { signup, login, logout } from "../controllers/user.controller.js";
import { purchases } from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/purchases", authMiddleware, purchases);

export default router;
