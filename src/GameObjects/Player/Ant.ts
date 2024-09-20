import Phaser from "phaser";
import { ICON_KEYS } from "../../config";
import FireAnt from "../Environment/FireAnt";
import DetectionCircle from "../GameUtils/DetectionCircle";

export enum AntState {
  MARCHING_TO_SAFE_ZONE = "MARCHING_TO_SAFE_ZONE",
  WAYPOINT_NOTICED = "WAYPOINT_NOTICED",
  MARCHING_TO_WAYPOINT = "MARCHING_TO_WAYPOINT",
  RECIEVING_ATTACK = "RECIEVING_ATTACK",
  RECIEVING_DAMAGE = "RECIEVING_DAMAGE",
  DYING = "DYING",
  DEAD = "DEAD",
  LOST = "LOST",
}
export default class Ant extends Phaser.Physics.Arcade.Sprite {
  private _currentWaypointIndex: number = 0;
  private speed: number;
  private antState: AntState;
  private health: number;
  private attackRange: number = 50;
  private attackDamage: number = 10;
  private _id: string;
  private isInvincible: boolean = false;
  private detectionCircle: DetectionCircle;

  getDetectionCircle(): DetectionCircle {
    return this.detectionCircle;
  }

  get id(): string {
    return this._id;
  }

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
    antState: AntState = AntState.MARCHING_TO_SAFE_ZONE,
    detectionCircleRadius: number = 50
  ) {
    super(scene, x, y, ICON_KEYS.ANT);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = speed;
    this.health = health;
    this.antState = antState;
    this._id = "ant-" + Math.random().toString(36).slice(2, 11);

    const opacity = this.antState === AntState.LOST ? 0.3 : 0;
    this.detectionCircle = new DetectionCircle(
      scene,
      x,
      y,
      detectionCircleRadius,
      this,
      0xadd8e6,
      opacity
    );
  }

  /**
   * CONFIG
   */

  // ACTIVE BEHAVIORS
  update(userWaypoints: Phaser.Math.Vector2[]) {
    this.detectionCircle.setPosition(this.x, this.y);
    if (this.antState === AntState.DEAD) {
      return; // Do nothing if the ant is dead
    }

    switch (this.antState) {
      case AntState.LOST:
        // No active behavior
        break;
      case AntState.MARCHING_TO_SAFE_ZONE:
        this.marchToSafeZone();
        this.checkForWaypoints(userWaypoints);
        break;
      case AntState.WAYPOINT_NOTICED:
        this.startMarchingToUserWaypoint();
        break;
      case AntState.MARCHING_TO_WAYPOINT:
        this.marchToWaypoint(userWaypoints);
        break;
      case AntState.RECIEVING_ATTACK:
        // No active behavior
        break;
      case AntState.RECIEVING_DAMAGE:
        // No active behavior
        break;
      case AntState.DYING:
        this.die();
        break;
    }
  }

  /**
   * ANT BODY
   */

  private die() {
    this.updateAntState(AntState.DEAD);
    this.destroy();
  }

  private startMarchingToUserWaypoint() {
    this.updateAntState(AntState.MARCHING_TO_WAYPOINT);
  }

  private marchToSafeZone() {
    this.setVelocityY(this.speed);
    this.setVelocityX(0);
  }

  private marchToWaypoint(userWaypoints: Phaser.Math.Vector2[]) {
    const targetWayPoint = userWaypoints[this.currentWaypointIndex];
    this.scene.physics.moveToObject(this, targetWayPoint, this.speed);
    if (this.hasReachedWaypoint(targetWayPoint)) {
      this.currentWaypointIndex += 1;
      if (this.currentWaypointIndex >= userWaypoints.length) {
        this.antState = AntState.MARCHING_TO_SAFE_ZONE;
      } else {
        this.antState = AntState.WAYPOINT_NOTICED;
      }
    }
  }

  private hasReachedWaypoint(targetWayPoint: Phaser.Math.Vector2): boolean {
    if (this.antState === AntState.DEAD) {
      return false;
    }

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

  /**
   * ANT SENSES / INTERACTIONS WITH ENVIRONMENT
   */

  receiveAttack(amount: number, attacker: FireAnt) {
    if (this.antState === AntState.DEAD) {
      return true;
    }

    if (!this.body) throw new Error("Ant body is null");
    this.updateAntState(AntState.RECIEVING_ATTACK);

    // For now we just automatically take damage
    this.updateAntState(AntState.RECIEVING_DAMAGE);
    const isDead = this.receiveDamage(amount, attacker);

    return isDead;
  }

  private receiveDamage(amount: number, attacker: FireAnt) {
    if (this.antState === AntState.DEAD) {
      return true;
    }

    this.health -= amount;
    console.log("Ant health", this.health);

    const isDead = this.health <= 0;
    if (isDead) {
      this.updateAntState(AntState.DYING);
      return isDead;
    }

    // Knock back the ant by applying a force in the opposite direction of the attack
    const direction = new Phaser.Math.Vector2(
      this.x - attacker.x,
      this.y - attacker.y
    ).normalize();
    const knockbackForce = amount * 20;
    this.setVelocity(
      direction.x * knockbackForce,
      direction.y * knockbackForce
    );

    // Apply drag to slow down the ant after knockback
    (this.body as Phaser.Physics.Arcade.Body).setDrag(750, 750);

    // Reset drag after a short duration to allow normal movement
    this.scene.time.delayedCall(500, () => {
      if (this.antState === AntState.DEAD) {
        return;
      }
      (this.body as Phaser.Physics.Arcade.Body).setDrag(0, 0);
      this.updateAntState(AntState.MARCHING_TO_SAFE_ZONE);
    });

    return isDead;
  }

  private checkForWaypoints(waypoints: Phaser.Math.Vector2[]) {
    if (this.currentWaypointIndex < waypoints.length) {
      this.updateAntState(AntState.WAYPOINT_NOTICED);
    }
  }

  becomeFound(ant: Ant) {
    if (this.antState !== AntState.LOST) {
      return;
    }

    (this.detectionCircle as Phaser.GameObjects.Arc).setAlpha(0);
    this.currentWaypointIndex = ant.currentWaypointIndex;
    this.scene.time.delayedCall(250, () => {
      this.updateAntState(AntState.MARCHING_TO_SAFE_ZONE);
    });
  }

  /**
   * ANT STATE
   */

  private updateAntState(newState: AntState) {
    const invalidTransitions: Record<AntState, AntState[]> = {
      MARCHING_TO_SAFE_ZONE: [],
      WAYPOINT_NOTICED: [],
      MARCHING_TO_WAYPOINT: [],
      RECIEVING_ATTACK: [],
      RECIEVING_DAMAGE: [AntState.MARCHING_TO_WAYPOINT],
      DYING: [AntState.MARCHING_TO_WAYPOINT],
      DEAD: [AntState.WAYPOINT_NOTICED],
      LOST: [],
    };

    if (newState === this.antState) {
      // console.warn("Redundant attempt to update game state", newState);
      return;
    }

    if (invalidTransitions[this.antState].includes(newState)) {
      // console.warn(
      //   `Invalid transition attempt from ${this.fireAntState} to ${newState}`
      // );
      return;
    }

    if (this.antState === AntState.DEAD) {
      console.log("Ant is dead, cannot update state");
      return;
    }

    this.antState = newState;
    console.log("Updating Ant state", newState);
    // console.log(Object.values(AntState));
    // this.scene.events.emit(CUSTOM_EVENTS.GAME_STATE_UPDATED, this.fireAntState);
  }
}
