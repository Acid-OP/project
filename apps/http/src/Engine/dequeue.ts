import { Engine } from "./Engine";

const { createClient } = require("redis"); 

const client = createClient();

async function main() {
  await client.connect();
  const engine = new Engine();
  while (true) {
    const obj = await client.rPop("body");
    if (obj) {
        //   engine.process(JSON.parse(obj));
    }
  }
}

main();
