import express from "express";
import {
  createCourseDetails,
  updateCourseDetails,
} from "../controllers/courseDetail.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// Admin routes for managing course details
router.post("/:courseId", adminMiddleware, createCourseDetails);
router.put("/:courseId", adminMiddleware, updateCourseDetails);

export default router; 