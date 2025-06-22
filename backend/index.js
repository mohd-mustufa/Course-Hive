import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import courseRoute from './routes/course.route.js'

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

// Defining Routes
app.use('/api/v1/course', courseRoute)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
