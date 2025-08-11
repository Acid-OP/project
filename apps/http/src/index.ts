import express from "express";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

// POST /user - create a new user
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

// GET /users - fetch all users
app.get("/users", async (req, res) => {
  try {
    const users = await prismaClient.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});
app.listen(process.env.HTTP_PORT);