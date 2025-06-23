import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// port
const port = process.env.PORT || 3000;

// Connect to DB
const DB_URI = process.env.MONGO_URI;
try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// Cloudinary configs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Defining Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
