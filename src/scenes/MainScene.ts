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
  }

  create() {
  }

  update() {
  }
}
