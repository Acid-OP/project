import express from "express";
import { supabaseDb, timescaleDb } from '@repo/db';
import { createClient } from 'redis';
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
const redis = createClient();

redis.connect().then(() => {
  console.log('✅ HTTP server connected to Redis');
}).catch((error) => {
  console.error('❌ Redis connection failed:', error);
});

let recentTrades: any[] = [];

redis.subscribe('trades', (message) => {
  const trade = JSON.parse(message);
  recentTrades.unshift(trade);
  recentTrades = recentTrades.slice(0, 50);
});

app.get('/test/trades', (req, res) => {
  const symbolFilter = req.query.symbol as string;
  
  let trades = recentTrades;
  if (symbolFilter) {
    trades = recentTrades.filter(t => t.symbol.toLowerCase().includes(symbolFilter.toLowerCase()));
  }

  res.json({
    status: 'connected',
    totalTrades: recentTrades.length,
    filteredTrades: trades.length,
    latestTrades: trades.slice(0, 10),
    symbols: [...new Set(recentTrades.map(t => t.symbol))],
    lastUpdate: recentTrades[0]?.ts ? new Date(recentTrades[0].ts).toISOString() : null
  });
});

app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await supabaseDb.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await supabaseDb.user.create({
      data: { email, password, username }, 
    });

    res.json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const user = await supabaseDb.user.findUnique({
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
    const users = await supabaseDb.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

const PORT = process.env.HTTP_PORT!;
app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`);
});