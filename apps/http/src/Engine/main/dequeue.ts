import { Engine } from "../trade/Engine";
const { createClient } = require("redis");
const client = createClient();

async function main() {
  console.log("🚀 Dequeue process starting...");
  await client.connect()
    .then(() => console.log("🔗 Connected to Redis in dequeue process"))
    .catch((err: any) => console.error("❌ Redis connection failed in dequeue:", err));

  const engine = new Engine();
  console.log("⚙️ Engine initialized");

  while (true) {
    const obj = await client.rPop("body");
    if (obj) {
      console.log("📦 Message dequeued:", obj);
      try {
        engine.process(JSON.parse(obj));
        console.log("✅ Message processed successfully");
      } catch (err) {
        console.error("❌ Error processing message:", err);
      }
    }
  }
}

main();
