// server.ts

import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

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

// Connect to SQLite database
const db: sqlite3.Database = new sqlite3.Database("database.db", (err) => {
  console.log("Connected to the database");
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY,
        userId INTEGER,
        amount REAL,
        category TEXT,
        type TEXT, -- 'income' or 'expense'
        date TEXT
    )`);

  db.run(`CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY,
        userId INTEGER,
        goalName TEXT,
        targetAmount REAL,
        currentAmount REAL DEFAULT 0,
        deadline TEXT
    )`);
});

// Middleware to verify JWT
const verifyToken = (req: Request, res: Response, next: any) => {
  const bearerToken = req.headers["authorization"];
  const token = bearerToken && bearerToken.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.body.userId = decoded.userId;
    next();
  });
};

// Routes
// User registration and login routes (from previous code)
app.post("/api/register", (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(req.body);
  console.log(username, password);

  bcrypt.hash(password, 10, (err: any, hash: string) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hash],
        (err) => {
          if (err) {
            console.error(err.message);
            res.status(400).json({ error: "Username already exists" });
          } else {
            res.status(201).json({ message: "User registered successfully" });
          }
        }
      );
    }
  });
});

app.post("/api/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE username = ?`,
    [username],
    (err: any, row: any) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (!row) {
        res.status(401).json({ error: "Invalid username or password" });
      } else {
        bcrypt.compare(password, row.password, (err, result) => {
          if (err || !result) {
            res.status(401).json({ error: "Invalid username or password" });
          } else {
            const token = jwt.sign({ userId: row.id }, SECRET_KEY);
            res.status(200).json({ token });
          }
        });
      }
    }
  );
});

// Add transaction route
app.post("/api/transactions", verifyToken, (req: Request, res: Response) => {
  const { amount, category, type } = req.body;
  const userId = req.body.userId;
  const date = new Date().toISOString();

  db.run(
    `INSERT INTO transactions (userId, amount, category, type, date) VALUES (?, ?, ?, ?, ?)`,
    [userId, amount, category, type, date],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
});

// Fetch transactions route
app.get("/api/transactions", verifyToken, (req: Request, res: Response) => {
  const userId = req.body.userId;

  db.all(
    `SELECT * FROM transactions WHERE userId = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(rows);
      }
    }
  );
});

// Fetch transaction summary
app.get(
  "/api/summary-by-type",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    // Query to aggregate transaction data for a specific user
    const sql = `
    SELECT type, 
           SUM(amount) AS totalAmount, 
           COUNT(*) AS count 
    FROM transactions 
    WHERE userId = ? 
    GROUP BY type;
  `;

    // Execute the query with the user ID parameter
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error("Error fetching aggregated data:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // Convert rows to aggregated data format
      const aggregatedData = rows.reduce((acc: any, row: any) => {
        acc[row.type] = {
          totalAmount: row.totalAmount,
          count: row.count,
        };
        return acc;
      }, {});

      // Send aggregated data as JSON response
      res.json(aggregatedData);
    });
  }
);

app.get(
  "/api/summary-by-category",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    // Query to aggregate transaction data for a specific user
    const sql = `
    SELECT category, 
           SUM(amount) AS totalAmount, 
           COUNT(*) AS count 
    FROM transactions 
    WHERE userId = ? 
    GROUP BY category;
  `;

    // Execute the query with the user ID parameter
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error("Error fetching aggregated data:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // Convert rows to aggregated data format
      const aggregatedData = rows.reduce((acc: any, row: any) => {
        acc[row.category] = {
          totalAmount: row.totalAmount,
          count: row.count,
        };
        return acc;
      }, {});

      // Send aggregated data as JSON response
      res.json(aggregatedData);
    });
  }
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
