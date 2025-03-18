import React from 'react';

interface ChatIndicatorProps {
  inRange: boolean;
  x: number;
  y: number;
}

const ChatIndicator: React.FC<ChatIndicatorProps> = ({ inRange, x, y }) => {
  if (!inRange) return null;
  
  return (
    <div 
      style={{ 
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: '24px',
        height: '24px',
        background: 'rgba(0, 255, 0, 0.5)',
        borderRadius: '50%',
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none'
      }}
    />
  );
};

export default ChatIndicator;
