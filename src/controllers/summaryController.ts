import { Request, Response } from "express";
import db from "../config/database";

const aggregateTransactionsByType = async (req: Request, res: Response) => {
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
};

const aggregateTransactionsByCategory = async (req: Request, res: Response) => {
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
};

export { aggregateTransactionsByType, aggregateTransactionsByCategory };
