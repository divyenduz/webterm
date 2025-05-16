import { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import "./App.css";

function App() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstanceRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1e1e1e",
        foreground: "#f0f0f0",
      },
      fontFamily: "monospace",
      fontSize: 14,
      lineHeight: 1.2,
      cursorStyle: "block",
      convertEol: true,
    });
    terminalInstanceRef.current = term;

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());

    if (terminalRef.current) {
      term.open(terminalRef.current);
      setTimeout(() => {
        fitAddon.fit();
        term.focus();
        setupWebSocket(term);
      }, 100);
    }

    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      term.dispose();
      if (wsRef.current) {
        wsRef.current.close();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const setupWebSocket = (term: Terminal) => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname || "localhost";
      const wsPort = 5174;
      const wsUrl = `${protocol}//${host}:${wsPort}`;

      console.log(`Connecting to WebSocket at ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connection established");
        setWsConnected(true);
        setError(null);
        ws.send(`\n`);
      };

      ws.onmessage = (event) => {
        term.write(event.data);
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("Failed to connect to terminal server");
        setWsConnected(false);
        term.write("\r\nError: Failed to connect to terminal server\r\n");
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setWsConnected(false);
        term.write("\r\nConnection closed\r\n");

        setTimeout(() => {
          if (terminalInstanceRef.current) {
            setupWebSocket(terminalInstanceRef.current);
          }
        }, 3000);
      };

      term.onData((data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      });

      if (terminalRef.current) {
        terminalRef.current.addEventListener("click", () => {
          term.focus();
        });
      }
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
      setError(`Failed to create WebSocket connection: ${err}`);
      term.write(`\r\nError: Failed to create WebSocket connection\r\n`);
    }
  };

  const handleTerminalClick = () => {
    if (terminalInstanceRef.current) {
      terminalInstanceRef.current.focus();
    }
  };

  return (
    <div className="terminal-container">
      <div
        ref={terminalRef}
        className="terminal"
        onClick={handleTerminalClick}
      />
      {error && <div className="error-message">{error}</div>}
      <div
        className="status-indicator"
        style={{ backgroundColor: wsConnected ? "#2ecc71" : "#e74c3c" }}
      >
        {wsConnected ? "Connected" : "Disconnected"}
      </div>
    </div>
  );
}

export default App;
