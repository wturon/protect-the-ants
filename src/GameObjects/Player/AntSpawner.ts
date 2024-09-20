import Phaser from "phaser";
import Ant from "./Ant";

class AntSpawner {
  private scene: Phaser.Scene;
  private ants: Phaser.Physics.Arcade.Group;
  private spawnInterval: number;
  private lastSpawnTime: number;
  private spawnLocation: { x: number; y: number };
  private antSpeed: number;
  private antLimit: number;
  private antCount: number = 0;
  constructor(
    scene: Phaser.Scene,
    ants: Phaser.Physics.Arcade.Group,
    spawnInterval: number,
    spawnLocation: { x: number; y: number },
    antSpeed: number,
    antLimit: number = 1
  ) {
    this.scene = scene;
    this.ants = ants;
    this.spawnInterval = spawnInterval;
    this.lastSpawnTime = 0;
    this.spawnLocation = spawnLocation;
    this.antSpeed = antSpeed;
    this.antLimit = antLimit;
  }

  update() {
    const currentTime = this.scene.time.now;
    if (currentTime > this.lastSpawnTime + this.spawnInterval) {
      if (this.antCount >= this.antLimit) return;
      this.spawnAnt();
      this.antCount++;
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
