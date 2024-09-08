import Phaser from "phaser";
import background from "../../public/assets/backgrounds/background-white.png";
import ant from "../../public/assets/sprites/ant.png";
import waypoint from "../../public/assets/sprites/waypoint.png";
import AntManager from "../Characters/AntManager";
import GameManager from "../Game/GameManager";
import Ant from "../Characters/Ant";
import Environment from "../Characters/Environment";
import DebugUtility from "../Utils/DebugUtility";

class LevelScene extends Phaser.Scene {
  private antManager: AntManager | null = null;
  private gameManager: GameManager;
  private environment: Environment;
  private debugUtility: DebugUtility;
  constructor() {
    super("LevelScene");
    this.gameManager = new GameManager(this);
    this.environment = new Environment(
      this,
      this.gameManager.getCurrentLevel()
    );

    this.debugUtility = new DebugUtility(this);
  }

  init() {
    this.gameManager.init();
    this.environment.init();
  }

  preload() {
    this.load.image("background", background);
    this.load.image("ant", ant);
    this.load.image("waypoint", waypoint);
  }

  create() {
    // this.debugUtility.enableDebugMode();

    this.environment.create();
    this.gameManager.create();
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
    this.gameManager.update();
    this.debugUtility.updateDebugInfo(this.environment);
    if (this.gameManager.gameStatus.gameState === "PAUSED") {
      return;
    }
    if (this.gameManager.gameStatus.gameState === "IN_PROGRESS") {
      if (!this.antManager) {
        return;
      }
      this.antManager.updateAnts();
    }
    if (this.gameManager.gameStatus.gameState === "CURRENT_LEVEL_COMPLETED") {
      this.gameManager.handleLevelCompletion();
    }
  }
}

export default LevelScene;
