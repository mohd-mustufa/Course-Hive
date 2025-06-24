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

const router = express.Router();

router.get("/", getAllCourses);
router.post("/", createCourse);
router.get("/:courseId", getCourse);
router.put("/:courseId", updateCourse);
router.delete("/:courseId", deleteCourse);

router.post("/purchase", userMiddleware, purchaseCourse);

export default router;
