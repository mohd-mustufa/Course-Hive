import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      reuired: true,
    },
    url: {
      type: String,
      reuired: true,
    },
  },
  creatorId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

export const Course = mongoose.model("Course", courseSchema);
