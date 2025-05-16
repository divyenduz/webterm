# @webterm/server

The server component for the Webterm project, providing backend terminal functionality via WebSockets and node-pty.

## Features

- WebSocket server for real-time terminal communication
- Pseudo-terminal (PTY) integration using node-pty
- Cross-platform support (detects and uses appropriate shell based on OS)
- Streams terminal output in real-time to connected clients

## Technology Stack

- Node.js (not Bun, due to compatibility issues)
- TypeScript
- ws (WebSocket library)
- node-pty for pseudo-terminal functionality

## Available Scripts

### Development Server

```bash
bun run dev
```

This runs the server using Node.js (not Bun) with the `--experimental-strip-types` flag to handle TypeScript without compilation.

### Linting

```bash
bun run lint
```

Runs ESLint to check for code quality issues

## WebSocket Server

The server starts a WebSocket server on port 5174 and spawns a PTY process using the appropriate shell:
- Windows: powershell.exe
- macOS/Linux: bash

## Node.js vs Bun

This server uses Node.js instead of Bun despite the project using Bun for package management. This is due to a known issue where Bun crashes when using node-pty: https://github.com/oven-sh/bun/issues/19688

## PTY Configuration

The pseudo-terminal is configured with:
- Terminal type: xterm-color
- Initial dimensions: 80x30
- Working directory: User's home directory
- Environment variables: Inherited from the process

## Usage

The server automatically handles terminal sessions for connected WebSocket clients, streaming terminal output to the client and receiving input commands from the client.