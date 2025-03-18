import Phaser from 'phaser';

// Define a custom interface for layer data to include the type property
interface CustomLayerData extends Phaser.Tilemaps.LayerData {
  type?: string;
}

export default class MainScene extends Phaser.Scene {
  private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private debugText?: Phaser.GameObjects.Text;
  private map?: Phaser.Tilemaps.Tilemap;
  
  // Callback for player movement
  public onPlayerMove?: (x: number, y: number) => void;

  constructor() {
    super('MainScene');
  }

  preload() {
    // Set the base URL to the assets directory
    this.load.setBaseURL(window.location.origin);
    
    // Load the tilemap and tileset
    this.load.tilemapTiledJSON('map', '/src/assets/maps/vibetown_fixed.tmj');
    this.load.image('tiles', '/src/assets/mattdalley.png');
    this.load.image('floor1', '/src/assets/mattdalley_f1.png');
    this.load.image('floor2', '/src/assets/mattdalley_f2.png');
    
    // Load player sprite (using a simple box for now)
    this.load.image('player', '/src/assets/mattdalley.png');
    
    // Load the tileset file directly
    this.load.text('tileset', '/src/assets/mattdalley2.tsx');
  }

  create() {
    // Create the tilemap
    this.map = this.make.tilemap({ key: 'map' });
    
    // Add the tileset
    const tileset = this.map.addTilesetImage('mattdalley', 'tiles');
    
    // Create the layers
    if (tileset) {
      // Create all tile layers
      for (const layerData of this.map.layers) {
        const customLayerData = layerData as CustomLayerData;
        if (customLayerData.type === 'tilelayer') {
          this.map.createLayer(layerData.name, tileset, 0, 0);
        }
      }
      
      // Add image layers manually
      this.add.image(0, 0, 'floor2').setOrigin(0, 0);
      this.add.image(0, 0, 'floor1').setOrigin(0, 0);
    }
    
    // Create the player
    this.player = this.physics.add.sprite(400, 300, 'player');
    if (this.player) {
      this.player.setDisplaySize(32, 32);
      this.player.setCollideWorldBounds(true);
    }
    
    // Set up camera to follow player
    if (this.player && this.map) {
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.startFollow(this.player);
    }
    
    // Set up keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Add debug text
    this.debugText = this.add.text(10, 10, 'Position: (0, 0)', { 
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    });
    if (this.debugText) {
      this.debugText.setScrollFactor(0);
    }
    
    // Add additional debug text to show if map loaded
    this.add.text(10, 40, 'Map loaded successfully!', { 
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 5, y: 5 }
    }).setScrollFactor(0);
  }

  update() {
    if (!this.player || !this.cursors) return;
    
    // Reset player velocity
    this.player.setVelocity(0);
    
    // Handle player movement
    const speed = 200;
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    }
    
    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    }
    
    // Update debug text
    if (this.debugText && this.player) {
      const x = Math.floor(this.player.x);
      const y = Math.floor(this.player.y);
      this.debugText.setText(`Position: (${x}, ${y})`);
    }
    
    // Call the onPlayerMove callback if it exists
    if (this.onPlayerMove && this.player) {
      this.onPlayerMove(this.player.x, this.player.y);
    }
  }
}
