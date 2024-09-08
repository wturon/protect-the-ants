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
      .text(300, 400, "Protect the Ants!", {
        fontSize: "48px",
        color: "#000000",
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(300, 500, "Play Game", {
        fontSize: "32px",
        color: "#ff6666",
      })
      .setOrigin(0.5)
      .setInteractive();

    playButton.on("pointerdown", () => {
      this.scene.start("Garden");
    });
  }
}

export default TitleScene;
