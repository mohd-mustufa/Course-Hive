import { CourseDetail } from "../models/courseDetail.model.js";
import { Course } from "../models/course.model.js";


// Create course details
export const createCourseDetails = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { contentSections } = req.body;

  try {
    // Check if course exists and belongs to admin
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res.status(404).json({ error: "Course not found or unauthorized" });
    }

    // Check if course details already exist
    const existingDetails = await CourseDetail.findOne({ courseId });
    if (existingDetails) {
      return res.status(400).json({ error: "Course details already exist" });
    }

    // Validate content sections
    if (!contentSections || !Array.isArray(contentSections) || contentSections.length === 0) {
      return res.status(400).json({ error: "Content sections are required" });
    }

    // Add order to sections if not provided
    const sectionsWithOrder = contentSections.map((section, index) => ({
      ...section,
      order: section.order || index,
    }));

    const courseDetails = await CourseDetail.create({
      courseId,
      contentSections: sectionsWithOrder,
    });

    res.status(201).json({
      message: "Course details created successfully",
      courseDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating course details" });
  }
};


// Update course details
export const updateCourseDetails = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { contentSections } = req.body;

  try {
    // Check if course exists and belongs to admin
    const course = await Course.findOne({ _id: courseId, creatorId: adminId });
    if (!course) {
      return res.status(404).json({ error: "Course not found or unauthorized" });
    }

    // Find existing course details
    const existingDetails = await CourseDetail.findOne({ courseId });
    if (!existingDetails) {
      return res.status(404).json({ error: "Course details not found" });
    }

    // Validate content sections
    if (!contentSections || !Array.isArray(contentSections) || contentSections.length === 0) {
      return res.status(400).json({ error: "Content sections are required" });
    }

    // Add order to sections if not provided
    const sectionsWithOrder = contentSections.map((section, index) => ({
      ...section,
      order: section.order || index,
    }));

    // Update course details
    const updatedDetails = await CourseDetail.findOneAndUpdate(
      { courseId },
      { contentSections: sectionsWithOrder },
      { new: true }
    );

    res.status(200).json({
      message: "Course details updated successfully",
      courseDetails: updatedDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error updating course details" });
  }
};
