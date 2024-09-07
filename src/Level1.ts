import Phaser from "phaser";
import background from "../public/assets/backgrounds/background-white.png";
import ant from "../public/assets/sprites/ant.png";

class Level1 extends Phaser.Scene {
  private ants!: Phaser.Physics.Arcade.Group;
  score = 0;
  scoreText!: Phaser.GameObjects.Text;
  waypoints: Phaser.Math.Vector2[] = [];
  private isResetting = false; // Add a flag to track reset button press

  constructor() {
    super("ExampleScene");
  }

  preload() {
    this.load.image("background", background);
    this.load.image("ant", ant);
  }

  create() {
    this.add.image(400, 300, "background");
    this.scoreText = this.add.text(16, 16, "Ants Protected: 0", {
      fontSize: "24px",
      color: "#000",
    });
    this.ants = this.physics.add.group({
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
    this.ants.getChildren().forEach((ant) => {
      (ant as any).waypointIndex = 0; // Initialize waypoint index for each ant
      console.log("Ant waypoint index:", (ant as any).waypointIndex);
    });

    const middleWall = this.add.rectangle(
      this.scale.width / 2, // x position
      this.scale.height / 2 + 100, // y position
      20, // width
      this.scale.height / 2, // height
      0x000000 // color (black)
    );
    this.physics.add.existing(middleWall, true);
    this.physics.add.collider(this.ants, middleWall);

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
      this.isResetting = true; // Set flag when reset button is pressed
      this.score = 0;
      this.scoreText.setText("Ants Saved: 0");
      this.waypoints = [];
      this.ants.getChildren().forEach((ant) => {
        (ant as any).waypointIndex = 0;
      });
      this.scene.restart();
    });

    resetButton.on("pointerup", () => {
      this.isResetting = false; // Reset flag when reset button is released
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.isResetting) return; // Prevent waypoint placement if resetting

      const waypoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
      this.waypoints.push(waypoint);
      this.ants.getChildren().forEach((ant) => {
        this.physics.moveToObject(ant, waypoint, 200);
      });

      console.log("Waypoints length:", this.waypoints.length);
    });
  }

  update() {
    this.ants.getChildren().forEach((ant) => {
      const antBody = ant.body as Phaser.Physics.Arcade.Body;
      const antData = ant as any; // Type assertion to add custom properties

      if (
        this.waypoints.length > 0 &&
        antData.waypointIndex < this.waypoints.length
      ) {
        const targetWayPoint = this.waypoints[antData.waypointIndex];
        if (
          Phaser.Math.Distance.Between(
            antBody.center.x,
            antBody.center.y,
            targetWayPoint.x,
            targetWayPoint.y
          ) < 10 // Adjust the distance threshold as needed
        ) {
          antData.waypointIndex += 1;
          if (antData.waypointIndex >= this.waypoints.length) {
            antBody.velocity.x = 200; // Resume heading to the right wall
            antBody.velocity.y = 0;
          }
        } else {
          this.physics.moveToObject(ant, targetWayPoint, 200);
        }
      }
    });
  }

  private checkAntsSaved(ant: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
    this.score += 1;
    this.scoreText.setText("Ants Saved: " + this.score);
    ant.destroy();
  }
}

export default Level1;
