import Phaser from "phaser";
import { Level, LEVELS } from "../Services/levels.service";
import UIManager from "./UIManager";

const GameStateOptions = [
  "IN_PROGRESS",
  "PAUSED",
  "CURRENT_LEVEL_COMPLETED",
] as const;
export type GameState = (typeof GameStateOptions)[number];

class GameManager {
  private scene: Phaser.Scene;
  private currentLevel: number;
  private uiManager: UIManager;
  private allTimeScore: number = 0;
  private currentLevelScore: number = 0;
  private levelConfig: Level;
  private gameState: GameState = "PAUSED";

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentLevel = 0;
    this.uiManager = new UIManager(scene);
    this.levelConfig = LEVELS[this.currentLevel];
  }

  init() {
    this.gameState = "PAUSED";
    this.currentLevelScore = 0;
    this.allTimeScore = 0;
  }

  create() {
    this.setupUI();
  }

  update() {
    if (this.currentLevelScore >= this.levelConfig.scoreToComplete) {
      this.gameState = "CURRENT_LEVEL_COMPLETED";
    }
  }

  handleLevelCompletion() {
    this.uiManager.createNextLevelButton(() => this.nextLevel());
    this.gameState = "PAUSED";
  }
  nextLevel() {
    this.currentLevel += 1;
    this.resetLevel();
  }

  setupUI() {
    this.uiManager.addScoreText(this.allTimeScore);
    this.uiManager.addInstructionText();
    this.uiManager.createResetButton(() => this.resetLevel());
    this.uiManager.createStartButton(() => this.startLevel());
  }

  startLevel() {
    this.gameState = "IN_PROGRESS";
  }

  resetLevel() {
    this.scene.scene.restart();
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }

  get gameStatus(): {
    gameState: GameState;
    currentLevel: number;
  } {
    return {
      gameState: this.gameState,
      currentLevel: this.currentLevel,
    };
  }

  addPoints(points: number) {
    this.allTimeScore += points;
    this.currentLevelScore += points;
    this.uiManager.updateScore(this.allTimeScore);
  }
}

export default GameManager;
