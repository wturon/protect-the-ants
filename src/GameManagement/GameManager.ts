import Phaser from "phaser";
import { Level, LEVELS } from "../Services/levels.service";
import { CUSTOM_EVENTS } from "../config";

const GameStateOptions = [
  "IN_PROGRESS",
  "PAUSED",
  "CURRENT_LEVEL_COMPLETED",
  "NEXT_LEVEL_READY",
  "GAME_COMPLETED",
] as const;
export type GameState = (typeof GameStateOptions)[number];

class GameManager {
  private scene: Phaser.Scene;
  private currentLevel: number;
  private allTimeScore: number = 0;
  private currentLevelScore: number = 0;
  private levelConfig!: Level;
  private gameState: GameState = "PAUSED";

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentLevel = 0;
  }

  init() {
    this.updateGameState("PAUSED");
    this.currentLevelScore = 0;
    this.levelConfig = LEVELS[this.currentLevel];
  }

  create() {
    // this.setupUI();
  }

  update() {
    if (this.currentLevelScore >= this.levelConfig.scoreToComplete) {
      console.log("Current level score:", this.currentLevelScore);
      console.log("Level score to complete:", this.levelConfig.scoreToComplete);
      this.updateGameState("CURRENT_LEVEL_COMPLETED");
    }
  }

  advanceOneLevel() {
    this.incrementAllTimeScore(this.currentLevelScore);
    this.currentLevel += 1;
    if (this.currentLevel >= LEVELS.length) {
      this.updateGameState("GAME_COMPLETED");
      this.currentLevel = 0;
      return -1;
    }
    this.updateGameState("NEXT_LEVEL_READY");
    return this.currentLevel;
  }

  startLevel() {
    this.updateGameState("IN_PROGRESS");
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

  updateGameState(newState: GameState) {
    const invalidTransitions: Record<GameState, GameState[]> = {
      IN_PROGRESS: [],
      PAUSED: [],
      CURRENT_LEVEL_COMPLETED: [],
      NEXT_LEVEL_READY: ["CURRENT_LEVEL_COMPLETED"],
      GAME_COMPLETED: ["CURRENT_LEVEL_COMPLETED"],
    };

    if (newState === this.gameState) {
      console.warn("Redundant attempt to update game state", newState);
      return;
    }

    if (invalidTransitions[this.gameState].includes(newState)) {
      console.warn(
        `Invalid transition attempt from ${this.gameState} to ${newState}`
      );
      return;
    }

    this.gameState = newState;
    console.log("Updating game state", newState);
    this.scene.events.emit(CUSTOM_EVENTS.GAME_STATE_UPDATED, this.gameState);
  }
}

export default GameManager;
