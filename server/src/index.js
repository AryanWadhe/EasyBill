import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import randomDataRouter from "./routes/random.route.js";
import authRouter from "./routes/auth.router.js";
import invoiceRouter from "./routes/invoice.router.js";
import analyticsRouter from "./routes/analytics.router.js";
import PDFDocument from "pdfkit-table";

const app = express();
dotenv.config();

// Define allowed origins based on the environment
const allowedOrigins = [
  "http://localhost:3000", // Local development frontend
  "https://quick-bill-client.vercel.app", // Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // Check if the incoming request's origin is in the allowed list
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow cookies and credentials
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to the database
connectDB();

// Define your routes
app.use("/data", randomDataRouter);
app.use("/auth", authRouter);
app.use("/analytics", analyticsRouter);
app.use("/invoice", invoiceRouter);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
