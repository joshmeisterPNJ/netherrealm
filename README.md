# netherRealm

Electronic music venues in London, Paris, Berlin and Amsterdam — as living organisms.
Tap a city and its tentacles push the others out, splitting into venue bubbles.
Bubble **size** = capacity. Bubble **darkness** = how far from commercial it sits —
light is commercial, dark is niche or industrial.

## Editing the data

Everything lives in two files. Change them, rebuild, done.

- `data/cities.json` — one entry per city: hue, saturation, and the `lightLo` → `lightHi`
  ramp. `rim: true` gives a cold edge light (Berlin needs it, being black on black).
- `data/venues.json` — one flat object per venue:

```json
{
  "id": "corsica",
  "city": "london",
  "name": "Corsica Studios",
  "area": "Elephant & Castle",
  "intensity": 4,
  "cap": 400,
  "hours": "Fri–Sat 22:00–06:00",
  "line": "one line you'd say to a friend",
  "note": "the longer description",
  "tags": ["heavy", "techno"],
  "rooms": [{ "name": "Room 2", "intensity": 4, "note": "smaller, weirder" }],
  "nights": ["Saturday — house & techno"],
  "links": { "web": "", "ra": "", "map": "" },
  "status": "open",
  "draft": true
}
```

`status` is `open`, `unsure` or `closed`. `draft: true` marks a venue as unverified —
it renders with a dashed amber ring until the text and intensity are yours.

## Build

```sh
node build.mjs
```

Two targets from one source (`src/app.html`):

| Output | For | Storage |
|---|---|---|
| `dist/nightform.html` | Claude Artifact (fragment) | syncs across your devices |
| `docs/index.html` | GitHub Pages (standalone) | per-device `localStorage` |

## Deploy to GitHub Pages

```sh
git remote add origin git@github.com:joshmeisterPNJ/netherrealm.git
git push -u origin main
```

Then: repo **Settings → Pages → Source: Deploy from a branch → `main` / `/docs`**.
Live at `https://joshmeisterpnj.github.io/netherrealm/` within a minute or two.

On iPhone, open it in Safari and **Share → Add to Home Screen** — it installs
fullscreen with its own icon, no browser chrome.
