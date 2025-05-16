# Webterm

A web-based terminal application built with React, TypeScript, and Xterm.js. The project consists of a UI package (using Vite and React) and a server package (using WebSockets and Node.js).

## Project Structure

```
/
├── packages/
│   ├── ui/        # React frontend with Xterm.js terminal
│   └── server/    # Node.js WebSocket server with node-pty
```

## Getting Started

### Prerequisites

- Node.js
- Bun (for package management and UI development)

### Installation

```bash
bun install
```

### Running the Application

To run both the UI and server concurrently:

```bash
bun run dev
```

This will start:
- UI server at http://localhost:5173 (Vite dev server)
- WebSocket server at ws://localhost:5174

## Individual Package Commands

### UI Package

```bash
bun run --filter '@webterm/ui' dev
```

### Server Package

```bash
bun run --filter '@webterm/server' dev
```

## Note on Server Runtime

The server is running with Node.js and not Bun due to a known issue with Bun causing crashes when using node-pty. This is related to an open issue: https://github.com/oven-sh/bun/issues/19688

## Features

- Interactive web-based terminal
- WebSocket-based real-time communication
- Cross-platform support (Windows, macOS, Linux)
- Automatic terminal resizing
- Connection status indicator

## License

[MIT](LICENSE)