import Phaser from 'phaser';
import { Room } from 'colyseus.js';

interface PlayerState {
  x: number;
  y: number;
  name: string;
  isTalking: boolean;
}

export default class MainScene extends Phaser.Scene {
  private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private room?: Room;
  private otherPlayers: Map<string, Phaser.GameObjects.Rectangle> = new Map();
  private debugText?: Phaser.GameObjects.Text;
  
  // Callback for player movement
  public onPlayerMove?: (x: number, y: number) => void;

  constructor() {
    super('MainScene');
  }

  // Method to set the Colyseus room
  public setRoom(room: Room): void {
    this.room = room;
    
    // Set up room state change listeners
    this.room.state.players.onAdd((player: PlayerState, sessionId: string) => {
      // Create a new player sprite for other players
      if (sessionId !== this.room?.sessionId) {
        const otherPlayer = this.add.rectangle(
          player.x, 
          player.y, 
          32, 
          32, 
          0x00ff00
        );
        this.otherPlayers.set(sessionId, otherPlayer);
      }
    });

    this.room.state.players.onRemove((_player: PlayerState, sessionId: string) => {
      // Remove player sprite when they leave
      const otherPlayer = this.otherPlayers.get(sessionId);
      if (otherPlayer) {
        otherPlayer.destroy();
        this.otherPlayers.delete(sessionId);
      }
    });

    // Listen for player position updates
    this.room.state.players.onChange((player: PlayerState, sessionId: string) => {
      if (sessionId !== this.room?.sessionId) {
        const otherPlayer = this.otherPlayers.get(sessionId);
        if (otherPlayer) {
          otherPlayer.x = player.x;
          otherPlayer.y = player.y;
        }
      }
    });
  }

  preload() {
    // We'll generate the map dynamically
  }

  create() {
    // Generate a simple office map
    this.generateOfficeMap();
    
    // Create the player
    this.player = this.physics.add.sprite(400, 300, 'player');
    
    // If no player sprite is loaded, use a rectangle
    if (!this.textures.exists('player')) {
      this.player.destroy();
      
      // Create a rectangle and add physics to it
      const playerRect = this.add.rectangle(400, 300, 32, 32, 0xff0000);
      this.physics.add.existing(playerRect);
      
      // Cast to the correct type with a type assertion
      this.player = playerRect as unknown as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    }
    
    // Set up player physics
    if (this.player && this.player.body) {
      this.player.setCollideWorldBounds(true);
    }
    
    // Set up keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Set world bounds
    this.physics.world.setBounds(0, 0, 800, 600);
    
    // Add debug text
    this.debugText = this.add.text(16, 16, 'Use arrow keys to move', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    });
  }

  generateOfficeMap() {
    // Create a graphics object to draw our map
    const graphics = this.add.graphics();
    
    // Fill background with a dark color
    graphics.fillStyle(0x222222);
    graphics.fillRect(0, 0, 800, 600);
    
    // Draw floor (walkable areas)
    graphics.fillStyle(0x00AA00); // Green for walkable areas
    
    // Main walkable area
    graphics.fillRect(50, 50, 700, 500);
    
    // Draw walls and obstacles (non-walkable areas)
    graphics.fillStyle(0x888888); // Gray for walls
    
    // Outer walls
    graphics.fillRect(50, 50, 700, 20);  // Top
    graphics.fillRect(50, 530, 700, 20); // Bottom
    graphics.fillRect(50, 70, 20, 460);  // Left
    graphics.fillRect(730, 70, 20, 460); // Right
    
    // Draw some desks
    graphics.fillStyle(0x663300); // Brown for desks
    
    // Office desks
    for (let i = 0; i < 3; i++) {
      graphics.fillRect(150, 150 + i * 120, 120, 60);
      graphics.fillRect(530, 150 + i * 120, 120, 60);
    }
    
    // Draw some plants
    graphics.fillStyle(0x00FF00); // Bright green for plants
    graphics.fillCircle(100, 100, 15);
    graphics.fillCircle(700, 100, 15);
    graphics.fillCircle(100, 500, 15);
    graphics.fillCircle(700, 500, 15);
    
    // Convert the graphics to a texture
    graphics.generateTexture('map', 800, 600);
    
    // Add the map as a sprite
    this.add.sprite(400, 300, 'map');
    
    // Clean up the graphics object
    graphics.destroy();
  }

  update() {
    if (!this.player || !this.cursors) return;
    
    // Reset velocity
    this.player?.setVelocity(0);
    
    // Handle player movement
    const speed = 200;
    
    if (this.cursors?.left?.isDown) {
      this.player?.setVelocityX(-speed);
    } else if (this.cursors?.right?.isDown) {
      this.player?.setVelocityX(speed);
    }
    
    if (this.cursors?.up?.isDown) {
      this.player?.setVelocityY(-speed);
    } else if (this.cursors?.down?.isDown) {
      this.player?.setVelocityY(speed);
    }
    
    // Update debug text
    if (this.debugText && this.player) {
      this.debugText.setText(`X: ${Math.floor(this.player.x)}, Y: ${Math.floor(this.player.y)}`);
    }
    
    // Send position to server if player has moved and room is connected
    if (this.room && this.player && this.player.body && 
        (this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0)) {
      const position = {
        x: this.player.x,
        y: this.player.y
      };
      
      this.room.send('move', position);
      
      // Call the onPlayerMove callback if it exists
      if (this.onPlayerMove) {
        this.onPlayerMove(position.x, position.y);
      }
    }
  }
}
