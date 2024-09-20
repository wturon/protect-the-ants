import Phaser from "phaser";
import FireAnt from "./FireAnt";
import EnvironmentManager from "./EnvironmentManager";
import GameManager from "../../GameManagement/GameManager";
import UIManager from "../../GameManagement/UIManager";
import AntManager from "../Player/AntManager";
import Ant from "../Player/Ant";
import DetectionCircle from "../GameUtils/DetectionCircle";

class CollisionManager {
  private scene: Phaser.Scene;
  private antManager: AntManager;
  private environmentManager: EnvironmentManager;
  private gameManager: GameManager;
  private uiManager: UIManager;

  constructor(
    scene: Phaser.Scene,
    antManager: AntManager,
    environmentManager: EnvironmentManager,
    gameManager: GameManager,
    uiManager: UIManager
  ) {
    this.scene = scene;
    this.antManager = antManager;
    this.environmentManager = environmentManager;
    this.gameManager = gameManager;
    this.uiManager = uiManager;
  }

  create() {
    this.fireAntVision();
    this.fireAntLungeSenses();
    this.fireAntAttackSenses();
    this.setUpObstacleCollisions();
    this.setUpLostAntCollisions();
  }

  setUpObstacleCollisions() {
    this.scene.physics.add.collider(
      this.antManager.getAnts(),
      this.environmentManager.getObstacles()
    );

    this.scene.physics.add.collider(
      this.environmentManager.getFireAnts(),
      this.environmentManager.getObstacles()
    );

    this.scene.physics.add.collider(
      this.antManager.getAnts(),
      this.environmentManager.getSafezones(),
      (_, ant) => {
        this.antManager.saveAnt(ant as Ant);
        this.gameManager.antSaved();
      }
    );
  }

  setUpLostAntCollisions() {
    this.environmentManager
      .getLostAnts()
      .getChildren()
      .forEach((ant) => {
        this.scene.physics.add.overlap(
          (ant as Ant).getDetectionCircle(),
          this.antManager.getAnts(),
          this
            .handleLostAntDetection as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          undefined,
          this
        );
      });
  }

  handleLostAntDetection(
    lostAntDetectionCircle: Phaser.GameObjects.GameObject,
    ant: Phaser.GameObjects.GameObject
  ) {
    if (this.environmentManager.getLostAnts().getChildren().length === 0) {
      return;
    }
    console.log("Ant circle: ", lostAntDetectionCircle);
    console.log("Ant: ", ant);
    const lostAntInstance = (lostAntDetectionCircle as DetectionCircle).parent;
    const antInstance = ant as Ant;
    (lostAntInstance as Ant).becomeFound(antInstance);
    this.antManager.addLostAnt(lostAntInstance as Ant);
    this.environmentManager.removeLostAnt(lostAntInstance as Ant);
    this.gameManager.incrementColonySize();
  }

  fireAntVision() {
    this.environmentManager
      .getFireAnts()
      .getChildren()
      .forEach((FireAnt) => {
        this.scene.physics.add.overlap(
          (FireAnt as FireAnt).getDetectionCircle(),
          this.antManager.getAnts(),
          this
            .handleFireAntVisionDetection as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          undefined,
          this
        );
      });
  }

  handleFireAntVisionDetection(
    fireAntDetectionCircle: Phaser.GameObjects.GameObject,
    ant: Phaser.GameObjects.GameObject
  ) {
    const fireAntInstance = (fireAntDetectionCircle as DetectionCircle).parent;
    const antInstance = ant as Ant;
    (fireAntInstance as FireAnt).senseAntInVisionRange(antInstance);
  }

  fireAntLungeSenses() {
    this.environmentManager
      .getFireAnts()
      .getChildren()
      .forEach((FireAnt) => {
        this.scene.physics.add.overlap(
          (FireAnt as FireAnt).getLungeCircle(),
          this.antManager.getAnts(),
          this
            .handleFireAntLungeDetection as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          undefined,
          this
        );
      });
  }

  handleFireAntLungeDetection(
    fireAntDetectionCircle: Phaser.GameObjects.GameObject,
    ant: Phaser.GameObjects.GameObject
  ) {
    const fireAntInstance = (fireAntDetectionCircle as DetectionCircle).parent;
    const antInstance = ant as Ant;
    (fireAntInstance as FireAnt).senseAntInLungeRange(antInstance);
  }

  fireAntAttackSenses() {
    this.environmentManager
      .getFireAnts()
      .getChildren()
      .forEach((FireAnt) => {
        this.scene.physics.add.overlap(
          (FireAnt as FireAnt).getAttackCircle(),
          this.antManager.getAnts(),
          this
            .handleFireAntAttackDetection as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
          undefined,
          this
        );
      });
  }

  handleFireAntAttackDetection(
    fireAntAttackCircle: Phaser.GameObjects.GameObject,
    ant: Phaser.GameObjects.GameObject
  ) {
    const fireAntInstance = (fireAntAttackCircle as DetectionCircle).parent;
    const antInstance = ant as Ant;
    (fireAntInstance as FireAnt).senseAntInAttackRange(antInstance);
  }
}

export default CollisionManager;
