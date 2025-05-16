import { WebSocketServer } from "ws";
import * as pty from "node-pty";
import os from "os";

// https://bufferwall.com/posts/140289001cx61b/

const port = 5174;
const wss = new WebSocketServer({ port });

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

let sshClientIsReady = true;

wss.on("connection", (ws, request) => {
  console.log("Client connected", request.url);

  // Get cwd from URL parameters if available
  console.log("Request URL:", request.url);
  const urlParts = request.url?.split("?");
  console.log("URL parts:", urlParts);
  const urlParams = new URLSearchParams(urlParts?.[1] || "");
  console.log("URL params:", [...urlParams.entries()]);
  const cwd = urlParams.get("cwd") || process.env.HOME;
  console.log("Setting cwd to:", cwd);

  // Respawn the terminal with the updated cwd
  const stream = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: cwd,
    env: process.env,
  });

  stream.onData((data) => {
    ws.send(data.toString());
  });

  stream.onExit(() => {
    console.log("Stream exited");
  });

  ws.on("error", (e) => {
    console.log("Client error: ", e);
    sshClientIsReady = false;
  });

  ws.on("message", (data) => {
    try {
      if (!sshClientIsReady) {
        console.log("SSH client not ready");
        return;
      }
      if (!stream) {
        console.log("Pty stream not ready");
        return;
      }

      stream.write(data.toString());
    } catch (error) {
      console.log("Error", error);
    }
  });
});

console.log(`Web socket server running at http://localhost:${port}`);
