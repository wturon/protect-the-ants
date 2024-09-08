import Phaser from "phaser";
import UIManager from "../GameManagement/UIManager";
import { SCENES } from "../config";
import GameManager from "../GameManagement/GameManager";
export interface EndSceneData {
  score: number;
}
class EndScene extends Phaser.Scene {
  private uiManager: UIManager;
  private gameManager: GameManager;
  constructor() {
    super(SCENES.END_SCENE);
    this.gameManager = new GameManager(this);
    this.uiManager = new UIManager(this, this.gameManager);
  }

  preload() {
    // Load any assets for the end screen here if needed
  }

  create({ score }: EndSceneData) {
    this.add
      .text(300, 300, "Congratulations!", {
        fontSize: "48px",
        color: "#000000",
      })
      .setOrigin(0.5);

    this.add
      .text(300, 400, `Ants Saved: ${score}`, {
        fontSize: "36px",
        color: "#000000",
      })
      .setOrigin(0.5);

    this.uiManager.createButton(300, 500, "Play Again", () => {
      this.scene.start(SCENES.TITLE_SCENE);
    });
  }
}

export default EndScene;
