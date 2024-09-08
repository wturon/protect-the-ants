import Phaser from "phaser";
import UIManager from "../GameManagement/UIManager";
import { SCENES } from "../config";
import GameManager from "../GameManagement/GameManager";

class TitleScene extends Phaser.Scene {
  private uiManager: UIManager;
  private gameManager: GameManager;

  constructor() {
    super(SCENES.TITLE_SCENE);
    this.gameManager = new GameManager(this);
    this.uiManager = new UIManager(this, this.gameManager);
  }

  preload() {
    // Load any assets for the title screen here if needed
  }

  create() {
    this.add
      .text(300, 400, "Protect the Ants!", {
        fontSize: "48px",
        color: "#000000",
      })
      .setOrigin(0.5);

    this.uiManager.createButton(300, 500, "Play Game", () => {
      this.scene.start(SCENES.GAME_PLAY_SCENE);
    });
  }
}

export default TitleScene;
