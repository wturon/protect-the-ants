import Phaser from "phaser";
import { LEVELS } from "../Services/levels.service";
import Ant from "./Ant";
import Environment from "./Environment";

class AntManager {
  private scene: Phaser.Scene;
  private ants!: Phaser.Physics.Arcade.Group;
  private currentLevel: number;
  private environment: Environment;

  constructor(
    scene: Phaser.Scene,
    currentLevel: number,
    environment: Environment
  ) {
    this.scene = scene;
    this.currentLevel = currentLevel;
    this.environment = environment;
  }

  createAnts() {
    const levelConfig = LEVELS[this.currentLevel];
    this.ants = this.scene.physics.add.group({
      classType: Ant,
      key: "ant",
      repeat: levelConfig.ants - 1,
      setXY: { x: 200, y: -500, stepX: 50, stepY: 50 },
    });
  }

  updateAnts(isPaused: boolean) {
    if (isPaused) return;
    const waypoints = this.environment.getWaypoints();
    this.ants.getChildren().forEach((ant) => {
      (ant as Ant).update(waypoints, isPaused);
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
