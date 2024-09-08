import EndScene from "./Scenes/EndScene";
import LevelOrchestrator from "./Scenes/LevelOrchestrator";
import TitleScene from "./Scenes/TitleScene";

// Phaser Game Configuration
export const GAME_CONFIG: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  backgroundColor: "#FFFFFF",
  scene: [TitleScene, LevelOrchestrator, EndScene],
  scale: {
    mode: Phaser.Scale.FIT, // Ensure the game scales to fit the screen
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game horizontally and vertically
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};
