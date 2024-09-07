import Phaser from "phaser";

class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    // Load any assets for the title screen here if needed
  }

  create() {
    this.add
      .text(400, 300, "Protect the Ants!", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(400, 400, "Play Game", {
        fontSize: "32px",
        color: "#ff6666",
      })
      .setOrigin(0.5)
      .setInteractive();

    playButton.on("pointerdown", () => {
      this.scene.start("ExampleScene");
    });
  }
}

export default TitleScene;
