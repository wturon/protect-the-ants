import Phaser from "phaser";
import background from "../../public/assets/backgrounds/background-white.png";
import ant from "../../public/assets/sprites/ant.png";
import waypoint from "../../public/assets/sprites/waypoint.png";
import GameManager from "../GameManagement/GameManager";
import fireAnt from "../../public/assets/sprites/fire_ant.png";
import EnvironmentManager from "../GameObjects/Environment/EnvironmentManager";
import DebugUtility from "../Utils/DebugUtility";
import { EndSceneData } from "./EndScene";
import { ICON_KEYS, SCENES } from "../config";
import UIManager from "../GameManagement/UIManager";
import CollisionManager from "../GameObjects/Environment/CollisionManager";
import AntManager from "../GameObjects/Player/AntManager";

class GamePlayScene extends Phaser.Scene {
  private antManager: AntManager;
  private gameManager: GameManager;
  private environmentManager: EnvironmentManager;
  private uiManager: UIManager;
  private collisionManager: CollisionManager;

  // Debug
  private debugUtility: DebugUtility;

  constructor() {
    super(SCENES.GAME_PLAY_SCENE);
    this.gameManager = new GameManager(this);
    this.uiManager = new UIManager(this, this.gameManager);
    this.environmentManager = new EnvironmentManager(this);
    this.antManager = new AntManager(this);
    this.debugUtility = new DebugUtility(this);
    this.collisionManager = new CollisionManager(
      this,
      this.antManager,
      this.environmentManager,
      this.gameManager,
      this.uiManager
    );
  }

  init() {
    this.gameManager.init();
    const levelConfig = this.gameManager.getLevelConfig();
    this.environmentManager.init();
    this.antManager.init(levelConfig);
    this.uiManager.initForGamePlay(levelConfig);
  }

  preload() {
    this.load.image("background", background);
    this.load.image(ICON_KEYS.ANT, ant);
    this.load.image(ICON_KEYS.WAYPOINT, waypoint);
    this.load.image(ICON_KEYS.FIRE_ANT, fireAnt);
  }

  create() {
    this.debugUtility.enableDebugMode();
    this.gameManager.create();
    const levelConfig = this.gameManager.getLevelConfig();
    this.environmentManager.create(levelConfig);
    this.antManager.create(levelConfig);
    this.uiManager.createForGamePlay();
    this.collisionManager.create();
  }

  update() {
    this.gameManager.update();
    const gameState = this.gameManager.gameStatus.gameState;
    this.debugUtility.updateDebugInfo(this.gameManager);

    if (gameState === "IN_PROGRESS") {
      this.antManager.update();
      this.environmentManager.update();
    }

    if (this.gameManager.gameStatus.gameState === "NEXT_LEVEL_READY") {
      this.scene.start(SCENES.GAME_PLAY_SCENE);
    } else if (this.gameManager.gameStatus.gameState === "GAME_COMPLETED") {
      const data: EndSceneData = {
        score: this.gameManager.gameStatus.savedAnts,
      };
      this.scene.start(SCENES.END_SCENE, data);
    }
  }
}

export default GamePlayScene;
