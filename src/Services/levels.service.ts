type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type Level = {
  ants: number;
  obstacles: Obstacle[];
};

// const screenWidth = GAME_CONFIG.width as number;
// const screenHeight = GAME_CONFIG.height as number;
const screenWidth = 600;
const screenHeight = 800;

export const LEVELS: Level[] = [
  {
    ants: 10,
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
