import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./DB/db_connect.js";
import morgan from "morgan";
import { dirname } from "path";

// Routes imports
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import categoryRoutes from "./routes/categories.js";
import subcategoryRoutes from "./routes/subcategories.js";
import orderRoutes from "./routes/orders.js";
import bannerRoutes from "./routes/banners.js";
import blogRoutes from "./routes/blogs.js";
import colorRoutes from "./routes/colors.js";
// import sizeRoutes from './routes/sizes.js';
// import flowerRoutes from './routes/flowers.js';
// import tagRoutes from './routes/tags.js';
import diseaseRoutes from "./routes/diseases.js";
import healthTestRoutes from "./routes/healthTests.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import dashboardRoutes from "./routes/dashboard.js";
import homeRoutes from "./routes/home.js";
import herbsRoutes from "./routes/herb.js";
import consultWithDoctorRoutes from "./routes/consultWithDoctor.js";
import couponRoutes from "./routes/coupon.js";
import newsLetterRoutes from "./routes/newsLetter.js";
import consultVideoUrlRoutes from "./routes/consultVideoUrl.js"
import testRouters from "./routes/test.js"
import shiprocketRoutes from "./routes/shiprocket.js"

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware

const allowedOrigins = [
  // "https://api.manovaidya.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "https://manovaidya.com",
  "https://www.manovaidya.com",
  "https://admin.manovaidya.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// app.use(cors());
app.options("*", cors());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/colors", colorRoutes);
// app.use('/api/sizes', sizeRoutes);
// app.use('/api/flowers', flowerRoutes);
// app.use('/api/tags', tagRoutes);
app.use("/api/diseases", diseaseRoutes);
app.use("/api/health-tests", healthTestRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/herbs", herbsRoutes);
app.use("/api/consultation", consultWithDoctorRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/newsletter", newsLetterRoutes)
app.use("/api/url", consultVideoUrlRoutes);
app.use("/api/test", testRouters)
app.use("/api/shiprocket", shiprocketRoutes)

// Database connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     // app.listen(PORT, () => {
//     //   console.log(`Server running on port ${PORT}`);
//     // });
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });
connectDb(process.env.MONGODB_URI);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
