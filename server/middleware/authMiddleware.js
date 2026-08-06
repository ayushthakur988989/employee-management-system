import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET must be configured in production.");
  return "development-only-change-me";
};

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token) return res.status(401).json({ success: false, message: "Authentication is required." });

  try {
    req.user = jwt.verify(token, getJwtSecret());
    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

export default authMiddleware;
