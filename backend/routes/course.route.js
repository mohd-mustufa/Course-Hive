import express from "express";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  purchaseCourse,
} from "../controllers/course.controller.js";
import userMiddleware from "../middleware/user.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", getAllCourses);
router.post("/", adminMiddleware, createCourse);
router.get("/:courseId", getCourse);
router.put("/:courseId", adminMiddleware, updateCourse);
router.delete("/:courseId", adminMiddleware, deleteCourse);

router.post("/purchase", userMiddleware, purchaseCourse);

export default router;
