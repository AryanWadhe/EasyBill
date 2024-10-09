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
dotenv.config();

const app = express();

// Allow multiple origins
const allowedOrigins = [
  'https://quick-bill-client-a4bqx45nr-aryanwadhes-projects.vercel.app',
  'https://quick-bill-client.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send({ api: "your backend is running" });
});

app.use("/data", randomDataRouter);
app.use("/auth", authRouter);
app.use("/analytics", analyticsRouter);
app.use("/invoice", invoiceRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
