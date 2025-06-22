import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

  try {
    // Get image from request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { image } = req.files;
    if (!allowedMimeTypes.includes(image.mimetype)) {
      return res.status(400).json({
        error: "Invalid file format. Only png, jpg and jpeg allowed.",
      });
    }

    if (!title || !description || !price || !image) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    // Upload image to cloudinary
    const cloudinary_response = await cloudinary.uploader.upload(
      image.tempFilePath
    );
    if (!cloudinary_response || cloudinary_response.error) {
      return res
        .status(400)
        .json({ error: "Error uploading file to cloudinary" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloudinary_response.public_id,
        url: cloudinary_response.url,
      },
    };
    const course = await Course.create(courseData);
    res.json({
      message: "Course created succesfully",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating course" });
  }
};
