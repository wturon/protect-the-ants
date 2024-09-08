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

  createResetButton(callback: () => void) {
    const resetButton = this.scene.add
      .text(16, 80, "Reset", { fontSize: "24px", color: "#ff6666" })
      .setInteractive();
    resetButton.on("pointerdown", callback);
  }

  createStartButton(callback: () => void) {
    const startButton = this.scene.add
      .text(16, 120, "Start", { fontSize: "24px", color: "#ff6666" })
      .setInteractive();
    startButton.on("pointerdown", () => {
      callback();
      startButton.destroy();
    });
  }

  createNextLevelButton(callback: () => void) {
    const nextLevelButton = this.scene.add
      .text(16, 160, "Next Level", { fontSize: "24px", color: "#66ff66" })
      .setInteractive();
    nextLevelButton.on("pointerdown", () => {
      callback();
      nextLevelButton.destroy();
    });
  }
}

export default UIManager;
