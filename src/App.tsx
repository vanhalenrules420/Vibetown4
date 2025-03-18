import { useState, useEffect } from 'react';
import './App.css';
import Game from './components/Game';
import ChatIndicator from './components/ChatIndicator';

function App() {
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [showChat, setShowChat] = useState(false);

  // Handle player movement
  const handlePlayerMove = (x: number, y: number) => {
    setPlayerPosition({ x, y });
  };

  // Toggle chat indicator when pressing 'C'
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'c' || e.key === 'C') {
      setShowChat(!showChat);
    }
  };

  // Add event listener for key press
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showChat]);

  return (
    <div className="app-container">
      <header>
        <h1>vibe town, baby!</h1>
        <p>A multiplayer virtual office space</p>
      </header>
      
      <main>
        <Game onPlayerMove={handlePlayerMove} />
        <ChatIndicator 
          inRange={showChat} 
          x={playerPosition.x} 
          y={playerPosition.y} 
        />
      </main>
      
      <footer>
        <p>Press arrow keys to move | Press 'C' to toggle chat</p>
      </footer>
    </div>
  );
}

export default App;
