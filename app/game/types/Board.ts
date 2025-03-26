export interface Tile {
    id: string;
    position: {
      row: number;
      col: number;
    };
    revealed: boolean;
    clicked?: boolean; // true if user clicked it
    isMine?: boolean; // true if this tile had a mine (after loss or cashout)
  }
  