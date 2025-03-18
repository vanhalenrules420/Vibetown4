import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../scenes/MainScene';
import { Client, Room } from 'colyseus.js';

interface GameProps {
  onPlayerMove?: (x: number, y: number) => void;
}

const Game: React.FC<GameProps> = ({ onPlayerMove }) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const clientRef = useRef<Client | null>(null);
  const roomRef = useRef<Room | null>(null);

  useEffect(() => {
    // Initialize Colyseus client
    const client = new Client('ws://localhost:3000');
    clientRef.current = client;

    // Connect to the room
    const connectToRoom = async () => {
      try {
        const room = await client.joinOrCreate<any>('vibe_town', {
          name: `Player ${Math.floor(Math.random() * 1000)}`,
        });
        
        // Store the room reference
        roomRef.current = room;

        // Initialize Phaser game
        if (!gameRef.current) {
          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            physics: {
              default: 'arcade',
              arcade: {
                gravity: { x: 0, y: 0 },
                debug: false,
              },
            },
            scene: [MainScene],
          };

          gameRef.current = new Phaser.Game(config);
          
          // Pass the room to the scene
          const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
          if (scene) {
            scene.setRoom(room);
            
            // Set up player move callback
            if (onPlayerMove) {
              scene.onPlayerMove = onPlayerMove;
            }
          }
        }
      } catch (error) {
        console.error('Could not connect to room:', error);
      }
    };

    connectToRoom();

    // Cleanup
    return () => {
      // Leave the room if connected
      if (roomRef.current) {
        roomRef.current.leave();
      }
      
      // Destroy the Phaser game
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      
      // Clear references
      clientRef.current = null;
      roomRef.current = null;
    };
  }, [onPlayerMove]);

  return <div id="game-container" style={{ width: '800px', height: '600px' }}></div>;
};

export default Game;
