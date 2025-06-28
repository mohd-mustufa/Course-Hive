import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const createOrder = async (req, res) => {
  const order = req.body;
  try {
    const orderInfo = await Order.create(order);
    const userId = orderInfo?.userId;
    const courseId = orderInfo?.courseId;
    res.status(201).json({ message: "Order Details: ", orderInfo });
    if (orderInfo) {
      await Purchase.create({ userId, courseId });
    }
  } catch (err) {
    console.log("Error creating order: ", err);
    res.status(401).json({ error: "Error while creating order" });
  }
};
