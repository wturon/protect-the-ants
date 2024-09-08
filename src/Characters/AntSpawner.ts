import Phaser from "phaser";
import Ant from "./Ant";

class AntSpawner {
  private scene: Phaser.Scene;
  private ants: Phaser.Physics.Arcade.Group;
  private spawnInterval: number;
  private lastSpawnTime: number;
  private spawnLocation: { x: number; y: number };
  private antSpeed: number;
  constructor(
    scene: Phaser.Scene,
    ants: Phaser.Physics.Arcade.Group,
    spawnInterval: number,
    spawnLocation: { x: number; y: number },
    antSpeed: number
  ) {
    this.scene = scene;
    this.ants = ants;
    this.spawnInterval = spawnInterval;
    this.lastSpawnTime = 0;
    this.spawnLocation = spawnLocation;
    this.antSpeed = antSpeed;
  }

  update() {
    const currentTime = this.scene.time.now;
    if (currentTime > this.lastSpawnTime + this.spawnInterval) {
      this.spawnAnt();
      this.lastSpawnTime = currentTime;
    }
  }

  private spawnAnt() {
    const ant = new Ant(
      this.scene,
      this.spawnLocation.x,
      this.spawnLocation.y,
      this.antSpeed
    );
    this.ants.add(ant);
  }
}

export default AntSpawner;
