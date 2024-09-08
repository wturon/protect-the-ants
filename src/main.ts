import Phaser from "phaser";
import Level1 from "./Scenes/Level1";
import TitleScene from "./Scenes/TitleScene";

// Phaser Game Configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 600, // Adjusted for vertical orientation
  height: 800, // Adjusted for vertical orientation
  backgroundColor: "#FFFFFF",
  scene: [TitleScene, Level1],
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

// Initialize the Phaser Game
const game = new Phaser.Game(config);
