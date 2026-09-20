import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
const port = process.env.TEST_PORT || "3100";
process.env.TEST_URL = `http://127.0.0.1:${port}`;
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    port,
  ],
  { stdio: ["ignore", "pipe", "pipe"], env: process.env },
);
let log = "";
server.stdout.on("data", (d) => {
  log += d;
});
server.stderr.on("data", (d) => {
  log += d;
});
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(log);
    try {
      const response = await fetch(process.env.TEST_URL);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {}
    await setTimeout(200);
  }
  if (!ready) throw new Error(`Server did not start: ${log}`);
  await import("./browser.mjs");
} catch (error) {
  console.error(log);
  throw error;
} finally {
  server.kill("SIGTERM");
}
