import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.log(error.message);
    process.exit(1);
  }
};

export const requireDatabaseConnection = (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next();
  return res.status(503).json({
    success: false,
    message: "Database connection is unavailable. Check MONGO_URI and MongoDB Atlas network access.",
  });
};

export default connectDB;
