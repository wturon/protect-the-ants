type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type Level = {
  ants: AntConfig;
  obstacles: Obstacle[];
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
    ants: {
      spawnInterval: 1000,
      speed: 75,
      numberOfAnts: 20,
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
        height: 20,
      },
    ],
  },
];
