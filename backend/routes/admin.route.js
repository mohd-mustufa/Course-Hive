import express from "express";
import { signup, login, logout, getAdminStats, getAdminCourses } from "../controllers/admin.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/courses", adminMiddleware, getAdminCourses);
router.get("/stats", adminMiddleware, getAdminStats);

export default router;
