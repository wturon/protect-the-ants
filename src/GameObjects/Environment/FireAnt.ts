import Phaser from "phaser";
import { ICON_KEYS } from "../../config";
import Ant from "../Player/Ant";
import DetectionCircle from "../GameUtils/DetectionCircle";

export enum FireAntState {
  WAITING_FOR_TARGET = "WAITING_FOR_TARGET",
  TARGET_FOUND = "TARGET_FOUND",
  CRAWLING_TO_TARGET = "CRAWLING_TO_TARGET",
  TARGET_IN_LUNGE_RANGE = "TARGET_IN_LUNGE_RANGE",
  LUNGING_TO_TARGET = "LUNGING_TO_TARGET",
  TARGET_IN_ATTACK_RANGE = "TARGET_IN_ATTACK_RANGE",
  ATTACKING_TARGET = "ATTACKING_TARGET",
}
export default class FireAnt extends Phaser.Physics.Arcade.Sprite {
  private speed: number;
  private fireAntState: FireAntState;
  private health: number;
  private visionRange: number = 50;
  private attackDamage: number = 10;
  private detectionCircle: Phaser.GameObjects.Arc;
  private lungeCircle: Phaser.GameObjects.Arc;
  private attackCircle: Phaser.GameObjects.Arc;
  private currentTarget: Ant | null = null;
  private lastAttackTime: number = 0;

  getDetectionCircle(): Phaser.GameObjects.Arc {
    return this.detectionCircle;
  }

  getLungeCircle(): Phaser.GameObjects.Arc {
    return this.lungeCircle;
  }

  getAttackCircle(): Phaser.GameObjects.Arc {
    return this.attackCircle;
  }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    speed: number = 100,
    health: number = 100,
    fireAntState: FireAntState = FireAntState.WAITING_FOR_TARGET,
    visionRange: number = 50,
    attackDamage: number = 10
  ) {
    super(scene, x, y, ICON_KEYS.FIRE_ANT);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.speed = speed;
    this.health = health;
    this.fireAntState = fireAntState;
    this.visionRange = visionRange;
    this.attackDamage = attackDamage;
    this.detectionCircle = new DetectionCircle(
      scene,
      this.x,
      this.y,
      this.visionRange * 10,
      this
    );

    this.lungeCircle = new DetectionCircle(
      scene,
      this.x,
      this.y,
      this.visionRange * 2,
      this
    );

    this.attackCircle = new DetectionCircle(
      scene,
      this.x,
      this.y,
      this.visionRange,
      this
    );
  }

  /**
   * CONFIG
   */

  update() {
    this.detectionCircle.setPosition(this.x, this.y);
    this.attackCircle.setPosition(this.x, this.y);
    this.lungeCircle.setPosition(this.x, this.y);

    switch (this.fireAntState) {
      case FireAntState.WAITING_FOR_TARGET:
        // Do nothing
        break;
      case FireAntState.TARGET_FOUND:
        this.startCrawlingToTarget();
        break;
      case FireAntState.CRAWLING_TO_TARGET:
        this.crawlToTarget();
        break;
      case FireAntState.TARGET_IN_LUNGE_RANGE:
        this.startLungeAtTarget();
        break;
      case FireAntState.LUNGING_TO_TARGET:
        this.lungeAtTarget();
        break;
      case FireAntState.TARGET_IN_ATTACK_RANGE:
        this.startAttackAtTarget();
        break;
      case FireAntState.ATTACKING_TARGET:
        this.attackCurrentTarget();
        break;
    }
  }

  /**
   * ANT BODY
   */

  private startAttackAtTarget() {
    this.updateFireAntState(FireAntState.ATTACKING_TARGET);
  }

  private attackCurrentTarget() {
    const currentTime = this.scene.time.now;
    if (this.currentTarget && currentTime - this.lastAttackTime >= 1000) {
      this.lastAttackTime = currentTime;
      console.log("Attacking target");
      const killedTarget = this.currentTarget.receiveAttack(
        this.attackDamage,
        this
      );

      if (killedTarget) {
        this.currentTarget = null;
        this.updateFireAntState(FireAntState.WAITING_FOR_TARGET);
      } else {
        this.updateFireAntState(FireAntState.TARGET_FOUND);
      }
    }
  }

  private startLungeAtTarget() {
    this.updateFireAntState(FireAntState.LUNGING_TO_TARGET);
  }

  private lungeAtTarget() {
    if (!this.currentTarget) {
      throw new Error("Lunging to target but no target found");
    }
    this.lungeTowards(this.currentTarget, this.speed * 1.5);
    this.scene.time.delayedCall(500, this.checkLungeOutcome, [], this);
  }

  private checkLungeOutcome() {
    // If we are still lunging, that means the lunge missed, so we should reset the state.
    if (this.fireAntState === FireAntState.LUNGING_TO_TARGET) {
      if (this.currentTarget) {
        this.updateFireAntState(FireAntState.TARGET_FOUND);
      } else {
        this.updateFireAntState(FireAntState.WAITING_FOR_TARGET);
      }
    }
  }

  private startCrawlingToTarget() {
    this.updateFireAntState(FireAntState.CRAWLING_TO_TARGET);
  }

  private crawlToTarget() {
    if (!this.currentTarget) {
      throw new Error("Crawling to target but no target found");
    }
    this.scene.physics.moveToObject(this, this.currentTarget, this.speed);
  }

  private lungeTowards(target: Ant, speed: number) {
    this.scene.physics.moveToObject(this, target, speed);

    // Slow down the ant after 1 second (1000 ms)
    this.scene.time.delayedCall(
      250,
      () => {
        this.setVelocity(0, 0);
      },
      [],
      this
    );
  }

  /**
   * ANT SENSES
   */

  // This is the only function that sets the current target
  senseAntInVisionRange(target: Ant) {
    const cares = this.checkIfFireAntCares(target, FireAntState.TARGET_FOUND);
    if (cares) {
      this.currentTarget = target;
      this.updateFireAntState(FireAntState.TARGET_FOUND);
    }
  }

  senseAntInLungeRange(ant: Ant) {
    const cares = this.checkIfFireAntCares(
      ant,
      FireAntState.TARGET_IN_LUNGE_RANGE
    );

    if (cares) {
      this.updateFireAntState(FireAntState.TARGET_IN_LUNGE_RANGE);
    }
  }

  senseAntInAttackRange(ant: Ant) {
    const cares = this.checkIfFireAntCares(
      ant,
      FireAntState.TARGET_IN_ATTACK_RANGE
    );
    if (cares) {
      this.updateFireAntState(FireAntState.TARGET_IN_ATTACK_RANGE);
    }
  }

  private checkIfFireAntCares(ant: Ant, newState: FireAntState) {
    switch (newState) {
      case FireAntState.WAITING_FOR_TARGET:
        return true;
      case FireAntState.TARGET_FOUND:
        // If we don't have a current target, we care about this new target
        if (!this.currentTarget) {
          return true;
        }
        return false;
      case FireAntState.TARGET_IN_LUNGE_RANGE:
        // If the ant in the lunge range is our current target, we care about it
        if (this.currentTarget?.id === ant.id) {
          return true;
        }
        return false;
      case FireAntState.TARGET_IN_ATTACK_RANGE:
        // If the ant in the attack range is our current target, we care about it
        if (this.currentTarget === ant) {
          return true;
        }
        return false;
      default:
        // By default, we don't care about the target
        return false;
    }
  }
  /**
   * ANT STATE
   */

  updateFireAntState(newState: FireAntState) {
    const invalidTransitions: Record<FireAntState, FireAntState[]> = {
      WAITING_FOR_TARGET: [],
      TARGET_FOUND: [],
      CRAWLING_TO_TARGET: [FireAntState.TARGET_FOUND],
      TARGET_IN_LUNGE_RANGE: [],
      LUNGING_TO_TARGET: [FireAntState.TARGET_IN_LUNGE_RANGE],
      TARGET_IN_ATTACK_RANGE: [],
      ATTACKING_TARGET: [FireAntState.TARGET_IN_ATTACK_RANGE],
    };

    if (newState === this.fireAntState) {
      // console.warn("Redundant attempt to update game state", newState);
      return;
    }

    if (invalidTransitions[this.fireAntState].includes(newState)) {
      // console.warn(
      //   `Invalid transition attempt from ${this.fireAntState} to ${newState}`
      // );
      return;
    }

    this.fireAntState = newState;
    // console.log("Updating FireAnt state", newState);
    // this.scene.events.emit(CUSTOM_EVENTS.GAME_STATE_UPDATED, this.fireAntState);
  }
}
