import Phaser from "phaser";
import background from "../../public/assets/backgrounds/background-white.png";
import ant from "../../public/assets/sprites/ant.png";
import waypoint from "../../public/assets/sprites/waypoint.png";
import AntManager from "../Content/AntManager";
import GameManager from "../Meta/GameManager";
import Ant from "../Content/Ant";
import Environment from "../Content/Environment";
import DebugUtility from "../Utils/DebugUtility";
import { EndSceneData } from "./EndScene";

class LevelOrchestrator extends Phaser.Scene {
  private antManager: AntManager;
  private gameManager: GameManager;
  private environment: Environment;
  private debugUtility: DebugUtility;
  constructor() {
    super("LevelOrchestrator");
    this.gameManager = new GameManager(this);
    this.environment = new Environment(
      this,
      this.gameManager.getCurrentLevel()
    );
    this.antManager = new AntManager(
      this,
      this.gameManager.getCurrentLevel(),
      this.environment
    );
    this.debugUtility = new DebugUtility(this);
  }

  init() {
    this.gameManager.init();
    this.environment.init();
    this.antManager.init();
  }

  preload() {
    this.load.image("background", background);
    this.load.image("ant", ant);
    this.load.image("waypoint", waypoint);
  }

  create() {
    this.debugUtility.enableDebugMode();

    this.environment.create();
    this.gameManager.create();

    if (!this.antManager) {
      console.error("AntManager not initialized");
      return;
    }

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
    this.debugUtility.updateDebugInfo(this.gameManager);
    if (this.gameManager.gameStatus.gameState === "PAUSED") {
      // this.scene.pause();
      return;
    }
    if (this.gameManager.gameStatus.gameState === "IN_PROGRESS") {
      // this.scene.resume();
      if (this.antManager) {
        this.antManager.updateAnts();
      }
    }
    if (this.gameManager.gameStatus.gameState === "CURRENT_LEVEL_COMPLETED") {
      const nextLevel = this.gameManager.handleLevelCompletion();
      if (nextLevel === -1) {
        const data: EndSceneData = {
          score: this.gameManager.gameStatus.allTimeScore,
        };
        this.scene.start("EndScene", data);
      } else {
        this.scene.start("LevelOrchestrator");
      }
    }
  }
}

export default LevelOrchestrator;
