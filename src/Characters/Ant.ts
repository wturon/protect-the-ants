import Phaser from "phaser";

enum AntState {
  MARCHING_TO_USER_WAYPOINT = "MARCHING_TO_USER_WAYPOINT",
  MARCHING_TO_EXIT = "MARCHING_TO_EXIT",
  TRACING_OBSTACLE = "TRACING_OBSTACLE",
}
export default class Ant extends Phaser.Physics.Arcade.Sprite {
  private _currentWaypointIndex: number = 0;
  private speed: number;
  private antState: AntState;

  get currentWaypointIndex(): number {
    return this._currentWaypointIndex;
  }

  set currentWaypointIndex(value: number) {
    this._currentWaypointIndex = value;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    speed: number,
    antState: AntState = AntState.MARCHING_TO_EXIT
  ) {
    super(scene, x, y, "ant");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = speed;
    this.antState = antState;
  }

  update(userWaypoints: Phaser.Math.Vector2[]) {
    switch (this.antState) {
      case AntState.MARCHING_TO_USER_WAYPOINT:
        this.handleMarchingToUserWaypoint(userWaypoints);
        break;
      case AntState.MARCHING_TO_EXIT:
        this.handleMarchingToExit();
        break;
      // case AntState.TRACING_OBSTACLE:
      //   this.handleTracingObstacle();
      //   break;
    }

    if (this.shouldMoveToAWaypoint(userWaypoints)) {
      this.antState = AntState.MARCHING_TO_USER_WAYPOINT;
    }
    if (this.shouldMoveToExit(userWaypoints)) {
      this.antState = AntState.MARCHING_TO_EXIT;
    }
  }

  private handleMarchingToUserWaypoint(userWaypoints: Phaser.Math.Vector2[]) {
    const targetWayPoint = userWaypoints[this.currentWaypointIndex];
    this.scene.physics.moveToObject(this, targetWayPoint, this.speed);
    if (this.isCloseToWaypoint(targetWayPoint)) {
      this.currentWaypointIndex += 1;
    }
  }

  private shouldMoveToExit(userWaypoints: Phaser.Math.Vector2[]): boolean {
    return this.currentWaypointIndex >= userWaypoints.length;
  }

  private shouldMoveToAWaypoint(userWaypoints: Phaser.Math.Vector2[]): boolean {
    return (
      userWaypoints.length > 0 &&
      this.currentWaypointIndex < userWaypoints.length
    );
  }

  private isCloseToWaypoint(targetWayPoint: Phaser.Math.Vector2): boolean {
    if (!this.body) throw new Error("Ant body is null");
    return (
      Phaser.Math.Distance.Between(
        this.body.center.x,
        this.body.center.y,
        targetWayPoint.x,
        targetWayPoint.y
      ) < 10
    );
  }

  private handleMarchingToExit() {
    this.setVelocityY(this.speed);
    this.setVelocityX(0);
  }

  // private handleTracingObstacle() {
  //   // Implement obstacle tracing logic here
  //   // For now, we'll just set the ant to move in a random direction
  //   const randomAngle = Phaser.Math.Between(0, 360);
  //   this.scene.physics.velocityFromAngle(
  //     randomAngle,
  //     this.speed,
  //     this.body.velocity
  //   );

  //   // After tracing for a while, switch back to marching to the next waypoint
  //   // This is a placeholder; you should implement proper obstacle tracing logic
  //   setTimeout(() => {
  //     this.state = AntState.MARCHING_TO_USER_WAYPOINT;
  //   }, 1000);
  // }
}
