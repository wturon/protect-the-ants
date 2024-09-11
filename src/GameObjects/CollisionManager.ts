import Phaser from "phaser";
import AntManager from "./AntManager";
import EnvironmentManager from "./EnvironmentManager";
import GameManager from "../GameManagement/GameManager";
import UIManager from "../GameManagement/UIManager";
import Ant from "./Ant";

class CollisionManager {
  private scene: Phaser.Scene;
  private antManager: AntManager;
  private environmentManager: EnvironmentManager;
  private gameManager: GameManager;
  private uiManager: UIManager;

  constructor(
    scene: Phaser.Scene,
    antManager: AntManager,
    environmentManager: EnvironmentManager,
    gameManager: GameManager,
    uiManager: UIManager
  ) {
    this.scene = scene;
    this.antManager = antManager;
    this.environmentManager = environmentManager;
    this.gameManager = gameManager;
    this.uiManager = uiManager;
  }

  create() {
    this.scene.physics.add.collider(
      this.antManager.getAnts(),
      this.environmentManager.getObstacles()
    );

    this.scene.physics.add.collider(
      this.antManager.getAnts(),
      this.environmentManager.getSafezones(),
      (_, ant) => {
        this.antManager.saveAnt(ant as Ant);
        this.gameManager.addPoints(1);
        this.uiManager.updateProgressText(
          this.gameManager.gameStatus.currentLevelScore
        );
      }
    );
  }
}

export default CollisionManager;
