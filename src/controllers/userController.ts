import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/database";
import jwt from "jsonwebtoken";

const signup = (req: Request, res: Response) => {
  const { name, username, password } = req.body;

  bcrypt.hash(password, 10, (err: any, hash: string) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      db.run(
        `INSERT INTO users (name, username, password) VALUES (?, ?, ?)`,
        [name, username, hash],
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
};

const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  const SECRET_KEY: string = process.env.SECRET_KEY || "Secret key.";

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
};

const fetchUser = (req: Request, res: Response) => {
  const id = req.body.userId;
  db.get(`SELECT * FROM users WHERE id = ?`, [id], function (err, row) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
    console.log(row);
    res.status(200).json(row);
  });
};

export { signup, login, fetchUser };
