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
  private levelConfig!: Level;
  private gameState: GameState = "PAUSED";
  private _colonySize: number = 1;
  private savedAnts: number = 0;

  get colonySize(): number {
    return this._colonySize;
  }

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.currentLevel = 0;
  }

  init() {
    this.updateGameState("PAUSED");
    this.levelConfig = LEVELS[this.currentLevel];
    this.savedAnts = 0;
  }

  create() {
    // this.setupUI();
  }

  update() {
    if (this.savedAnts >= this.colonySize) {
      this.updateGameState("CURRENT_LEVEL_COMPLETED");
    }
  }

  advanceOneLevel() {
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

  getLevelConfig() {
    return LEVELS[this.currentLevel];
  }

  get gameStatus(): {
    gameState: GameState;
    currentLevel: number;
    savedAnts: number;
    colonySize: number;
  } {
    return {
      gameState: this.gameState,
      currentLevel: this.currentLevel,
      savedAnts: this.savedAnts,
      colonySize: this.colonySize,
    };
  }

  incrementColonySize() {
    this._colonySize += 1;
    this.scene.events.emit(
      CUSTOM_EVENTS.COLONY_STATUS_UPDATED,
      this.savedAnts,
      this.colonySize
    );
  }

  decrementColonySize() {
    this._colonySize -= 1;
    this.scene.events.emit(
      CUSTOM_EVENTS.COLONY_STATUS_UPDATED,
      this.savedAnts,
      this.colonySize
    );
  }

  antSaved() {
    this.savedAnts += 1;
    this.scene.events.emit(
      CUSTOM_EVENTS.COLONY_STATUS_UPDATED,
      this.savedAnts,
      this.colonySize
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
