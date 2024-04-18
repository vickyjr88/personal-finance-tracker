import { Request, Response } from "express";
import db from "../config/database";
import { createTopUpTransaction } from "../services/transactionService";

const newGoal = (req: Request, res: Response) => {
  const { goalName, targetAmount, currentAmount, deadline } = req.body;
  const userId = req.body.userId;
  const amount = Number(currentAmount) || 0;

  db.run(
    `INSERT INTO goals (userId, goalName, targetAmount, currentAmount, deadline) VALUES (?, ?, ?, ?, ?)`,
    [userId, goalName, targetAmount, amount, deadline],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        createTopUpTransaction(userId, amount, goalName);
        res.status(201).json({ id: this.lastID });
      }
    }
  );
};

const topUpGoal = (req: Request, res: Response) => {
  const { goalName, amount, id } = req.body;
  const userId = req.body.userId;
  const date = new Date().toISOString();

  db.run(
    `UPDATE goals SET currentAmount = ? WHERE id = ?`,
    [amount, id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        createTopUpTransaction(userId, Number(amount), goalName);
        res.status(201).json({ id: id });
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

const fetchGoal = (req: Request, res: Response) => {
  const id = req.params.id;

  db.all(`SELECT * FROM goals WHERE id = ?`, [id], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(rows[0]);
    }
  });
};

const deleteGoal = (req: Request, res: Response) => {
  const id = req.params.id;

  db.run(`DELETE FROM goals WHERE id = ?`, [id], (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.sendStatus(200);
    }
  });
};

export { newGoal, topUpGoal, fetchGoals, fetchGoal, deleteGoal };
