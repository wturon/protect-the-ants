export type Level = {
  name: string;
  ants: AntConfig;
  lostAnts?: LostAnts[];
  obstacles: Obstacle[];
  allowedWaypoints: number;
  fireAntConfig?: FireAntConfig;
};
type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AntConfig = {
  spawnInterval: number;
  speed: number;
  spawnLocation: {
    x: number;
    y: number;
  };
};

type LostAnts = {
  x: number;
  y: number;
  detectionRadius: number;
};

type FireAntConfig = {
  health: number;
  visionRange: number;
  attackDamage: number;
  speed: number;
  startingFireAnts: {
    x: number;
    y: number;
  }[];
};

// const screenWidth = GAME_CONFIG.width as number;
// const screenHeight = GAME_CONFIG.height as number;
const screenWidth = 600;
const screenHeight = 800;
const globalAntSpeed = 100;

export const LEVELS: Level[] = [
  {
    name: "Level 1",
    allowedWaypoints: 2,
    ants: {
      spawnInterval: 500,
      speed: globalAntSpeed,
      spawnLocation: {
        x: screenWidth - screenWidth / 4,
        y: screenHeight / 10,
      },
    },

    obstacles: [
      {
        x: screenWidth / 2, // Center horizontally
        y: screenHeight / 2, // Center vertically
        width: 300,
        height: 10,
      },
    ],
  },
  {
    name: "Level 2",
    allowedWaypoints: 5,
    ants: {
      spawnInterval: 500,
      speed: globalAntSpeed,

      spawnLocation: {
        x: screenWidth - screenWidth / 4,
        y: screenHeight / 10,
      },
    },
    fireAntConfig: {
      health: 100,
      visionRange: 10,
      attackDamage: 20,
      speed: 60,
      startingFireAnts: [
        { x: 200, y: 200 },
        { x: 300, y: 300 },
      ],
    },
    obstacles: [
      {
        x: screenWidth / 2 - 100, // Center horizontally
        y: screenHeight / 2 - 50, // Center vertically
        width: 450,
        height: 10,
      },
      {
        x: screenWidth / 2 + 150, // Center horizontally
        y: screenHeight / 2 + 50, // Center vertically
        width: 450,
        height: 10,
      },
    ],
  },
  {
    name: "Level 3",
    allowedWaypoints: 10,
    ants: {
      spawnInterval: 500,
      speed: globalAntSpeed,
      spawnLocation: {
        x: screenWidth - screenWidth / 4,
        y: screenHeight / 10,
      },
    },
    lostAnts: [
      {
        x: 100,
        y: 400,
        detectionRadius: 100,
      },
    ],
    fireAntConfig: {
      health: 100,
      visionRange: 10,
      attackDamage: 20,
      speed: 60,
      startingFireAnts: [{ x: 300, y: 400 }],
    },
    obstacles: [
      {
        x: screenWidth / 2 - 100, // Center horizontally
        y: screenHeight / 2 + 100, // Center vertically
        width: 450,
        height: 10,
      },
    ],
  },
];
