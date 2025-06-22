import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validation using zod
  const userSchema = z.object({
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

  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ error: validatedData.error.issues.map((err) => err.message) });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password before storing in db
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "Signup succeeded", newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error when registering user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    // Validate credentials
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ error: "Invalid credentials" });
    }

    // Create jwt token and store in cookies
    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_PASSWORD);
    res.cookie("jwt", token);

    return res.status(201).json({ message: "Login successful", user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not login" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error occurred during logout" });
  }
};
