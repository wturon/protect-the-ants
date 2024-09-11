import Phaser from "phaser";
import { Level } from "../Services/levels.service";
import Ant from "./Ant";
import AntSpawner from "./AntSpawner";
import { GameState } from "../GameManagement/GameManager";
import { CUSTOM_EVENTS } from "../config";

class AntManager {
  private scene: Phaser.Scene;
  private ants!: Phaser.Physics.Arcade.Group;
  private spawner: AntSpawner | null = null;
  private waypoints: Phaser.Math.Vector2[] = [];
  private validMovementArea: Phaser.GameObjects.Rectangle | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  init(levelConfig: Level) {
    this.waypoints = [];
    this.validMovementArea = null;
    this.ants = this.scene.physics.add.group({
      classType: Ant,
    });

    this.spawner = new AntSpawner(
      this.scene,
      this.ants,
      levelConfig.ants.spawnInterval,
      levelConfig.ants.spawnLocation,
      levelConfig.ants.speed
    );
  }

  create(levelConfig: Level) {
    this.createValidMovementArea(levelConfig);
  }

  update() {
    if (!this.spawner || !this.ants)
      throw new Error("Must initialize spawner and ants before updating ants");
    this.spawner.update();
    this.ants.getChildren().forEach((ant) => {
      if (!(ant instanceof Ant)) throw new Error("Ant is null");
      ant.update(this.waypoints);
    });
  }

  createValidMovementArea(levelConfig: Level) {
    if (this.validMovementArea) {
      return;
    }
    this.validMovementArea = this.scene.add
      .rectangle(
        this.scene.scale.width / 2,
        this.scene.scale.height / 2,
        this.scene.scale.width,
        this.scene.scale.height,
        0xffffff,
        0 // Make it invisible
      )
      .setInteractive();

    this.validMovementArea.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => {
        if (this.waypoints.length < levelConfig.allowedWaypoints) {
          this.addWaypoint(pointer);
        }
      }
    );
  }

  addWaypoint(pointer: Phaser.Input.Pointer) {
    const waypoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
    this.waypoints.push(waypoint);
    this.scene.add.image(waypoint.x, waypoint.y, "waypoint");
    this.scene.events.emit(CUSTOM_EVENTS.WAYPOINTS_UPDATED, this.waypoints);
  }
  getAnts() {
    return this.ants;
  }

  saveAnt(ant: Ant) {
    ant.destroy();
  }
}

export default AntManager;
