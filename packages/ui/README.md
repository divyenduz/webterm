# @webterm/ui

The UI component for the Webterm project, built with React, TypeScript, and Xterm.js.

## Features

- Interactive terminal UI using Xterm.js
- WebSocket client for real-time communication with terminal server
- Automatic terminal resizing with the FitAddon
- Clickable web links in the terminal via WebLinksAddon
- Connection status indicator

## Technology Stack

- React 19
- TypeScript
- Xterm.js for terminal emulation
- Vite as the build tool and development server

## Available Scripts

### Development Server

```bash
bun run dev
```

Runs the app in development mode at http://localhost:5173

### Linting

```bash
bun run lint
```

Runs ESLint to check for code quality issues

## WebSocket Connection

The UI connects to the terminal server via WebSocket at port 5174. The connection is automatically established when the terminal component mounts and will attempt to reconnect if the connection is lost.

## Terminal Configuration

The terminal is configured with:
- Cursor blinking
- Dark theme (background: #1e1e1e, foreground: #f0f0f0)
- Monospace font at 14px size
- Block cursor style
- Line height of 1.2

## Usage

The terminal UI will automatically connect to the server when loaded. All keyboard input is sent to the server via WebSocket, and terminal output from the server is displayed in real-time.