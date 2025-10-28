import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import expenditureRoutes from "./routes/expenditureRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import vacancyRoutes from "./routes/vacancyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/expenditure", expenditureRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/employee",employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/vacancies", vacancyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/login", loginRoutes);

// Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
