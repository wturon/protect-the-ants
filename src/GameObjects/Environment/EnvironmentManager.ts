import Phaser from "phaser";
import { Level } from "../../Services/levels.service";
import FireAnt, { FireAntState } from "./FireAnt";
import Ant, { AntState } from "../Player/Ant";

class EnvironmentManager {
  private scene: Phaser.Scene;
  private obstacles: Phaser.GameObjects.Rectangle[] = [];
  private safezones: Phaser.GameObjects.Rectangle[] = [];
  private fireAnts!: Phaser.Physics.Arcade.Group;
  private lostAnts!: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  init() {
    this.obstacles = [];
    this.safezones = [];
    this.fireAnts = this.scene.physics.add.group({
      classType: FireAnt,
    });
    this.lostAnts = this.scene.physics.add.group({
      classType: Ant,
    });
  }

  create(levelConfig: Level) {
    this.createObstacles(levelConfig);
    this.createSafezones(levelConfig);
    this.createFireAnts(levelConfig);
    this.createLostAnts(levelConfig);
  }

  update() {
    this.fireAnts.getChildren().forEach((fireAnt) => {
      fireAnt.update();
    });
  }

  createLostAnts(levelConfig: Level) {
    if (!levelConfig.lostAnts) return;
    levelConfig.lostAnts.forEach((ant) => {
      const newLostAnt = new Ant(
        this.scene,
        ant.x,
        ant.y,
        levelConfig.ants.speed,
        100,
        AntState.LOST
      );
      this.lostAnts.add(newLostAnt);
    });
  }

  createObstacles(levelConfig: Level) {
    levelConfig.obstacles.forEach((obstacleConfig) => {
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

  getLostAnts() {
    return this.lostAnts;
  }

  removeLostAnt(ant: Ant) {
    this.lostAnts.remove(ant);
  }

  createFireAnts(levelConfig: Level) {
    this.fireAnts = this.scene.physics.add.group({
      classType: FireAnt,
    });
    levelConfig.fireAntConfig?.startingFireAnts.forEach((fireAnt) => {
      const newFireAnt = new FireAnt(
        this.scene,
        fireAnt.x,
        fireAnt.y,
        levelConfig.fireAntConfig?.speed,
        levelConfig.fireAntConfig?.health,
        FireAntState.WAITING_FOR_TARGET,
        levelConfig.fireAntConfig?.visionRange,
        levelConfig.fireAntConfig?.attackDamage
      ).setScale(0.5);
      this.fireAnts?.add(newFireAnt);
    });
  }

  getFireAnts() {
    return this.fireAnts;
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
      "HOME THIS WAY!",
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
