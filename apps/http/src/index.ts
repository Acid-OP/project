import express from "express";
import { prismaClient } from '@repo/db/client';
import { createClient } from 'redis';
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST'],
  credentials: true
}));

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

// USER ENDPOINTS
app.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  
  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    const user = await prismaClient.user.create({
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

app.get("/api/candles/:symbol/:interval", async (req, res) => {
  const { symbol, interval } = req.params;
  
  // ✅ Fix 1: Properly type and validate query parameters
  const limit = typeof req.query.limit === 'string' ? req.query.limit : '100';
  const startTime = typeof req.query.startTime === 'string' ? req.query.startTime : undefined;
  const endTime = typeof req.query.endTime === 'string' ? req.query.endTime : undefined;
  
  // Validate interval
  const validIntervals = ['1m', '5m', '15m', '1h', '4h'];
  if (!validIntervals.includes(interval)) {
    return res.status(400).json({ error: "Invalid interval" });
  }
  
  const limitNum = Math.min(parseInt(limit) || 100, 1000);
  
  try {
    console.log(`🔍 Fetching candles for ${symbol.toUpperCase()} ${interval}`);
    
    // ✅ Fix 2: Properly type whereClause with Prisma types
    const whereClause: {
      symbol: string;
      interval: string;
      openTime?: {
        gte?: bigint;
        lte?: bigint;
      };
    } = {
      symbol: symbol.toUpperCase(),
      interval: interval
    };
    
    // Add date filtering if provided
    if (startTime || endTime) {
      whereClause.openTime = {};
      if (startTime) {
        whereClause.openTime.gte = BigInt(startTime);
      }
      if (endTime) {
        whereClause.openTime.lte = BigInt(endTime);
      }
    }
    
    const candles = await prismaClient.ohlcvCandle.findMany({
      where: whereClause,
      orderBy: { openTime: 'asc' }, // ✅ Fix 3: Correct order for charts
      take: limitNum
    });
    
    console.log(`📊 Found ${candles.length} candles in database`);
    
    if (candles.length === 0) {
      console.log(`⚠️ No candles found for ${symbol.toUpperCase()} ${interval}`);
      return res.json({ s: "no_data" });
    }
    
    // ✅ Fix 4: TradingView compatible response format
    res.set('Cache-Control', 'public, max-age=60');
    res.json({
      s: "ok",
      t: candles.map(c => Math.floor(Number(c.openTime) / 1000)), // Unix timestamps
      o: candles.map(c => parseFloat(c.open.toString())), // Open prices
      h: candles.map(c => parseFloat(c.high.toString())), // High prices  
      l: candles.map(c => parseFloat(c.low.toString())), // Low prices
      c: candles.map(c => parseFloat(c.close.toString())), // Close prices
      v: candles.map(c => parseFloat(c.volume.toString())) // Volume
    });
    
  } catch (err) {
    console.error('❌ Error fetching candles:', err);
    res.status(500).json({ s: "error", errmsg: "Database error" });
  }
});


// DEBUG ENDPOINT - Check what's in the database
app.get("/api/debug/candles", async (req, res) => {
  try {
    const symbols = await prismaClient.ohlcvCandle.findMany({
      select: { 
        symbol: true, 
        interval: true,
        openTime: true,
        open: true,
        high: true,
        low: true,
        close: true
      },
      take: 10,
      orderBy: { openTime: 'desc' }
    });
    
    res.json({
      message: "Recent candles from database",
      count: symbols.length,
      data: symbols
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching debug data" });
  }
});

// RECENT TRADES ENDPOINT
app.get("/api/trades", (req, res) => {
  res.json({
    trades: recentTrades,
    count: recentTrades.length
  });
});

const PORT = process.env.HTTP_PORT;
app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`);
});