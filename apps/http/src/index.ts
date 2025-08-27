import express from "express";
import { prismaClient } from "@repo/db/client";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { email, password ,username } = req.body;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await prismaClient.user.create({
      data: { email, password , username }, 
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password , username } = req.body;

  try {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password || user.username !== username) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ message: "Signin successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error signing in" });
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

app.listen(process.env.HTTP_PORT!);