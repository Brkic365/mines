import { redis } from "./redis";
import { Game } from '@/app/game/types/Game';

export async function saveGame(gameId: string, data: any) {
  await redis.set(`game:${gameId}`, data);
}

export async function getGame(gameId: string): Promise<Game | null> {
  const raw = await redis.get<Game>(`game:${gameId}`);

  try {
    return raw;
  } catch (err) {
    console.error("Failed to parse game from Redis:", err, raw);
    return null;
  }
}