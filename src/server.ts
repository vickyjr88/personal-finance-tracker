import express, { Application, Request, Response } from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import verifyToken from "./middleware/verifyToken";
import { fetchUser, login, signup } from "./controllers/userController";
import {
  fetchTransactions,
  newTransaction,
} from "./controllers/transactionController";
import {
  aggregateTransactionsByCategory,
  aggregateTransactionsByType,
} from "./controllers/summaryController";
import {
  deleteGoal,
  fetchGoal,
  fetchGoals,
  newGoal,
  topUpGoal,
} from "./controllers/goalsController";

// Load the .env file
dotenv.config();

const app: Application = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const SECRET_KEY: string = process.env.SECRET_KEY || "Secret key."; // Change this to a secure secret key

// app.use(bodyParser.json());
// Parse body if urlencoded or JSON
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(express.json({ limit: "50mb" }));

// set up morgan middleware
const morganMode = process.env.NODE_ENV === "production" ? "tiny" : "dev";
app.use(morgan(morganMode));
app.use(cookieParser());

// Routes

// User registration and login routes (from previous code)
app.post("/api/register", signup);
app.post("/api/login", login);

// Get user profile route
app.get("/api/users/:id", verifyToken, fetchUser);

// Add transaction route
app.post("/api/transactions", verifyToken, newTransaction);

// Fetch transactions route
app.get("/api/transactions", verifyToken, fetchTransactions);

// Add goal route
app.post("/api/goals", verifyToken, newGoal);

// Top up goal route
app.put("/api/goals", verifyToken, topUpGoal);

// Fetch goals route
app.get("/api/goals", verifyToken, fetchGoals);

// Fetch goal route
app.get("/api/goals/:id", verifyToken, fetchGoal);

// Delete goal route
app.delete("/api/goals/:id", verifyToken, deleteGoal);

// Fetch transaction summary
app.get("/api/summary-by-type", verifyToken, aggregateTransactionsByType);

app.get(
  "/api/summary-by-category",
  verifyToken,
  aggregateTransactionsByCategory
);

// Add more routes for goals management, income vs. expenses analysis, etc.

// Serve React frontend
app.use(express.static("frontend/build"));

app.get("*", (req: Request, res: Response) => {
  console.log("Base directory", __dirname);
  res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
