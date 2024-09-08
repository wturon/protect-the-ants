import Phaser from "phaser";
import { LEVELS } from "../Services/levels.service";
import UIManager from "./UIManager";

class GameManager {
  private scene: Phaser.Scene;
  private currentLevel: number;
  private isPaused: boolean;
  private isGameplayInputActive: boolean;
  private uiManager: UIManager;
  private score: number = 0;

  constructor(scene: Phaser.Scene, isGameplayInputActive: boolean) {
    this.scene = scene;
    this.currentLevel = 0;
    this.isPaused = true;
    this.isGameplayInputActive = isGameplayInputActive;
    this.uiManager = new UIManager(scene);
  }

  setupUI() {
    this.uiManager.addScoreText(this.score);
    this.uiManager.addInstructionText();
    this.uiManager.createResetButton(() => this.resetLevel());
    this.uiManager.createStartButton(() => this.startLevel());
  }

  startLevel() {
    console.log("Start level");
    this.isPaused = false;
  }

  endLevel() {
    this.isPaused = true;
    this.uiManager.createNextLevelButton(() => this.nextLevel());
  }

  nextLevel() {
    this.currentLevel += 1;
    this.isPaused = true;
    this.resetLevel();
  }

  resetLevel() {
    console.log("Reset level");
    this.isPaused = true;
    this.scene.scene.restart();
    this.setupUI();
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }

  getGameStatus(): {
    isPaused: boolean;
    currentLevel: number;
    isGameplayInputActive: boolean;
  } {
    return {
      isPaused: this.isPaused,
      currentLevel: this.currentLevel,
      isGameplayInputActive: this.isGameplayInputActive,
    };
  }

  addPoints(points: number) {
    this.score += points;
    this.uiManager.updateScore(this.score);
  }
}

export default GameManager;
