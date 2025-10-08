const { createClient } = require("redis"); 

const client = createClient();

async function main() {
  await client.connect();

  while (true) {
    const obj = await client.rPop("body");
    if (obj) {
      console.log("Received at engine:", obj);
    }
  }
}

main();
