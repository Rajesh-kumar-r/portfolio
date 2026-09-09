import {
  type Line,
  type TermApi,
  INK,
  MUT,
  DIM,
  ACC,
  ERR,
} from './types';
import {
  PROJECTS,
  SKILLS,
  ROLES,
  CONTACT,
  EXPERIENCE_META,
} from '../../data/resume';
import { RESUME_URL, RESUME_PREVIEW_URL } from '../../consts';

// ARCADE DISABLED FOR THIS BUILD — the `games` / `<game>` command branches and
// the `resolveGame` import were removed (see the note in Terminal.tsx).

export type Handled = 'clear' | 'hack' | 'resume' | 'normal';

export interface DispatchResult {
  lines: Line[];
  handled: Handled;
}

const HACK_LINES: Line[] = [
  { text: '$ ssh root@mainframe.rajesh.dev', color: ACC },
  { text: 'bypassing firewall ......... [ ok ]', color: MUT },
  { text: 'brute-forcing 4096-bit key .. [ ok ]', color: MUT },
  { text: 'decrypting /var/secrets ..... [ ok ]', color: MUT },
  { text: 'ACCESS GRANTED', color: INK },
  { text: 'reading classified payload...', color: MUT },
  { text: '  → 41 unread Jira tickets', color: DIM },
  { text: '  → one TODO from 2019, still valid', color: DIM },
  { text: '  → a CSS file named final-final-v2.scss', color: DIM },
  {
    text: 'the mainframe was a Raspberry Pi under the desk. it is now unplugged.',
    color: ACC,
  },
  { text: '', color: DIM },
];

const END: Line = { text: '', color: DIM };

function projectLines(arg: string | undefined): Line[] {
  const n = arg ? Number.parseInt(arg, 10) : NaN;
  if (Number.isInteger(n) && n >= 1 && n <= PROJECTS.length) {
    const p = PROJECTS[n - 1];
    return [
      { text: '#' + n + ' ' + p.title, color: INK },
      { text: '  • ' + p.body, color: MUT },
      { text: '  • Tech Stack: ' + p.tech.join(', '), color: DIM },
      END,
    ];
  }
  const out: Line[] = PROJECTS.map((p, i) => ({
    text: '#' + (i + 1) + '  ' + p.title,
    color: MUT,
  }));
  out.push({ text: "run 'projects 2' for detail", color: DIM });
  out.push(END);
  return out;
}

function helpLines(): Line[] {
  return [
    { text: 'commands', color: INK },
    {
      text: '  about  projects  skills  experience  contact  resume  now',
      color: MUT,
    },
    { text: '  whoami  echo  pwd  date  clear', color: MUT },
    { text: "  'projects 3' for detail · not everything is listed", color: DIM },
    END,
  ];
}

function skillsLines(): Line[] {
  const out: Line[] = [];
  for (const g of SKILLS) {
    out.push({ text: g.label + ':', color: INK });
    out.push({ text: '  ' + g.items.join(', '), color: MUT });
  }
  out.push(END);
  return out;
}

function experienceLines(): Line[] {
  const out: Line[] = [
    {
      text:
        EXPERIENCE_META.company +
        ' — ' +
        EXPERIENCE_META.total +
        ' · Karur, Tamil Nadu',
      color: INK,
    },
  ];
  for (const r of ROLES) {
    out.push({
      text:
        '  ' + r.when + '  ' + r.title + ' (' + r.span + ', ' + r.mode + ')',
      color: MUT,
    });
  }
  out.push(END);
  return out;
}

function contactLines(): Line[] {
  return [
    { text: 'email     ' + CONTACT.email, color: INK },
    {
      text: 'linkedin  ' + CONTACT.linkedin.replace('https://www.', ''),
      color: INK,
    },
    { text: 'github    ' + CONTACT.github.replace('https://', ''), color: INK },
    END,
  ];
}

/**
 * Pure command core. Given a raw input line, returns the echo + output lines and
 * a tag telling the island which side-effect (if any) to run. No DOM, no timers.
 * The `hack` lines are returned all at once here; the timed printing is the
 * island's job (`TermApi.startHack`).
 */
export function dispatch(
  raw: string,
  _ctx: { history: string[] },
): DispatchResult {
  const cmd = raw.trim();

  if (cmd === '') {
    return {
      lines: [{ text: 'rajesh@portfolio $', color: ACC }],
      handled: 'normal',
    };
  }

  const echo: Line = { text: 'rajesh@portfolio $ ' + cmd, color: ACC };
  const parts = cmd.toLowerCase().split(/\s+/);
  const token = parts[0];

  switch (token) {
    case 'help':
      return { lines: [echo, ...helpLines()], handled: 'normal' };

    case 'games':
    case 'arcade':
      return {
        lines: [
          echo,
          { text: 'no arcade in this build.', color: MUT },
          END,
        ],
        handled: 'normal',
      };

    case 'whoami':
      return {
        lines: [
          echo,
          {
            text:
              'rajesh kumar r · senior frontend engineer · full-stack contributor',
            color: INK,
          },
          END,
        ],
        handled: 'normal',
      };

    case 'about':
      return {
        lines: [
          echo,
          {
            text:
              '7+ years building modern web applications with React.js and Next.js;',
            color: MUT,
          },
          {
            text:
              'led 2+ large-scale applications end to end, improving performance and',
            color: MUT,
          },
          { text: 'user engagement.', color: MUT },
          {
            text: 'Extending frontend expertise into full-stack delivery.',
            color: MUT,
          },
          END,
        ],
        handled: 'normal',
      };

    case 'projects':
    case 'work':
    case 'ls':
      return { lines: [echo, ...projectLines(parts[1])], handled: 'normal' };

    case 'skills':
    case 'stack':
      return { lines: [echo, ...skillsLines()], handled: 'normal' };

    case 'experience':
      return { lines: [echo, ...experienceLines()], handled: 'normal' };

    case 'contact':
      return { lines: [echo, ...contactLines()], handled: 'normal' };

    case 'resume':
      return {
        lines: [
          echo,
          { text: 'resume.pdf — opening download…', color: MUT },
          { text: RESUME_URL, color: ACC },
          { text: 'preview — ' + RESUME_PREVIEW_URL, color: DIM },
          END,
        ],
        handled: 'resume',
      };

    case 'now':
      return {
        lines: [
          echo,
          {
            text:
              'Deeper into full-stack and AI-assisted delivery. Open to senior frontend roles.',
            color: MUT,
          },
          END,
        ],
        handled: 'normal',
      };

    case 'echo': {
      const rest = cmd.slice(cmd.indexOf(' ') + 1);
      return {
        lines: [echo, { text: token === cmd ? '' : rest, color: INK }, END],
        handled: 'normal',
      };
    }

    case 'pwd':
      return {
        lines: [echo, { text: '/home/rajesh/portfolio', color: INK }, END],
        handled: 'normal',
      };

    case 'date':
      return {
        lines: [
          echo,
          { text: new Date().toString(), color: INK },
          END,
        ],
        handled: 'normal',
      };

    case 'sudo':
      return {
        lines: [echo, { text: 'nice try.', color: ACC }, END],
        handled: 'normal',
      };

    case 'exit':
    case 'q':
      return {
        lines: [
          echo,
          {
            text: 'you cannot exit a portfolio. scroll instead.',
            color: MUT,
          },
          END,
        ],
        handled: 'normal',
      };

    case 'hack':
      return { lines: [echo, ...HACK_LINES], handled: 'hack' };

    case 'clear':
      return { lines: [echo], handled: 'clear' };

    default:
      return {
        lines: [
          echo,
          { text: token + ': command not found. try help', color: ERR },
          END,
        ],
        handled: 'normal',
      };
  }
}

/**
 * Impure wrapper around `dispatch`. Calls the matching `TermApi` side-effect for
 * the `handled` tag. The echo line is always surfaced so the user sees what they
 * typed. `hack`'s timed printing is delegated to `api.startHack` (island-owned,
 * cancellable) — `run` itself schedules no timers.
 */
export function run(
  raw: string,
  api: TermApi,
  ctx: { history: string[] },
): void {
  const result = dispatch(raw, ctx);
  const echo = result.lines[0];

  switch (result.handled) {
    case 'clear':
      api.print([echo]);
      api.clear();
      return;

    case 'hack':
      api.startHack(result.lines);
      return;

    case 'resume':
      api.print(result.lines);
      window.open(RESUME_URL, '_blank', 'noopener');
      return;

    default:
      api.print(result.lines);
  }
}
