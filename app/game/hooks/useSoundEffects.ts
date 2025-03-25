// hooks/useSoundEffects.ts

import useSound from "use-sound";

export const useSoundEffects = () => {
  const [playClick] = useSound("/sounds/click.wav", { volume: 0.4 });
  const [playWin] = useSound("/sounds/win.wav", { volume: 0.5 });
  const [playLose] = useSound("/sounds/fail.wav", { volume: 0.5 });

  return { playClick, playWin, playLose };
};
