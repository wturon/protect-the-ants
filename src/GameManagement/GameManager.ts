import Phaser from "phaser";
import { Level, LEVELS } from "../Services/levels.service";
import { CUSTOM_EVENTS } from "../config";

const GameStateOptions = [
  "IN_PROGRESS",
  "PAUSED",
  "CURRENT_LEVEL_COMPLETED",
  "GAME_COMPLETED",
] as const;
export type GameState = (typeof GameStateOptions)[number];

class GameManager {
  private scene: Phaser.Scene;
  private currentLevel: number;
  private allTimeScore: number = 0;
  private currentLevelScore: number = 0;
  private levelConfig: Level;
  private gameState: GameState = "PAUSED";

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentLevel = 0;
    this.levelConfig = LEVELS[this.currentLevel];
  }

  init() {
    this.gameState = "PAUSED";
    this.currentLevelScore = 0;
  }

  create() {
    // this.setupUI();
  }

  update() {
    if (this.currentLevelScore >= this.levelConfig.scoreToComplete) {
      this.gameState = "CURRENT_LEVEL_COMPLETED";
    }
  }

  handleLevelCompletion() {
    this.currentLevel += 1;
    this.incrementAllTimeScore(this.currentLevelScore);
    if (this.currentLevel >= LEVELS.length) {
      this.gameState = "GAME_COMPLETED";
      this.currentLevel = 0;
      return -1;
    }
    return this.currentLevel;
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
    allTimeScore: number;
    currentLevelScore: number;
  } {
    return {
      gameState: this.gameState,
      currentLevel: this.currentLevel,
      allTimeScore: this.allTimeScore,
      currentLevelScore: this.currentLevelScore,
    };
  }

  addPoints(points: number) {
    this.currentLevelScore += points;
    this.scene.events.emit(
      CUSTOM_EVENTS.CURRENT_LEVEL_SCORE_UPDATED,
      this.currentLevelScore
    );
  }

  incrementAllTimeScore(number: number = 1) {
    this.allTimeScore += number;
    this.scene.events.emit(
      CUSTOM_EVENTS.ALL_TIME_SCORE_UPDATED,
      this.allTimeScore
    );
  }
}

export default GameManager;
