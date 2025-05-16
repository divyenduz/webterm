import { WebSocketServer } from "ws";
import * as pty from "node-pty";
import os from "os";

// https://bufferwall.com/posts/140289001cx61b/

const port = 5174;
// Create WebSocket server
const wss = new WebSocketServer({ port });

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
const stream = pty.spawn(shell, [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env,
});

let sshClientIsReady = true;

wss.on("connection", (ws, request) => {
  console.log("Client connected", request.url);
  // const urlParams = new URLSearchParams(request.url?.split("?")[1]);
  // const machineIp = urlParams.get("machine_ip");
  // invariant(machineIp, "Machine IP is required");

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
      stream.write(`source ~/.zshrc`);
    } catch (error) {
      console.log("Error", error);
    }
  });
});

console.log(`Web socket server running at http://localhost:${port}`);
