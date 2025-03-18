// This file will contain the server setup
// It will create an Express app, HTTP server, and Colyseus server

import http from 'http';
import express from 'express';
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { VibeTownRoom } from './room.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT || 3000);
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../public')));

// Create HTTP server
const server = http.createServer(app);

// Create Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

// Register room handlers
gameServer.define('vibe_town', VibeTownRoom);

// Start server
gameServer.listen(port);
console.log(`Colyseus server is running on http://localhost:${port}`);

export { app, server, gameServer };
