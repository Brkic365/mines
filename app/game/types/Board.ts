export type Tile = {
    id: string;
    hasMine: boolean;
    revealed: boolean;
    opened: boolean;
    position: { row: number; col: number }
}