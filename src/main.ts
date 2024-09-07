import Phaser from "phaser";
import background from "../public/assets/backgrounds/background-white.png";
import ant from "../public/assets/sprites/ant.png";
class ExampleScene extends Phaser.Scene {
  private ants!: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;
  constructor() {
    super("ExampleScene");
  }

  preload() {
    this.load.image("background", background);
    this.load.image("ant", ant);
  }

  create() {
    this.add.image(400, 300, "background");
    this.scoreText = this.add.text(16, 16, "Ants Saved: 0", {
      fontSize: "32px",
      color: "#000",
    });
    const ants = this.physics.add.group({
      key: "ant",
      repeat: 5,
      setXY: {
        x: -200,
        y: 200,
        stepX: 50,
        stepY: 50,
      },
      velocityX: 200,
    });
    this.ants = ants;
    const rightWall = this.add.rectangle(
      this.scale.width - 10, // x position
      this.scale.height / 2, // y position
      20, // width
      this.scale.height, // height
      0x000000 // color (black)
    );
    this.physics.add.existing(rightWall, true);
    this.physics.add.collider(this.ants, rightWall, (_, ant) => {
      this.checkAntsSaved(
        ant as Phaser.Types.Physics.Arcade.GameObjectWithBody
      );
    });

    const resetButton = this.add
      .text(600, 16, "Reset", {
        fontSize: "24px",
        color: "#ff6666", // changed to a lighter red
      })
      .setInteractive();

    resetButton.on("pointerdown", () => {
      this.scene.restart();
    });
  }

  private checkAntsSaved(ant: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    this.score += 1;
    this.scoreText.setText("Ants Saved: " + this.score);
    ant.destroy();
  }
}

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
  scene: ExampleScene,
};

// Initialize the Phaser Game
new Phaser.Game(config);
