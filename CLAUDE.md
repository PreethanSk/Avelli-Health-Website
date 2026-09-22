@AGENTS.md

## Project notes

- Fully static site: `next.config.ts` sets `output: "export"`, so `npm run build` writes to `out/`. Don't use features that need a server (API routes, server actions, ISR, the default image optimizer).
- Project skills live in `.claude/skills/` (installed via `npx skills`, tracked in `skills-lock.json`).
- `design-references/<brand>/DESIGN.md` is the awesome-design-md library (VoltAgent, MIT). Once a direction is picked, copy that brand's DESIGN.md to the project root as the active design system.
