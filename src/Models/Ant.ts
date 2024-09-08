import Phaser from "phaser";

export default class Ant extends Phaser.Physics.Arcade.Sprite {
  private _waypointIndex: number = 0;

  get waypointIndex(): number {
    return this._waypointIndex;
  }

  set waypointIndex(value: number) {
    this._waypointIndex = value;
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ant");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVelocity(0, 0); // Ensure the ant starts with zero velocity
  }

  update(waypoints: Phaser.Math.Vector2[], isPaused: boolean) {
    if (isPaused) {
      this.setVelocity(0, 0); // Stop the ant if the game is paused
      return;
    }

    if (
      waypoints.length > 0 &&
      this.waypointIndex < waypoints.length &&
      this.body
    ) {
      const targetWayPoint = waypoints[this.waypointIndex];
      if (
        Phaser.Math.Distance.Between(
          this.body.center.x,
          this.body.center.y,
          targetWayPoint.x,
          targetWayPoint.y
        ) < 10
      ) {
        this.waypointIndex += 1;
        if (this.waypointIndex >= waypoints.length) {
          this.setVelocityY(200); // Adjusted for vertical movement
          this.setVelocityX(0);
        }
      } else {
        this.scene.physics.moveToObject(this, targetWayPoint, 200);
      }
    }

    // Check if the ant is completely still
    if (this.body && this.body.velocity.x === 0 && this.body.velocity.y === 0) {
      this.setVelocityY(150); // Set Y velocity to 150 if completely still
    }
  }
}
