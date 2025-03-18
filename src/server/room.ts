// This file will contain the VibeTownRoom implementation
// It will define the room, player state, and message handlers

import { Room, Client } from 'colyseus';
import { Schema, type, MapSchema } from '@colyseus/schema';

// Player state schema
class PlayerState extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("string") name: string = "";
  @type("boolean") isTalking: boolean = false;
}

// Room state schema
class VibeTownState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
}

export class VibeTownRoom extends Room<VibeTownState> {
  maxClients = 16;

  onCreate(options: any) {
    console.log("VibeTown room created!", options);
    
    this.setState(new VibeTownState());

    // Register message handlers
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.x = data.x;
        player.y = data.y;
        console.log(`Player ${player.name} moved to (${player.x}, ${player.y})`);
      }
    });

    this.onMessage("talk", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.isTalking = data.isTalking;
        console.log(`Player ${player.name} is ${player.isTalking ? "talking" : "not talking"}`);
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(`Player ${options.name} joined!`);
    
    // Create a new player state
    const player = new PlayerState();
    player.x = Math.floor(Math.random() * 400);
    player.y = Math.floor(Math.random() * 300);
    player.name = options.name;
    
    // Add the player to the room state
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client) {
    console.log(`Player ${this.state.players.get(client.sessionId)?.name} left!`);
    
    // Remove the player from the room state
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("Room disposed");
  }
}
