import mongoose from "mongoose";

const courseDetailSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    unique: true,
  },
  contentSections: [
    {
      heading: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      order: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
courseDetailSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const CourseDetail = mongoose.model("CourseDetail", courseDetailSchema); 