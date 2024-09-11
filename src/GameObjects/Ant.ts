import Phaser from "phaser";
import { ICON_KEYS } from "../config";

export enum AntState {
  MARCHING_TO_USER_WAYPOINT = "MARCHING_TO_USER_WAYPOINT",
  MARCHING_TO_EXIT = "MARCHING_TO_EXIT",
  TRACING_OBSTACLE = "TRACING_OBSTACLE",
  ATTACKING = "ATTACKING",
}
export default class Ant extends Phaser.Physics.Arcade.Sprite {
  private _currentWaypointIndex: number = 0;
  private speed: number;
  private antState: AntState;
  private health: number;
  private attackRange: number = 50;
  private attackDamage: number = 10;

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
    speed: number = 100,
    health: number = 100,
    antState: AntState = AntState.MARCHING_TO_EXIT
  ) {
    super(scene, x, y, ICON_KEYS.ANT);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = speed;
    this.health = health;
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
      // case AntState.ATTACKING:
      //   this.handleAttacking(enemies);
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

  private handleAttacking(enemies: Ant[]) {
    const target = this.findClosestEnemy(enemies);
    if (target) {
      this.scene.physics.moveToObject(this, target, this.speed);
      if (this.isCloseToEnemy(target)) {
        this.attack(target);
      }
    }
  }

  private findClosestEnemy(enemies: Ant[]): Ant | null {
    let closestEnemy: Ant | null = null;
    let closestDistance = this.attackRange;
    enemies.forEach((enemy) => {
      const distance = Phaser.Math.Distance.Between(
        this.x,
        this.y,
        enemy.x,
        enemy.y
      );
      if (distance < closestDistance) {
        closestEnemy = enemy;
        closestDistance = distance;
      }
    });
    return closestEnemy;
  }

  private attack(target: Ant) {
    target.takeDamage(this.attackDamage);
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health <= 0) {
      this.destroy();
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

  private isCloseToEnemy(target: Ant): boolean {
    if (!this.body || !target.body) throw new Error("Ant body is null");
    return (
      Phaser.Math.Distance.Between(
        this.body.center.x,
        this.body.center.y,
        target.body.center.x,
        target.body.center.y
      ) < this.attackRange
    );
  }

  private handleMarchingToExit() {
    this.setVelocityY(this.speed);
    this.setVelocityX(0);
  }
}
