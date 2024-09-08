import Phaser from "phaser";
import background from "../../public/assets/backgrounds/background-white.png";
import ant from "../../public/assets/sprites/ant.png";
import Ant from "../Models/Ant";

const BACKGROUND_KEY = "background";
const ANT_KEY = "ant";
const SCORE_TEXT_STYLE = { fontSize: "24px", color: "#000" };
const INSTRUCTION_TEXT_STYLE = { fontSize: "16px", color: "#000" };
const RESET_BUTTON_STYLE = { fontSize: "24px", color: "#ff6666" };
const WALL_COLOR = 0x000000;
const WALL_THICKNESS = 20;

class Level1 extends Phaser.Scene {
  private ants!: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;
  waypoints: Phaser.Math.Vector2[] = [];
  private isResetting = false;
  private isPaused = true; // Add a flag to track the paused state

  constructor() {
    super("ExampleScene");
  }

  preload() {
    this.load.image(BACKGROUND_KEY, background);
    this.load.image(ANT_KEY, ant);
  }

  create() {
    this.addScoreText();
    this.addInstructionText();
    this.createAnts();
    this.createWalls();
    this.createResetButton();
    this.createStartButton(); // Add the start button
    this.setupInputHandlers();
  }

  update() {
    if (this.isPaused) return; // Skip update if the game is paused
    this.ants.getChildren().forEach((ant) => {
      (ant as Ant).update(this.waypoints);
    });
  }

  private addScoreText() {
    this.scoreText = this.add.text(
      16,
      16,
      "Ants Protected: 0",
      SCORE_TEXT_STYLE
    );
  }

  private addInstructionText() {
    this.add.text(
      16,
      50,
      "Tap anywhere to guide the ants!",
      INSTRUCTION_TEXT_STYLE
    );
  }

  private createAnts() {
    this.ants = this.physics.add.group({
      classType: Ant,
      key: ANT_KEY,
      repeat: 5,
      setXY: { x: 200, y: -200, stepX: 50, stepY: 50 },
    });
  }

  private createWalls() {
    const middleWall = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width / 2,
      WALL_THICKNESS,
      WALL_COLOR
    );
    this.physics.add.existing(middleWall, true);
    this.physics.add.collider(this.ants, middleWall);

    const bottomWall = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 10,
      this.scale.width,
      WALL_THICKNESS,
      WALL_COLOR
    );
    this.physics.add.existing(bottomWall, true);
    this.physics.add.collider(this.ants, bottomWall, (_, ant) => {
      this.checkAntsSaved(
        ant as Phaser.Types.Physics.Arcade.GameObjectWithBody
      );
    });
  }

  private createResetButton() {
    const resetButton = this.add
      .text(16, 80, "Reset", RESET_BUTTON_STYLE) // Adjusted position
      .setInteractive();
    resetButton.on("pointerdown", this.resetGame, this);
    resetButton.on("pointerup", () => {
      this.isResetting = false;
    });
  }

  private createStartButton() {
    const startButton = this.add
      .text(16, 120, "Start", RESET_BUTTON_STYLE) // Adjusted position
      .setInteractive();
    startButton.on("pointerdown", () => {
      this.isPaused = false;
      startButton.destroy(); // Remove the button after starting
    });
  }

  private setupInputHandlers() {
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.isResetting) return;
      this.addWaypoint(pointer);
    });
  }

  private addWaypoint(pointer: Phaser.Input.Pointer) {
    const waypoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
    this.waypoints.push(waypoint);
    this.ants.getChildren().forEach((ant) => {
      this.physics.moveToObject(ant, waypoint, 200);
    });
    console.log("Waypoints length:", this.waypoints.length);
  }

  private resetGame() {
    this.isResetting = true;
    this.score = 0;
    this.scoreText.setText("Ants Saved: 0");
    this.waypoints = [];
    this.ants.getChildren().forEach((ant) => {
      (ant as Ant).waypointIndex = 0;
    });
    this.scene.restart();
  }

  private checkAntsSaved(ant: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    this.score += 1;
    this.scoreText.setText("Ants Saved: " + this.score);
    ant.destroy();
  }
}

export default Level1;
