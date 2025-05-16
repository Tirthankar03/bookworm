import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import job from "./lib/cron.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

job.start();

// Increase payload size limit to 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
