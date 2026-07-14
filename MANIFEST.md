# RoutePilot export manifest

This manifest defines the smallest complete RoutePilot feature slice to publish. Keep the destination paths unchanged so imports and tests continue to resolve. Walkthrough media stays on the live portfolio and is referenced with absolute HTTPS URLs.

## Repository documents

| Destination | Source | Purpose |
| --- | --- | --- |
| `README.md` | `work/github-exports/ai-inbound-lead-routing/README.md` | Project overview, architecture, decisions, safeguards, and local usage |
| `MANIFEST.md` | `work/github-exports/ai-inbound-lead-routing/MANIFEST.md` | Upload plan and provenance |

## Application source

All source paths below are relative to `work/site-source/`.

| Destination | Source | Purpose |
| --- | --- | --- |
| `app/work/inbound-lead-routing/page.tsx` | `app/work/inbound-lead-routing/page.tsx` | Route metadata and case-study page |
| `app/work/inbound-lead-routing/InboundLeadRoutingDemo.tsx` | `app/work/inbound-lead-routing/InboundLeadRoutingDemo.tsx` | Interactive, browser-local workflow |
| `app/work/inbound-lead-routing/routing-model.mjs` | `app/work/inbound-lead-routing/routing-model.mjs` | Deterministic enrichment, classification, value, routing, drafting, and SLA logic |
| `app/work/inbound-lead-routing/page.module.css` | `app/work/inbound-lead-routing/page.module.css` | Route-scoped responsive and accessible styling |
| `tests/inbound-lead-routing.test.mjs` | `tests/inbound-lead-routing.test.mjs` | Focused behavior, safeguard, and accessibility tests |

## Walkthrough media

The user-controlled walkthrough and poster are served from `https://prasiddhakarki.online/demos/` and referenced directly by `page.tsx`. They are intentionally not duplicated in this lightweight source repository.

## Standalone repository scaffold

The files above are the RoutePilot-specific package. For an independently clonable repository, add a minimal Next.js App Router scaffold with:

- `package.json` declaring Node.js 22.13+, Next.js 16, React 19, React DOM 19, and TypeScript.
- One lockfile (prefer `pnpm-lock.yaml`).
- `tsconfig.json`, Next.js/Vinext configuration, and the chosen deployment configuration.
- `app/layout.tsx` plus any global stylesheet needed by the host shell.
- A root page or adjust the RoutePilot header/footer links that currently point to `/`.

Do not copy unrelated portfolio routes, credentials, generated build directories, runtime logs, or environment files.

## Pre-publish check

1. Upload the application source and focused test with their paths preserved.
2. Add the minimal host scaffold if this will be a standalone clone.
3. Run `node --test tests/inbound-lead-routing.test.mjs`.
4. Start the app and open `/work/inbound-lead-routing`.
5. Confirm the three built-in scenarios, local JSON download, copy actions, responsive layout, video playback, and human-review SLA.
6. Confirm no real contact data, credentials, environment files, or external adapters are included.
