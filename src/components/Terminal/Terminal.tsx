import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import './terminal.css';
import { type Line, type TermApi, INK, MUT, DIM } from './types';
import { run } from './commands';

/* ─────────────────────────────────────────────────────────────────────────────
   ARCADE DISABLED FOR THIS BUILD.
   The `games` command, the game pane, the GameHost engine, `arcade.ts`, and
   `games/*` were removed (see docs/superpowers/plans/2026-09-08-portfolio-
   astro-build.md §9–§10 for the full spec). To bring games back:
     1. restore src/components/Terminal/{GameHost.ts,arcade.ts,games/**} and
        the Game* interfaces in types.ts,
     2. re-add `openArcade` / `launchGame` to the TermApi object below,
        the game-pane JSX, and the `f` / `p` / arrow key wiring,
     3. re-add the `games` / `<game>` branches to commands.ts `dispatch`.
   The terminal keeps its info commands + `hack`.
   ──────────────────────────────────────────────────────────────────────────── */

const BOOT: Line[] = [
  { text: 'rajesh@portfolio — Senior Frontend Engineer · React / Next.js', color: INK },
  { text: "type 'help' for commands", color: MUT },
  { text: '', color: DIM },
];

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(() => [...BOOT]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histPos, setHistPos] = useState(-1);
  const [title, setTitle] = useState('zsh');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const hackTimersRef = useRef<number[]>([]);

  const clearHackTimers = useCallback(() => {
    hackTimersRef.current.forEach((id) => clearTimeout(id));
    hackTimersRef.current = [];
  }, []);

  const openTerminal = useCallback(() => {
    setOpen((was) => {
      if (was) return was;
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      return true;
    });
  }, []);

  const closeTerminal = useCallback(() => {
    clearHackTimers();
    setOpen(false);
    document.body.style.overflow = '';
    returnFocusRef.current?.focus?.();
  }, [clearHackTimers]);

  // TermApi handed to the command router (`run`). `startHack` owns the ~420ms
  // staggered printing so its timers stay cancellable from here.
  const api = useMemo<TermApi>(
    () => ({
      print: (newLines: Line[]) => setLines((l) => [...l, ...newLines]),
      clear: () => setLines([]),
      setTitle: (t: string) => setTitle(t),
      startHack: (hlines: Line[]) => {
        clearHackTimers();
        if (hlines.length === 0) return;
        setLines((l) => [...l, hlines[0]]);
        const ids: number[] = [];
        for (let i = 1; i < hlines.length; i += 1) {
          const idx = i;
          ids.push(
            window.setTimeout(() => {
              setLines((l) => [...l, hlines[idx]]);
            }, 420 * idx),
          );
        }
        hackTimersRef.current = ids;
      },
    }),
    [clearHackTimers],
  );

  const runCmd = useCallback(
    (value: string) => {
      run(value, api, { history });
    },
    [api, history],
  );

  const submit = useCallback(
    (value: string) => {
      runCmd(value);
      const trimmed = value.trim();
      if (trimmed) setHistory((h) => [...h, trimmed]);
      setHistPos(-1);
    },
    [runCmd],
  );

  // clear pending hack timers on unmount.
  useEffect(
    () => () => {
      clearHackTimers();
    },
    [clearHackTimers],
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // window keydown: `~` / backtick opens when closed; Escape closes.
  useEffect(() => {
    const onKeyWin = (e: KeyboardEvent) => {
      if (e.key === '~' || e.key === '`') {
        const tag = (e.target as HTMLElement | null)?.tagName || '';
        if (!open && !/^(input|textarea|select)$/i.test(tag)) {
          e.preventDefault();
          openTerminal();
        }
        return;
      }
      if (open && e.key === 'Escape') {
        e.preventDefault();
        closeTerminal();
      }
    };
    const onOpenEvent = () => openTerminal();
    window.addEventListener('keydown', onKeyWin);
    window.addEventListener('rk:open-terminal', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKeyWin);
      window.removeEventListener('rk:open-terminal', onOpenEvent);
    };
  }, [open, openTerminal, closeTerminal]);

  // after paint on open: focus input, scroll log to bottom.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      const s = scrollRef.current;
      if (s) s.scrollTop = s.scrollHeight;
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // auto-scroll on new lines.
  useEffect(() => {
    const s = scrollRef.current;
    if (s) s.scrollTop = s.scrollHeight;
  }, [lines]);

  const onPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return;
    const panel = panelRef.current;
    if (!panel) return;
    const els = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
    if (els.length === 0) return;
    const first = els[0];
    const last = els[els.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(input);
      setInput('');
      return;
    }
    if (e.key === 'ArrowUp') {
      if (history.length === 0) return;
      e.preventDefault();
      const next = histPos === -1 ? history.length - 1 : Math.max(0, histPos - 1);
      setHistPos(next);
      setInput(history[next]);
      return;
    }
    if (e.key === 'ArrowDown') {
      if (history.length === 0 || histPos === -1) return;
      e.preventDefault();
      const next = histPos + 1;
      if (next >= history.length) {
        setHistPos(-1);
        setInput('');
      } else {
        setHistPos(next);
        setInput(history[next]);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="rk-term-backdrop">
      <div
        className="rk-term"
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        tabIndex={-1}
        ref={panelRef}
        onKeyDown={onPanelKeyDown}
      >
        <div className="rk-term__bar">
          <div className="rk-term__title">rajesh@portfolio:~ — {title}</div>
          <div className="rk-term__btns">
            <button type="button" onClick={() => runCmd('help')}>
              help
            </button>
            <button type="button" onClick={() => runCmd('clear')}>
              clear
            </button>
            <button type="button" onClick={closeTerminal}>
              esc
            </button>
          </div>
        </div>

        <div className="rk-term__scroll" ref={scrollRef}>
          {lines.map((l, i) => (
            <div className="rk-term__line" key={i} style={{ color: l.color }}>
              {l.text}
            </div>
          ))}
        </div>

        <div className="rk-term__input" onClick={focusInput}>
          <span className="rk-term__prompt">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="help"
            spellCheck={false}
            autoComplete="off"
            className="rk-term__field"
          />
          <span className="rk-term__caret caret" />
        </div>
      </div>
    </div>
  );
}
