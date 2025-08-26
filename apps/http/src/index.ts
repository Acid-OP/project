import express from "express";
import { prismaClient } from "@repo/db/client";
import dotenv from "dotenv";
dotenv.config()
const app = express();
app.use(express.json());

app.post("/user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prismaClient.user.create({
      data: { email, password },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prismaClient.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

console.log(process.env.HTTP_PORT);
app.listen(process.env.HTTP_PORT!);