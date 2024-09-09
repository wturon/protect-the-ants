export type Level = {
  scoreToComplete: number;
  ants: AntConfig;
  obstacles: Obstacle[];
  allowedWaypoints: number;
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
  numberOfAnts: number;
  spawnLocation: {
    x: number;
    y: number;
  };
};

// const screenWidth = GAME_CONFIG.width as number;
// const screenHeight = GAME_CONFIG.height as number;
const screenWidth = 600;
const screenHeight = 800;

export const LEVELS: Level[] = [
  {
    allowedWaypoints: 2,
    scoreToComplete: 10,
    ants: {
      spawnInterval: 500,
      speed: 200,
      numberOfAnts: 10,

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
    allowedWaypoints: 3,
    scoreToComplete: 20,
    ants: {
      spawnInterval: 500,
      speed: 200,
      numberOfAnts: 20,

      spawnLocation: {
        x: screenWidth - screenWidth / 4,
        y: screenHeight / 10,
      },
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
];
