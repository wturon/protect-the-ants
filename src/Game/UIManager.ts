import Phaser from "phaser";

class UIManager {
  private scene: Phaser.Scene;
  private scoreText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  addScoreText(score: number) {
    this.scoreText = this.scene.add.text(16, 16, "Ants Protected: " + score, {
      fontSize: "24px",
      color: "#000",
    });
  }

  updateScore(score: number) {
    this.scoreText.setText("Ants Saved: " + score);
  }

  addInstructionText() {
    this.scene.add.text(16, 50, "Tap anywhere to guide the ants!", {
      fontSize: "16px",
      color: "#000",
    });
  }

  createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void,
    name: string = text
  ) {
    const padding = 10; // Define padding value

    const buttonText = this.scene.add
      .text(0, 0, text, {
        fontSize: "24px",
        color: "#000",
      })
      .setOrigin(0.5);

    const buttonBackground = this.scene.add
      .rectangle(
        0,
        0,
        buttonText.width + 2 * padding,
        buttonText.height + 2 * padding,
        0xffffff
      )
      .setStrokeStyle(2, 0x000000); // Black border

    const buttonContainer = this.scene.add
      .container(x, y, [buttonBackground, buttonText])
      .setSize(buttonBackground.width, buttonBackground.height)
      .setInteractive()
      .on("pointerover", () => {
        buttonText.setStyle({ fill: "#fff" }); // White text on hover
        buttonBackground.setFillStyle(0x000000); // Black background on hover
      })
      .on("pointerout", () => {
        buttonText.setStyle({ fill: "#000" }); // Black text
        buttonBackground.setFillStyle(0xffffff); // White background
      })
      .on("pointerdown", callback);

    buttonText.setDepth(1); // Ensure text is above the background
    buttonContainer.setName(name);

    return buttonContainer;
  }

  createResetButton(callback: () => void) {
    this.createButton(64, 120, "Reset", callback, "Reset");
  }

  createStartButton(callback: () => void) {
    this.createButton(
      64,
      180,
      "Start",
      () => {
        callback();
        const startButton = this.scene.children.getByName("Start");
        startButton?.destroy();
      },
      "Start"
    );
  }

  createNextLevelButton(callback: () => void) {
    this.createButton(
      16,
      160,
      "Next Level",
      () => {
        callback();
        this.scene.children.remove(this.scene.children.getByName("Next Level"));
      },
      "Next Level"
    );
  }
}

export default UIManager;
