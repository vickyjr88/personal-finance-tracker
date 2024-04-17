import { Request, Response } from "express";
import db from "../config/database";

const newGoal = (req: Request, res: Response) => {
  const { goalName, targetAmount, currentAmount, deadline } = req.body;
  const userId = req.body.userId;
  const date = new Date().toISOString();

  db.run(
    `INSERT INTO goals (userId, goalName, targetAmount, currentAmount, deadline) VALUES (?, ?, ?, ?, ?)`,
    [userId, goalName, targetAmount, currentAmount, deadline],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ id: this.lastID });
      }
    }
  );
};

const fetchGoals = (req: Request, res: Response) => {
  const userId = req.body.userId;

  db.all(`SELECT * FROM goals WHERE userId = ?`, [userId], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(rows);
    }
  });
};

export { newGoal, fetchGoals };
