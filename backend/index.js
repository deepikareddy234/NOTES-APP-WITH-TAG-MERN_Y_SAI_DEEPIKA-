import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Load .env file variables
dotenv.config();

// Now use values from .env
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log("MONGO_URI =", MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

// Routes
import authRouter from "./routes/auth.route.js";
import noteRouter from "./routes/note.route.js";

app.use("/api/auth", authRouter);
app.use("/api/note", noteRouter);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
