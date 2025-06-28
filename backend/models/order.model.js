import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  userId: {
    type: String,
  },
  courseId: {
    type: String,
  },
  paymentId: {
    type: String,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
  },
});

export const Order = mongoose.model("Order", orderSchema);
