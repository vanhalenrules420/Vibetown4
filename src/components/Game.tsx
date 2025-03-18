import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import MainScene from '../scenes/MainScene';

interface GameProps {
  onPlayerMove?: (x: number, y: number) => void;
}

const Game: React.FC<GameProps> = ({ onPlayerMove }) => {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
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
      
      // Set up player move callback
      const scene = gameRef.current.scene.getScene('MainScene') as MainScene;
      if (scene && onPlayerMove) {
        scene.onPlayerMove = onPlayerMove;
      }
    }

    // Cleanup
    return () => {
      // Destroy the Phaser game
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onPlayerMove]);

  return <div id="game-container" style={{ width: '800px', height: '600px' }}></div>;
};

export default Game;
