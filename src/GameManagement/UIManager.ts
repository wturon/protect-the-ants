import Phaser from "phaser";
import GameManager, { GameState } from "./GameManager";
import { LEVELS } from "../Services/levels.service";
import { CUSTOM_EVENTS, ICON_KEYS } from "../config";

class UIManager {
  private scene: Phaser.Scene;
  private gameManager: GameManager;
  private waypointsText: Phaser.GameObjects.Text | null;
  private progressText: Phaser.GameObjects.Text | null;
  private antIcon: Phaser.GameObjects.Image | null;
  private waypointIcon: Phaser.GameObjects.Image | null;

  constructor(scene: Phaser.Scene, gameManager: GameManager) {
    this.scene = scene;
    this.gameManager = gameManager;
    this.waypointsText = null;
    this.progressText = null;
    this.antIcon = null;
    this.waypointIcon = null;
  }

  initForGamePlay() {
    this.waypointsText = null;
    this.progressText = null;
    this.antIcon = null;
    this.waypointIcon = null;

    this.scene.events.on(
      CUSTOM_EVENTS.CURRENT_LEVEL_SCORE_UPDATED,
      (score: number) => {
        this.updateProgressText(score);
      }
    );
    this.scene.events.on(
      CUSTOM_EVENTS.WAYPOINTS_UPDATED,
      (waypoints: Phaser.Math.Vector2[]) => {
        this.updateWaypoints(waypoints);
      }
    );
    this.scene.events.on(
      CUSTOM_EVENTS.GAME_STATE_UPDATED,
      (state: GameState) => {
        this.handleGameStateChange(state);
      }
    );
  }

  createForGamePlay() {
    const currentLevel = this.gameManager.gameStatus.currentLevel;
    const levelConfig = LEVELS[currentLevel];
    this.addProgressText(
      this.gameManager.gameStatus.currentLevelScore,
      levelConfig.scoreToComplete
    );
    this.addWaypointsText(levelConfig.allowedWaypoints);
    this.addInstructionText();
    this.createResetButton(() => this.gameManager.resetLevel());
    this.createStartButton(() => this.gameManager.startLevel());
  }

  handleGameStateChange(state: GameState) {
    switch (state) {
      case "PAUSED":
        return;
      case "IN_PROGRESS":
        return;
      case "CURRENT_LEVEL_COMPLETED":
        this.createNextLevelButton(() => this.gameManager.advanceOneLevel());
        return;
    }
  }

  addWaypointsText(waypointLimit: number) {
    const container = this.scene.add.container(16, 48);
    const waypointIcon = this.scene.add
      .image(0, 0, ICON_KEYS.WAYPOINT)
      .setOrigin(0.5)
      .setScale(1.5);
    this.waypointsText = this.createText(24, 0, `${waypointLimit}`, {
      fontSize: "12px",
      color: "#000",
    }).setOrigin(0.5);

    container.add([waypointIcon, this.waypointsText]);
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
    const container = this.scene.add.container(16, 16);
    this.antIcon = this.scene.add
      .image(0, 0, ICON_KEYS.ANT)
      .setOrigin(0.5)
      .setScale(1.5);
    this.progressText = this.createText(
      24,
      0,
      `${currentScore}/${scoreToComplete}`,
      {
        fontSize: "12px",
        color: "#000",
      }
    ).setOrigin(0.5);

    container.add([this.antIcon, this.progressText]);
  }

  updateProgressText(currentScore: number) {
    const currentLevel = this.gameManager.gameStatus.currentLevel;
    const levelConfig = LEVELS[currentLevel];
    if (this.progressText) {
      this.progressText.setText(
        `${currentScore}/${levelConfig.scoreToComplete}`
      );
    } else {
      console.warn(
        "Progress text doesn't exist. Did you forget to call addProgressText()?"
      );
    }
  }

  addInstructionText() {
    this.scene.add
      .text(300, 700, "Tap anywhere to guide the ants!", {
        fontSize: "16px",
        color: "#000",
      })
      .setOrigin(0.5);
  }

  createResetButton(callback: () => void) {
    this.createButton(32, 100, "Reset", callback, "Reset");
  }

  createStartButton(callback: () => void) {
    this.createButton(
      32,
      140,
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
    const nextLevelButton = this.createButton(
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
      fontSize: "12px",
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
