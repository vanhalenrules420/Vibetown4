import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private player?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private debugText?: Phaser.GameObjects.Text;
  
  // Callback for player movement
  public onPlayerMove?: (x: number, y: number) => void;

  constructor() {
    super('MainScene');
  }

  preload() {
    // Empty preload method
  }

  create() {
    // Empty create method
  }

  update() {
    // Empty update method
  }
}
