import express from "express";
import { signup, login, logout } from "../controllers/user.controller.js";
import { purchases } from "../controllers/user.controller.js";
import userMiddleware from "../middleware/user.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/purchases", userMiddleware, purchases);

export default router;
