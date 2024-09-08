import Phaser from "phaser";
import background from "../../public/assets/backgrounds/background-white.png";
import ant from "../../public/assets/sprites/ant.png";
import waypoint from "../../public/assets/sprites/waypoint.png";
import AntManager from "../GameObjects/AntManager";
import GameManager from "../GameManagement/GameManager";
import Ant from "../GameObjects/Ant";
import Environment from "../GameObjects/Environment";
import DebugUtility from "../Utils/DebugUtility";
import { EndSceneData } from "./EndScene";
import { SCENES } from "../config";
import UIManager from "../GameManagement/UIManager";

class GamePlayScene extends Phaser.Scene {
  private antManager: AntManager;
  private gameManager: GameManager;
  private environment: Environment;
  private debugUtility: DebugUtility;
  private uiManager: UIManager;
  constructor() {
    super(SCENES.GAME_PLAY_SCENE);
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
    this.uiManager = new UIManager(this, this.gameManager);
  }

  init() {
    this.gameManager.init();
    this.environment.init();
    this.antManager.init();
    this.uiManager.initForGamePlay();
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
    this.uiManager.createForGamePlay();

    // Collisions
    this.physics.add.collider(
      this.antManager.getAnts(),
      this.environment.getObstacles()
    );

    this.physics.add.collider(
      this.antManager.getAnts(),
      this.environment.getSafezones(),
      (_, ant) => {
        this.antManager.saveAnt(ant as Ant);
        this.gameManager.addPoints(1);
        this.uiManager.updateScore(
          this.gameManager.gameStatus.currentLevelScore
        );
      }
    );
  }

  update() {
    this.gameManager.update();
    this.debugUtility.updateDebugInfo(this.gameManager);
    if (this.gameManager.gameStatus.gameState === "PAUSED") {
      return;
    }
    if (this.gameManager.gameStatus.gameState === "IN_PROGRESS") {
      this.antManager.updateAnts();
    }
    if (this.gameManager.gameStatus.gameState === "CURRENT_LEVEL_COMPLETED") {
      const nextLevel = this.gameManager.handleLevelCompletion();
      if (nextLevel === -1) {
        const data: EndSceneData = {
          score: this.gameManager.gameStatus.allTimeScore,
        };
        this.scene.start(SCENES.END_SCENE, data);
      } else {
        this.scene.start(SCENES.GAME_PLAY_SCENE);
      }
    }
  }
}

export default GamePlayScene;
