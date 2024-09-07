import Phaser from "phaser";
import TitleScene from "./TitleScene";
import Level1 from "./Level1";

// Phaser Game Configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [TitleScene, Level1], // Include both scenes here,
  scale: {
    mode: Phaser.Scale.FIT, // Ensure the game scales to fit the screen
    autoCenter: Phaser.Scale.CENTER_BOTH, // Center the game horizontally and vertically
  },
};

// Initialize the Phaser Game
new Phaser.Game(config);
