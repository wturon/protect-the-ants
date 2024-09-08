import Phaser from "phaser";
import { LEVELS } from "../Services/levels.service";
import Ant from "./Ant";
import Environment from "./Environment";
import AntSpawner from "./AntSpawner";

class AntManager {
  private scene: Phaser.Scene;
  private ants: Phaser.Physics.Arcade.Group;
  private currentLevel: number;
  private environment: Environment;
  private spawner: AntSpawner;

  constructor(
    scene: Phaser.Scene,
    currentLevel: number,
    environment: Environment
  ) {
    if (!scene.physics) {
      throw new Error("Physics system not initialized in the scene.");
    }
    this.scene = scene;
    this.currentLevel = currentLevel;
    this.environment = environment;
    this.ants = this.scene.physics.add.group({
      classType: Ant,
    });
    this.spawner = new AntSpawner(
      this.scene,
      this.ants,
      LEVELS[this.currentLevel].ants.spawnInterval,
      LEVELS[this.currentLevel].ants.spawnLocation,
      LEVELS[this.currentLevel].ants.speed
    );
  }

  initializeSpawner() {
    const levelConfig = LEVELS[this.currentLevel];
    this.spawner = new AntSpawner(
      this.scene,
      this.ants,
      levelConfig.ants.spawnInterval,
      levelConfig.ants.spawnLocation,
      levelConfig.ants.speed
    );
  }

  updateAnts(isPaused: boolean) {
    if (isPaused) return;
    this.spawner.update();
    const waypoints = this.environment.getWaypoints();
    this.ants.getChildren().forEach((ant) => {
      if (!(ant instanceof Ant)) throw new Error("Ant is null");
      ant.update(waypoints);
    });
  }

  getAnts() {
    return this.ants;
  }

  saveAnt(ant: Ant) {
    ant.destroy();
  }

  handleAntObstacleCollision(
    ant: Phaser.GameObjects.GameObject,
    obstacle: Phaser.GameObjects.GameObject
  ) {
    // Handle collision logic here
    console.log("Ant collided with obstacle:", ant, obstacle);
  }

  // Additional methods for ant interactions...
}

export default AntManager;
