import Phaser from "phaser";
import UIManager from "../Game/UIManager";

class TitleScene extends Phaser.Scene {
  private uiManager!: UIManager;

  constructor() {
    super("TitleScene");
  }

  preload() {
    // Load any assets for the title screen here if needed
  }

  create() {
    this.uiManager = new UIManager(this);

    this.add
      .text(300, 400, "Protect the Ants!", {
        fontSize: "48px",
        color: "#000000",
      })
      .setOrigin(0.5);

    this.uiManager.createButton(300, 500, "Play Game", () => {
      this.scene.start("Garden");
    });
  }
}

export default TitleScene;
