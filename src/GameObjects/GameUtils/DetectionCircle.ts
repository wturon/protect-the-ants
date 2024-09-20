import Phaser from "phaser";

export default class DetectionCircle extends Phaser.GameObjects.Arc {
  parent: Phaser.GameObjects.Sprite;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    radius: number,
    parent: Phaser.GameObjects.Sprite,
    color: number = 0xff0000,
    transparency: number = 0.1
  ) {
    super(scene, x, y, radius, 0, 360, false, color, transparency);
    this.parent = parent;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
}
