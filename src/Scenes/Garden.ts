import Phaser from "phaser";
import background from "../../public/assets/backgrounds/background-white.png";
import ant from "../../public/assets/sprites/ant.png";
import waypoint from "../../public/assets/sprites/waypoint.png";
import AntManager from "../Characters/AntManager";
import GameManager from "../Game/GameManager";
import Ant from "../Characters/Ant";
import Environment from "../Characters/Environment";

class Garden extends Phaser.Scene {
  private antManager!: AntManager;
  private gameManager!: GameManager;
  private environment!: Environment;

  constructor() {
    super("Garden");
  }

  preload() {
    this.load.image("background", background);
    this.load.image("ant", ant);
    this.load.image("waypoint", waypoint);
  }

  create() {
    this.gameManager = new GameManager(this, true);
    this.environment = new Environment(
      this,
      this.gameManager.getCurrentLevel(),
      this.gameManager.getGameStatus().isGameplayInputActive
    );

    this.antManager = new AntManager(
      this,
      this.gameManager.getCurrentLevel(),
      this.environment
    );

    this.antManager.createAnts();

    this.environment.createGround();
    this.environment.createObstacles();
    this.environment.createSafezones();

    this.gameManager.setupUI();

    // Collisions
    this.physics.add.collider(
      this.antManager.getAnts(),
      this.environment.getObstacles()
    );

    this.physics.add.collider(
      this.antManager.getAnts(),
      this.environment.getSafezones(),
      (_, ant) => {
        this.antManager.saveAnt(ant as Ant);
        this.gameManager.addPoints(1);
      }
    );
  }

  update() {
    console.log("Update, paused:", this.gameManager.getGameStatus().isPaused);
    this.antManager.updateAnts(this.gameManager.getGameStatus().isPaused);
  }
}

export default Garden;
