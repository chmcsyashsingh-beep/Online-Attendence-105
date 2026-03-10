import express from "express";
import dotenv from "dotenv";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import { connectDB } from "./config/db.js";
import dns from "node:dns/promises";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fix DNS issues (sometimes needed for cloud MongoDB)
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/attendance", attendanceRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Attendance Server Running" });
});

// Redirect wrong spelling
app.get("/attendence", (_, res) => res.redirect("/attendance"));

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: /attendance`);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

startServer();