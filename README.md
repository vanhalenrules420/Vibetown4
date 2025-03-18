# Vibe Town

A multiplayer virtual office space built with React, Phaser, and Colyseus.

## Current Progress

**Current Implementation: Up to Prompt 9**

This version of Vibe Town includes:

- Basic office environment with walkable areas
- Player movement using arrow keys
- Real-time multiplayer functionality with Colyseus
- Player position synchronization
- Simple collision detection

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
  - Phaser 3 (game engine)
  - PeerJS (for peer-to-peer communication)

- **Backend**:
  - Node.js
  - Express
  - Colyseus (multiplayer game server)

- **Development**:
  - Vite (build tool)
  - Vitest (testing framework)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vanhalenrules420/Vibetown4.git
   cd Vibetown4/vibetown
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. In a separate terminal, start the Colyseus server:
   ```bash
   npm run server
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Features

- **Virtual Office Space**: Navigate through a virtual office environment
- **Real-time Multiplayer**: See and interact with other users in real-time
- **Avatar Movement**: Control your avatar using arrow keys

## Project Structure

- `/src/components`: React components
- `/src/scenes`: Phaser game scenes
- `/src/server`: Colyseus server implementation
- `/src/assets`: Game assets (images, maps, etc.)
- `/src/utils`: Utility functions

## License

MIT
