import Phaser from "phaser";
import { Level, LEVELS } from "../Services/levels.service";
import { CUSTOM_EVENTS } from "../config";

class EnvironmentManager {
  private scene: Phaser.Scene;
  private obstacles: Phaser.GameObjects.Rectangle[] = [];
  private safezones: Phaser.GameObjects.Rectangle[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  init() {
    this.obstacles = [];
    this.safezones = [];
  }

  create(levelConfig: Level) {
    this.createObstacles(levelConfig);
    this.createSafezones(levelConfig);
  }

  createObstacles(levelConfig: Level) {
    console.log("Creating obstacles");
    levelConfig.obstacles.forEach((obstacleConfig) => {
      console.log("Creating obstacle", obstacleConfig);
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

  createSafezones(levelConfig: Level) {
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
}

export default EnvironmentManager;
