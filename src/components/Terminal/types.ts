export interface Line {
  text: string;
  color: string;
}

export const INK: string = 'var(--color-text)';
export const MUT: string = 'var(--color-neutral-400)';
export const DIM: string = 'var(--color-neutral-600)';
export const ACC: string = 'var(--color-accent-300)';
export const ERR: string = 'var(--color-accent-2-400)';

/**
 * Callbacks the command router (`commands.ts` → `run`) needs from the Terminal
 * island. `startHack` owns the ~420ms timed printing of the `hack` sequence so
 * its timers stay cancellable from the island (on close / unmount).
 */
export interface TermApi {
  print(lines: Line[]): void;
  clear(): void;
  setTitle(t: string): void;
  startHack(lines: Line[]): void;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ARCADE DISABLED FOR THIS BUILD. The GameHost / GameController / GameModule /
   GameMeta / Dir shapes (spec §9.4) lived here alongside the game modules that
   were removed. Restore them together — see the note in Terminal.tsx.
   ──────────────────────────────────────────────────────────────────────────── */
