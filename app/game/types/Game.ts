// types/Game.ts

// Server side
export interface Config {
    rows: number;
    cols: number;
    minesCount: number;
    nonce: number;
  }
  
  // Client side
  export interface StartGameRequest {
    clientSeed: string;
    rows: number;
    cols: number;
    minesCount: number;
    nonce: number;
    betAmount: number;
  }
  
  // Server side
  export interface Game {
    clientSeed: string;
    serverSeed: string;
    finalSeed: string;
    serverSeedHash: string;
    mineIndices: number[];
    config: Config;
  }
  