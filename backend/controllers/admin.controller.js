import { Admin } from "../models/admin.model.js";
import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validation using zod
  const adminSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "password must be atleast 6 char long" }),
  });

  const validatedData = adminSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ error: validatedData.error.issues.map((err) => err.message) });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash password before storing in db
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Signup succeeded", newAdmin });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error when registering admin" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(403).json({ error: "Admin not found" });
    }

    // Validate credentials
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // Create jwt token and store in cookies
    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN_PASSWORD, {
      expiresIn: "1d",
    });
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true for https only
      sameSite: "Strict",
    };
    res.cookie("jwt", token, cookieOptions);

    return res.status(200).json({ message: "Login successful", admin, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not login" });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ error: "Kindly login first" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error occurred during logout" });
  }
};

export const getAdminCourses = async (req, res) => {
  const adminId = req.adminId;

  try {
    const courses = await Course.find({ creatorId: adminId });
    res.status(200).json({ courses });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching course" });
  }
};

export const getAdminStats = async (req, res) => {
  const adminId = req.adminId;

  try {
    // Get all courses by this admin
    const courses = await Course.find({ creatorId: adminId });
    const totalCourses = courses.length;

    // Get all purchases for these courses
    const courseIds = courses.map(course => course._id);
    const purchases = await Purchase.find({ courseId: { $in: courseIds } });
    
    const totalCoursesSold = purchases.length;
    
    // Get unique students (users who bought any course from this admin)
    const uniqueStudentIds = [...new Set(purchases.map(purchase => purchase.userId.toString()))];
    const uniqueStudents = uniqueStudentIds.length;

    // Calculate total revenue
    let totalRevenue = 0;
    for (const purchase of purchases) {
      const course = courses.find(c => c._id.toString() === purchase.courseId.toString());
      if (course) {
        totalRevenue += course.price;
      }
    }

    res.status(200).json({
      totalCourses,
      totalCoursesSold,
      uniqueStudents,
      totalRevenue
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching admin stats" });
  }
};
