import express from "express";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  purchaseCourse,
  getClientSecret,
} from "../controllers/course.controller.js";
import userMiddleware from "../middleware/user.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", getAllCourses);
router.post("/", adminMiddleware, createCourse);
router.get("/:courseId", getCourse);
router.put("/:courseId", adminMiddleware, updateCourse);
router.delete("/:courseId", adminMiddleware, deleteCourse);

// purchase routes
router.post("/purchase", userMiddleware, purchaseCourse);
router.post("/purchase/client-secret", userMiddleware, getClientSecret);

export default router;
