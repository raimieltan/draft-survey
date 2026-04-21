# draft-survey

Draft survey calculator for bulk carriers. Computes net cargo loaded from draft readings, hydrostatic tables, trim, and water-density corrections. Built for chief officers and independent marine surveyors.

## What a draft survey is

A draft survey weighs cargo by measuring a ship's drafts at six points (fwd / mid / aft, port / stbd) before and after loading. The change in displacement — corrected for trim, water density, and onboard consumables — equals the cargo loaded. Most surveyors currently do this in an Excel workbook on a thumb drive. This tool replaces that workflow.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind 4
- `xlsx` for importing hydrostatic tables from stability booklets
- Zero-dependency calc engine (`src/lib/hydro.ts`)

## Calc pipeline

1. **Mark correction** — draft readings adjusted to perpendiculars using LBM and mark offsets
2. **First trim correction** — standard MCTC-based displacement adjustment
3. **Nemoto second trim correction** — accounts for LCF shift at heavy trims
4. **Density correction** — scales displacement for actual water density vs. table reference
5. **Net cargo** — subtract deductibles (FO, DO, FW, ballast, constants) and light ship

Per-voyage final cargo = `net(final) − net(initial)`.

## Design decisions

- **Offline-first, single-user.** No accounts, no sync. Lives on the officer's machine.
- **Ship-first data model.** Every survey belongs to a ship that owns its own hydrostatic table and draft-mark distances.
- **Three-stage flow.** Initial → Interim → Final, with per-stage mid-mark overrides.
- **Deck-usable UI.** Large inputs, high-contrast dark mode, decimal keypad on touch devices, input validation against hydro-table range.

## Roadmap

Target packaging is a Tauri desktop bundle (Windows `.exe`, macOS `.app`, Linux AppImage) with SQLite storage so the whole dataset is one portable file. See `FEATURES.md` for the full scope.

## Local dev

```bash
npm install
npm run dev
```
