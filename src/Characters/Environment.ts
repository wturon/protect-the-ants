import Phaser from "phaser";
import { Level, LEVELS } from "../Services/levels.service";

class Environment {
  private scene: Phaser.Scene;
  private obstacles: Phaser.GameObjects.Rectangle[] = [];
  private safezones: Phaser.GameObjects.Rectangle[] = [];
  private levelConfig: Level;
  private currentLevel: number;
  private waypoints: Phaser.Math.Vector2[] = [];
  private ground!: Phaser.GameObjects.Rectangle;
  private isGameplayInputActive: boolean;
  constructor(
    scene: Phaser.Scene,
    currentLevel: number,
    isGameplayInputActive: boolean
  ) {
    this.scene = scene;
    this.levelConfig = LEVELS[currentLevel];
    this.currentLevel = currentLevel;
    this.isGameplayInputActive = isGameplayInputActive;
  }

  createGround() {
    if (this.ground) {
      return;
    }
    this.ground = this.scene.add
      .rectangle(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        this.scene.scale.width,
        this.scene.scale.height,
        0xffffff,
        0 // Make it invisible
      )
      .setInteractive();

    this.ground.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      console.log(
        "pointerdown, attempting to add waypoint, isGameplayInputActive:",
        this.isGameplayInputActive
      );
      if (this.isGameplayInputActive) {
        this.addWaypoint(pointer);
      }
    });
  }

  getGround() {
    if (!this.ground) {
      this.createGround();
    }
    return this.ground;
  }

  createObstacles() {
    this.levelConfig.obstacles.forEach((obstacleConfig) => {
      const newObstacle = this.scene.add.rectangle(
        obstacleConfig.x,
        obstacleConfig.y,
        obstacleConfig.width,
        obstacleConfig.height,
        0x000000
      );
      this.scene.physics.add.existing(newObstacle, true);
      this.obstacles.push(newObstacle);
    });
  }

  getObstacles() {
    return this.obstacles;
  }

  createSafezones() {
    const bottomWall = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height - 10,
      this.scene.scale.width,
      20,
      0x000000
    );
    this.scene.physics.add.existing(bottomWall, true);
    this.safezones.push(bottomWall);
    const text = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height - 10,
      "Ant Safe Zone",
      {
        fontSize: "20px",
        color: "#ffffff",
      }
    );
    text.setOrigin(0.5, 0.5);
  }

  getSafezones() {
    return this.safezones;
  }

  addWaypoint(pointer: Phaser.Input.Pointer) {
    console.log("pointerdown, adding waypoint");
    const waypoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
    this.waypoints.push(waypoint);
    this.scene.add.image(waypoint.x, waypoint.y, "waypoint");
  }

  getWaypoints() {
    return this.waypoints;
  }
}

export default Environment;
