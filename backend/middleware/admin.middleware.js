import jwt from "jsonwebtoken";

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token not provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Token not valid" });
  }
};

export default adminMiddleware;
