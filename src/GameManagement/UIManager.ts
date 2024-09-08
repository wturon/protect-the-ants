import Phaser from "phaser";
import GameManager from "./GameManager";
import { LEVELS } from "../Services/levels.service";
import { CUSTOM_EVENTS } from "../config";
class UIManager {
  private scene: Phaser.Scene;
  private scoreText: Phaser.GameObjects.Text | null;
  private gameManager: GameManager;
  private waypointsText: Phaser.GameObjects.Text | null;
  private progressText: Phaser.GameObjects.Text | null;

  constructor(scene: Phaser.Scene, gameManager: GameManager) {
    this.scene = scene;
    this.gameManager = gameManager;
    this.waypointsText = null;
    this.progressText = null;
    this.scoreText = null;
  }

  initForGamePlay() {
    this.scoreText = null;
    this.waypointsText = null;
    this.progressText = null;

    this.scene.events.on(
      CUSTOM_EVENTS.CURRENT_LEVEL_SCORE_UPDATED,
      (score: number) => {
        this.updateProgressText(score);
        this.updateScore(score);
      }
    );
    this.scene.events.on(
      CUSTOM_EVENTS.WAYPOINTS_UPDATED,
      (waypoints: Phaser.Math.Vector2[]) => {
        this.updateWaypoints(waypoints);
      }
    );
  }

  createForGamePlay() {
    const currentLevel = this.gameManager.gameStatus.currentLevel;
    const levelConfig = LEVELS[currentLevel];
    console.log("levelConfig", levelConfig);
    console.log("currentLevel", currentLevel);
    this.addScoreText(this.gameManager.gameStatus.currentLevelScore);
    this.addWaypointsText(levelConfig.allowedWaypoints);
    this.addProgressText(
      this.gameManager.gameStatus.currentLevelScore,
      levelConfig.scoreToComplete
    );
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

  addWaypointsText(waypointLimit: number) {
    this.waypointsText = this.createText(
      16,
      80,
      `Waypoints Left: ${waypointLimit}`,
      {
        fontSize: "24px",
        color: "#000",
      }
    ).setOrigin(0);
  }

  updateWaypoints(waypoints: Phaser.Math.Vector2[]) {
    const waypointLimit =
      LEVELS[this.gameManager.gameStatus.currentLevel].allowedWaypoints;
    const waypointsLeft = waypointLimit - waypoints.length;
    if (this.waypointsText) {
      this.waypointsText.setText(`Waypoints Left: ${waypointsLeft}`);
    } else {
      console.warn(
        "Waypoints text doesn't exist. Did you forget to call addWaypointsText()?"
      );
    }
  }

  addProgressText(currentScore: number, scoreToComplete: number) {
    this.progressText = this.createText(
      16,
      110,
      `Progress: ${currentScore}/${scoreToComplete}`,
      {
        fontSize: "24px",
        color: "#000",
      }
    ).setOrigin(0);
  }

  updateProgressText(currentScore: number) {
    const currentLevel = this.gameManager.gameStatus.currentLevel;
    const levelConfig = LEVELS[currentLevel];
    if (this.progressText) {
      this.progressText.setText(
        `Progress: ${currentScore}/${levelConfig.scoreToComplete}`
      );
    } else {
      console.warn(
        "Progress text doesn't exist. Did you forget to call addProgressText()?"
      );
    }
  }

  addInstructionText() {
    this.scene.add.text(16, 50, "Tap anywhere to guide the ants!", {
      fontSize: "16px",
      color: "#000",
    });
  }

  createResetButton(callback: () => void) {
    this.createButton(64, 220, "Reset", callback, "Reset");
  }

  createStartButton(callback: () => void) {
    this.createButton(
      64,
      280,
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
