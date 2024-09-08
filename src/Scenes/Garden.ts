import Phaser from "phaser";
import background from "../../public/assets/backgrounds/background-white.png";
import ant from "../../public/assets/sprites/ant.png";
import waypoint from "../../public/assets/sprites/waypoint.png";
import AntManager from "../Characters/AntManager";
import GameManager from "../Game/GameManager";
import Ant from "../Characters/Ant";
import Environment from "../Characters/Environment";

class Garden extends Phaser.Scene {
  private antManager: AntManager | null = null;
  private gameManager: GameManager;
  private environment: Environment;

  constructor() {
    super("Garden");
    this.gameManager = new GameManager(this, true);
    this.environment = new Environment(
      this,
      this.gameManager.getCurrentLevel(),
      this.gameManager.getGameStatus().isGameplayInputActive
    );
  }

  preload() {
    this.load.image("background", background);
    this.load.image("ant", ant);
    this.load.image("waypoint", waypoint);
  }

  create() {
    this.antManager = new AntManager(
      this,
      this.gameManager.getCurrentLevel(),
      this.environment
    );
    if (!this.antManager) {
      console.error("AntManager not initialized");
      return;
    }

    this.antManager.initializeSpawner();

    this.environment.createGround();
    this.environment.createObstacles();
    this.environment.createSafezones();

    this.gameManager.setupUI();

    // Collisions
    this.physics.add.collider(
      this.antManager.getAnts(),
      this.environment.getObstacles()
    );

    this.physics.add.collider(
      this.antManager.getAnts(),
      this.environment.getSafezones(),
      (_, ant) => {
        if (!this.antManager) return;
        this.antManager.saveAnt(ant as Ant);
        this.gameManager.addPoints(1);
      }
    );
  }

  update() {
    if (!this.antManager) {
      return;
    }
    console.log("Update, paused:", this.gameManager.getGameStatus().isPaused);
    this.antManager.updateAnts(this.gameManager.getGameStatus().isPaused);
  }
}

export default Garden;
