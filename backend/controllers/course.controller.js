import { Course } from "../models/course.model.js";
import { CourseDetail } from "../models/courseDetail.model.js";
import { Purchase } from "../models/purchase.model.js";
import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error finding courses" });
  }
};

export const getCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Get course details if they exist
    const courseDetails = await CourseDetail.findOne({ courseId })
      .sort({ "contentSections.order": 1 });

    const response = {
      course,
      courseDetails: courseDetails || null,
    };

    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error getting course" });
  }
};

export const createCourse = async (req, res) => {
  const adminId = req.adminId;
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
      creatorId: adminId,
    };
    const course = await Course.create(courseData);
    res.status(201).json({
      message: "Course created succesfully",
      course,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error creating course" });
  }
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;

  try {
    const currentCourse = await Course.findById(courseId);
    if (!currentCourse) {
      return res.status(404).json({ error: "Course not found" });
    }
    const course = await Course.updateOne(
      { _id: courseId, creatorId: adminId },
      {
        title,
        description,
        price,
        image,
      }
    );
    res.status(200).json({ message: "Course updated succesfully", course });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error while updating course" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Also delete associated course details
    await CourseDetail.findOneAndDelete({ courseId });

    res.status(200).json({ message: "Course deleted successfully", course });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error while deleting course" });
  }
};

export const purchaseCourse = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.body;

  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if course is already purchased
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ error: "User has already purchased this course" });
    }

    // Create new purchase
    const newPurchase = new Purchase({ userId, courseId });
    await newPurchase.save();
    res.status(201).json({
      message: "Course purchased successfully",
      course,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unexpected error while buying course" });
  }
};

export const getClientSecret = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.body;

  try {
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if course is already purchased
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ error: "User has already purchased this course" });
    }

    // Stripe payment
    // Create a PaymentIntent to get clientSecret
    const amount = course.price * 100;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Payment Intent Created",
      course,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Unexpected error while Creating payment intent" });
  }
};
