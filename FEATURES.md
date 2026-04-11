# Draft Survey — Feature List

Offline-first desktop tool for individual seamen. No accounts, no cloud. Install once, use forever.

## Scope decisions

- **No auth.** Single-user local app. One machine, one user, one data file.
- **Offline-only** for v1. Everything runs on the device. No sync, no servers.
- **Ships as first-class records.** Every survey belongs to a ship that owns its own hydrostatic table and draft-mark distances.
- **Distributed as a desktop binary** (`.exe` on Windows, `.app` on macOS, AppImage on Linux). Not a website.

---

## MVP feature set

### Ship library
- [ ] Create / edit / delete ships
- [ ] Ship record fields: name, IMO, flag, port of registry, LBP, beam, LOA, light ship, summer draft, summer displacement, FWA
- [ ] Draft-mark distances per ship: fwd / mid / aft offset to perpendiculars, LBM
- [ ] Per-stage mark distances (Initial / Interim / Final) — mid offset often differs between stages
- [ ] Hydrostatic table (draft, disp, TPC, LCF, MCTC, LCB) stored alongside the ship
- [ ] **Import ship from xlsx**: parse `hydro` + `data` sheets from a stability booklet export (reuse the parser already written against the WARRAMBOO workbook)
- [ ] Manual hydro table entry (paste from CSV) for ships without a workbook

### Surveys
- [ ] Voyage container: voyage number, port, date, cargo type, notes
- [ ] Three stages per voyage: Initial, Interim, Final
- [ ] Per-stage inputs: 6 draft readings, water density, deductibles (FO, DO, FW, ballast, others, constant)
- [ ] Per-stage auto-calculation: mark correction → trim corrections (1st + Nemoto 2nd) → density correction → net cargo
- [ ] Cargo Onboard / Total to Load / Difference panel per stage
- [ ] Final cargo = net(Final) − net(Initial)
- [ ] Voyage history list, searchable / sortable by date, port, ship

### Reports
- [ ] PDF export that mirrors the xlsx report format the user already hands to chief officer / charterer
- [ ] Includes: ship particulars, draft diagram, all inputs, full calc trail, signature block
- [ ] "Print current stage" and "Print full voyage" modes
- [ ] Optional: raw xlsx export for users who want to stay in Excel

### UI polish for deck use
- [ ] Large inputs, high contrast — readable in sun / spray
- [ ] Decimal keypad on touch devices
- [ ] Unit consistency: metres for drafts, tonnes for weights (no mixed units)
- [ ] Dark mode (bridge at night)
- [ ] Per-field validation: flag physically implausible readings (negative trim > LBP, draft outside hydro range)

---

## Desktop packaging — Tauri vs Electron

### Option A: Tauri (recommended)
- Rust backend, system webview for UI.
- Binary size **~5–15 MB**. Electron is **~100+ MB**.
- Faster cold start, lower RAM, better battery on laptops underway.
- Bundles `.exe` / `.msi` / `.dmg` / `.AppImage` out of the box.
- Uses native SQLite via `tauri-plugin-sql` or `rusqlite`.
- **Tradeoff:** smaller ecosystem, some Node/npm packages don't work server-side — but the calc engine is pure TypeScript and runs in the webview, so this isn't a blocker.

### Option B: Electron
- Larger, heavier, but every Node package works.
- More documentation and Stack Overflow coverage.
- Good if you want to use `better-sqlite3` directly in Node.
- **Tradeoff:** 10× binary size, noticeably slower, updates are heavier to ship.

**Recommendation:** Tauri. The calc engine and React UI already work unchanged; only the data layer needs Rust/SQLite bindings, which Tauri handles.

---

## Offline database — options

### Option A: SQLite file (recommended)
- One `draft-survey.db` file in the user's app-data directory.
- Structured queries for voyage history, ship search, filters.
- Tauri plugin handles file location, backups, migrations.
- Easy to export / email / back up to USB — it's a single file.
- **Schema sketch:**
  - `ships(id, name, imo, lbp, beam, light_ship, ...)`
  - `ship_marks(ship_id, stage, fwd, mid, aft, lbm)`
  - `hydro_rows(ship_id, draft, disp, tpc, lcf, mctc, lcb)`
  - `voyages(id, ship_id, voyage_no, port, date, notes)`
  - `surveys(id, voyage_id, stage, density, readings_json, deductibles_json, calc_json)`

### Option B: JSON file on disk
- Single `data.json` blob per user.
- Dead simple, zero dependencies.
- Fine for <50 voyages; falls over once you want to search or filter.
- **Tradeoff:** no indexes, whole file rewritten on every save, corruption risk.

### Option C: IndexedDB (web-only fallback)
- Only relevant if you also ship a browser build.
- Lives inside the webview sandbox — can't be easily backed up by the user.
- **Tradeoff:** users can't email or copy their data file.

**Recommendation:** SQLite. One file, searchable, user-portable, standard.

---

## Later (post-MVP)

- [ ] Trim-optimisation helper: suggest ballast moves to hit a target trim
- [ ] Densitometer correction logs (hydrometer readings over time)
- [ ] Multiple hydrometer samples averaged per stage
- [ ] Hold sounding / cargo distribution per hatch
- [ ] Deadweight constant calibration (run a survey in known light-ship condition and solve for constant)
- [ ] CSV bulk import of historical voyages
- [ ] Auto-update (Tauri updater) — optional, needs a hosted update manifest
- [ ] Optional cloud sync **as an add-on later**, not v1 — keep the app fully functional without it

---

## Explicitly out of scope for v1

- User accounts, teams, sharing
- Real-time collaboration
- Web-hosted version
- Fleet dashboards / multi-ship analytics
- Integrations with TMS / charterer systems
- Billing, licensing servers (ship it free or as one-time paid download)
