# Deploying rajesh.fyi

Static Astro build hosted on **Cloudflare Pages**, apex domain `rajesh.fyi`.

## Cloudflare Pages project settings

| Setting                | Value                          |
| ---------------------- | ------------------------------ |
| Framework preset       | Astro (or "None")              |
| Build command          | `npm run build`                |
| Build output directory | `dist`                         |
| Root directory         | `/`                            |
| Node version           | `20` — pinned by `.nvmrc`; also set `NODE_VERSION=20` in the build env if Pages ignores the file |

The build is fully static (`output: 'static'`). No functions, no server runtime.
`sharp` is a devDependency used **only** by `npm run gen:icons`, which is not part
of `astro build` or CI — nothing native needs to compile on Pages.

## Environment variables (Pages dashboard → Settings → Environment variables)

| Name                      | Scope           | Notes |
| ------------------------- | --------------- | ----- |
| `PUBLIC_CF_BEACON_TOKEN`  | Production      | Cloudflare Web Analytics site token — **cookieless**, no consent banner needed. Set it in the **Pages dashboard → Settings → Environment variables** (Production scope). When set, `Base.astro` emits the `<script … beacon.min.js data-cf-beacon>` tag; when unset, no beacon ships. Get the token from **Cloudflare dashboard → Web Analytics → your site → JS snippet** (the `token` value). Leave it unset in Preview deploys if you don't want preview traffic counted. |

Any other build-time var must be prefixed `PUBLIC_` to be readable in client code
(`import.meta.env.PUBLIC_*`).

## DNS / redirects

- `rajesh.fyi` (apex) → the Pages project (CNAME-flattened / Pages custom domain).
- `www.rajesh.fyi` → **301 redirect to the apex**. Add a Cloudflare **Bulk Redirect**
  or a Redirect Rule: `www.rajesh.fyi/*` → `https://rajesh.fyi/$1`, status 301,
  preserve path + query. The site's canonical URLs, sitemap, and OG tags are all
  apex-absolute (`https://rajesh.fyi/…`), so `www` must not serve content directly.

## `public/_headers`

Copied verbatim to `dist/_headers` and applied by Pages:

- `/_astro/*` → `Cache-Control: public, max-age=31536000, immutable` (content-hashed assets).
- `/*` → `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy: geolocation=(), microphone=(), camera=()`, and a Content-Security-Policy.

### CSP `'unsafe-inline'` trade-off (known)

`script-src` includes `'unsafe-inline'`. The page ships several inline scripts with
no external file — the theme-boot snippet (must execute before first paint to avoid
a flash), the theme toggle, the Work carousel, the terminal-CTA focus handoff, and
the JSON-LD `Person` block. The only allowed remote script is the Cloudflare Web
Analytics beacon (`static.cloudflareinsights.com`); `connect-src` allows the beacon's
reporting endpoint (`cloudflareinsights.com`).

Tightening to hashes or a nonce is a deliberate future step: nonces need a dynamic
response (Pages Functions / `_middleware`), and hashes need a build step that
extracts every inline script's SHA-256 into the header. Not worth it yet for a
static personal site with a tiny, audited inline-script surface.

The résumé link is a plain top-level `<a href="https://drive.google.com/…">`
navigation (plus a `window.open` from the terminal `resume` command). Top-level
navigation is not governed by `default-src` / `connect-src`, so **no CSP entry for
`drive.google.com` is needed** and none is added.

## OG image (`public/og.png`) — manual step

`Base.astro` references `https://rajesh.fyi/og.png` (1200×630) in `og:image` /
`twitter:image`. The file is **not** in the repo yet — a missing public file that is
only named in a `<meta>` tag does not break the build.

To produce it:

1. Author `og.dc.html` in the Claude Design project (**Task 26**).
2. Export the canvas PNG at **exactly 1200×630** to `public/og.png`.
3. Rebuild (`npm run build`) and redeploy. Validate with
   <https://cards-dev.twitter.com/validator> and the Facebook Sharing Debugger.

## Favicons (`npm run gen:icons`) — manual step

`public/favicon.svg` is the source of truth (a `~` glyph on the brand square).
The raster set is generated from it and committed:

```
npm run gen:icons
```

Writes `public/favicon.ico` (a real multi-size ICO wrapping 16×16 + 32×32 PNG
payloads — `sharp` has no ICO encoder, so `scripts/gen-icons.mjs` hand-writes the
ICONDIR; adds no npm dependency), plus `public/favicon-16.png`,
`public/favicon-32.png`, and `public/apple-touch-icon.png` (180×180, flattened on
`#161826` for iOS). **Re-run it after any edit to `favicon.svg`** and commit the
regenerated files. It is intentionally not wired into `astro build` or CI, to keep
the build deterministic and `sharp` off the deploy path.

## Local build parity

```
nvm use            # Node 20 (from .nvmrc)
npm ci
npm run check      # 0 errors
npm test           # 195 passing
npm run build      # -> dist/
npm run preview    # serve dist/ locally
```

## Verification

### Automated — green as of Task 27

| Gate            | Command           | Result                                   |
| --------------- | ----------------- | ---------------------------------------- |
| Unit tests      | `npm test`        | **195 / 195 passing** (13 files, vitest) |
| Type / a11y     | `npm run check`   | **0 errors, 0 warnings, 0 hints** (54 files) |
| Production build | `npm run build`  | **clean** — 3 pages, sitemap emitted, no warnings |

`dist/` spot-check (Task 27): `dist/index.html` has exactly one `<h1>`, one
`<astro-island … client="idle">` (the Terminal), the four audited inline
`<script>` blocks + the JSON-LD block, and **zero** `fonts.googleapis.com`
references (Inter + JetBrains Mono are self-hosted via `@fontsource` and bundled
into `/_astro/`). `dist/404.html` carries `<meta name="robots" content="noindex">`
(emitted by `Base.astro` via its `noindex` prop — the 404 route is the only caller).

### Responsive / reduced-motion (static review — Task 27)

The layout is intentionally breakpoint-light: `clamp()`, `flex-wrap`, and
`grid auto-fit / minmax()` do the work. A static walk of every section at 360px
and 768px CSS px found **no horizontal overflow and no unreadable collapse**, so
no new `@media` rules were added. `portfolio.css` keeps its single `@media`
(`prefers-reduced-motion`); `terminal.css` keeps its own caret guard.

Reduced-motion coverage (all gated):

| Animated path                              | Gate                                                             |
| ----------------------------------------- | --------------------------------------------------------------- |
| `.term-cta__caret` blink (page CTA)       | global `@media (prefers-reduced-motion){ * { animation-* } }`  |
| `.rk-term__caret` blink (terminal)        | same global rule **+** `terminal.css` `.rk-term .caret{animation:none}` |
| `html { scroll-behavior: smooth }`        | `html { scroll-behavior: auto !important }` in the same block   |
| Work carousel `scrollTo({ behavior })`    | JS `matchMedia('(prefers-reduced-motion: reduce)')` → `'auto'`  |
| Games (fixed-timestep ASCII render)       | `GameHost.reducedMotion` exposed; games use no screen-shake / particles / CSS transitions, so nothing to suppress |

### Manual browser pass — still required (no headless browser in CI)

Run `npm run preview` and verify on a real browser + a 360 / 768 viewport:

- [ ] **Lighthouse** on `/` — target ≥95 performance / 100 a11y / 100 best-practices / 100 SEO. Record the numbers.
- [ ] **Every game to a win and a loss** — career-dungeon, snake, 2048, tetris, dino, pong, minesweeper, chess, space, typing.
- [ ] **Terminal open/close** — `~` from top / mid / bottom scroll; CTA button; `Esc` and the header `esc` button; **focus trap** holds inside the modal; focus **returns to the invoker** on close; body scroll locked while open.
- [ ] **Carousel sync** — arrows, dots, and manual scroll all keep the `NN / NN` label and active dot in agreement.
- [ ] **Theme** — no flash on load in both OS colour-scheme settings; every section audited in light + dark; the terminal and games stay dark in light mode.
- [ ] **Reduced-motion** — enable the OS setting and re-check: both carets stop blinking, in-page anchor jumps are instant, carousel arrows jump without smooth-scroll.
- [ ] **Terminal commands** — `hack` prints with the staggered ~420ms cadence; `games` reshuffles the menu; `games all` lists ten; an unlisted game name still launches.
- [ ] **Mobile** — 360 and 768 CSS px: header wraps cleanly, hero holds, carousel card fills the viewport, skills/experience rows stack, now/contact collapses to one column, the game `<pre>` is legible and the d-pad is reachable.

## Known trade-offs

- **CSP `'unsafe-inline'`** on `script-src` — see the section above. Deliberate for a
  static site with a small audited inline-script surface; tightening needs a build-time
  hash step or a dynamic (Functions) response.
- **`public/og.png`** is not committed — authored/exported separately (Task 26). A
  missing file named only in a `<meta>` tag does not break the build; social cards
  render without an image until it lands.
- **Favicons** (`npm run gen:icons`) and the OG export are intentionally off the
  `astro build` / CI path to keep the build deterministic and `sharp` off the deploy.
