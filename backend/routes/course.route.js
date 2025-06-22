import express from "express";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router.get("/", getAllCourses);
router.post("/", createCourse);
router.get("/:courseId", getCourse);
router.put("/:courseId", updateCourse);
router.delete("/:courseId", deleteCourse);

export default router;
