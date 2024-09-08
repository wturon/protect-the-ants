import Phaser from "phaser";
import GameManager from "./GameManager";
class UIManager {
  private scene: Phaser.Scene;
  private scoreText: Phaser.GameObjects.Text | null;
  private gameManager: GameManager;

  constructor(scene: Phaser.Scene, gameManager: GameManager) {
    this.scene = scene;
    this.gameManager = gameManager;
    this.scoreText = null;
  }

  initForGamePlay() {
    this.scoreText = null;
  }

  createForGamePlay() {
    this.addScoreText(this.gameManager.gameStatus.currentLevelScore);
    this.addInstructionText();
    this.createResetButton(() => this.gameManager.resetLevel());
    this.createStartButton(() => this.gameManager.startLevel());
  }

  addScoreText(score?: number) {
    this.scoreText = this.createText(16, 16, `Ants Protected: ${score || 0}`, {
      fontSize: "24px",
      color: "#000",
    }).setOrigin(0);
  }

  updateScore(newScore: number) {
    if (this.scoreText) {
      this.scoreText.setText(`Ants Protected: ${newScore}`);
    } else {
      console.warn(
        "Score text doesn't exist. Did you forget to call addScoreText()?"
      );
    }
  }

  addInstructionText() {
    this.scene.add.text(16, 50, "Tap anywhere to guide the ants!", {
      fontSize: "16px",
      color: "#000",
    });
  }

  // createButton(
  //   x: number,
  //   y: number,
  //   text: string,
  //   callback: () => void,
  //   name: string = text
  // ) {
  //   const padding = 10; // Define padding value

  //   const buttonText = this.scene.add
  //     .text(0, 0, text, {
  //       fontSize: "24px",
  //       color: "#000",
  //     })
  //     .setOrigin(0.5);

  //   const buttonBackground = this.scene.add
  //     .rectangle(
  //       0,
  //       0,
  //       buttonText.width + 2 * padding,
  //       buttonText.height + 2 * padding,
  //       0xffffff
  //     )
  //     .setStrokeStyle(2, 0x000000); // Black border

  //   const buttonContainer = this.scene.add
  //     .container(x, y, [buttonBackground, buttonText])
  //     .setSize(buttonBackground.width, buttonBackground.height)
  //     .setInteractive()
  //     .on("pointerover", () => {
  //       buttonText.setStyle({ fill: "#fff" }); // White text on hover
  //       buttonBackground.setFillStyle(0x000000); // Black background on hover
  //     })
  //     .on("pointerout", () => {
  //       buttonText.setStyle({ fill: "#000" }); // Black text
  //       buttonBackground.setFillStyle(0xffffff); // White background
  //     })
  //     .on("pointerdown", callback);

  //   buttonText.setDepth(1); // Ensure text is above the background
  //   buttonContainer.setName(name);

  //   return buttonContainer;
  // }

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
    const { width, height } = this.scene.scale;
    this.createButton(
      width / 2,
      height / 2,
      "Next Level",
      () => {
        callback();
        const nextLevelButton = this.scene.children.getByName("Next Level");
        nextLevelButton?.destroy();
      },
      "Next Level"
    );
  }

  // Create a generic text element
  createText(
    x: number,
    y: number,
    text: string,
    style: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    return this.scene.add.text(x, y, text, style).setOrigin(0.5);
  }

  // // Create a generic button element
  createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void,
    name: string = text
  ) {
    const buttonText = this.createText(0, 0, text, {
      fontSize: "24px",
      color: "#000",
    });
    const buttonBackground = this.scene.add
      .rectangle(0, 0, buttonText.width + 20, buttonText.height + 20, 0xffffff)
      .setStrokeStyle(2, 0x000000);

    const buttonContainer = this.scene.add
      .container(x, y, [buttonBackground, buttonText])
      .setSize(buttonBackground.width, buttonBackground.height)
      .setInteractive()
      .on("pointerover", () =>
        this.handleButtonHover(buttonText, buttonBackground, true)
      )
      .on("pointerout", () =>
        this.handleButtonHover(buttonText, buttonBackground, false)
      )
      .on("pointerdown", callback);

    buttonContainer.setName(name);
    return buttonContainer;
  }

  handleButtonHover(
    buttonText: Phaser.GameObjects.Text,
    buttonBackground: Phaser.GameObjects.Rectangle,
    isHovering: boolean
  ) {
    buttonText.setStyle({ fill: isHovering ? "#fff" : "#000" });
    buttonBackground.setFillStyle(isHovering ? 0x000000 : 0xffffff);
  }
}

export default UIManager;
