import Phaser from "phaser";

class DebugUtility {
  private scene: Phaser.Scene;
  private debugText: Phaser.GameObjects.Text | null = null;
  private debugMode: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  enableDebugMode() {
    this.debugMode = true;
    this.debugText = this.scene.add.text(10, 500, "", {
      font: "16px Arial",
      color: "rgba(0, 0, 0, 0.5)",
    });
  }

  updateDebugInfo(instance: any) {
    if (!this.debugMode || !this.debugText) return;

    const properties = Object.keys(instance)
      .map((key) => `${key}: ${instance[key]}`)
      .join("\n");

    this.debugText.setText(properties);
  }
}

export default DebugUtility;
