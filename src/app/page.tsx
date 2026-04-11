"use client";

import { useMemo, useState } from "react";
import {
  WARRAMBOO,
  calculateSurvey,
  type DraftReadings,
  type MarkDistances,
  type SurveyResult,
} from "@/lib/hydro";

type StageKey = "initial" | "interim" | "final";

const STAGE_MARKS: Record<StageKey, MarkDistances> = {
  initial: { fwd: 1.75, mid: 0, aft: 13.4, lbm: 305.85 },
  interim: { fwd: 1.75, mid: 0.6, aft: 13.4, lbm: 305.85 },
  final: { fwd: 1.75, mid: 0.6, aft: 13.4, lbm: 305.85 },
};

const STAGES: { key: StageKey; label: string }[] = [
  { key: "initial", label: "Initial" },
  { key: "interim", label: "Interim" },
  { key: "final", label: "Final" },
];

type Deductibles = {
  fuelOil: string;
  dieselOil: string;
  freshWater: string;
  ballast: string;
  others: string;
  constant: string;
};

type ConditionInput = {
  readings: Record<keyof DraftReadings, string>;
  density: string;
  deductibles: Deductibles;
};

const emptyCondition = (): ConditionInput => ({
  readings: { fwdPort: "", fwdStbd: "", midPort: "", midStbd: "", aftPort: "", aftStbd: "" },
  density: "1.025",
  deductibles: { fuelOil: "", dieselOil: "", freshWater: "", ballast: "", others: "", constant: "" },
});

const WARRAMBOO_INITIAL: ConditionInput = {
  readings: {
    fwdPort: "8.13", fwdStbd: "8.10",
    midPort: "9.18", midStbd: "9.08",
    aftPort: "9.86", aftStbd: "9.80",
  },
  density: "1.023",
  deductibles: {
    fuelOil: "1293.87", dieselOil: "67.34", freshWater: "215",
    ballast: "99020", others: "0", constant: "629",
  },
};

type Stages = Record<StageKey, ConditionInput>;

const defaultStages = (): Stages => ({
  initial: WARRAMBOO_INITIAL,
  interim: emptyCondition(),
  final: emptyCondition(),
});

const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

const fmt = (n: number, d = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

function totalDeductibles(d: Deductibles) {
  return num(d.fuelOil) + num(d.dieselOil) + num(d.freshWater) + num(d.ballast) + num(d.others) + num(d.constant);
}

type ConditionComputed = {
  survey: SurveyResult;
  deductibles: number;
  netCargo: number;
};

function isEmptyCondition(c: ConditionInput) {
  return Object.values(c.readings).every((v) => v.trim() === "");
}

function computeCondition(
  c: ConditionInput,
  lightShip: number,
  lbp: number,
  marks: MarkDistances,
): ConditionComputed | null {
  if (isEmptyCondition(c)) return null;
  const survey = calculateSurvey({
    readings: {
      fwdPort: num(c.readings.fwdPort), fwdStbd: num(c.readings.fwdStbd),
      midPort: num(c.readings.midPort), midStbd: num(c.readings.midStbd),
      aftPort: num(c.readings.aftPort), aftStbd: num(c.readings.aftStbd),
    },
    density: num(c.density) || 1.025,
    lbp,
    marks,
  });
  const deductibles = totalDeductibles(c.deductibles);
  const netCargo = survey.densityCorrectedDisp - lightShip - deductibles;
  return { survey, deductibles, netCargo };
}

export default function Home() {
  const [shipName, setShipName] = useState(WARRAMBOO.name);
  const [lbp, setLbp] = useState(String(WARRAMBOO.lbp));
  const [lightShip, setLightShip] = useState(String(WARRAMBOO.lightShip));
  const [totalToLoad, setTotalToLoad] = useState("247640");
  const [stages, setStages] = useState<Stages>(defaultStages);
  const [active, setActive] = useState<StageKey>("initial");

  const lbpN = num(lbp) || WARRAMBOO.lbp;
  const lightShipN = num(lightShip);

  const computed = useMemo(() => {
    const out: Record<StageKey, ConditionComputed | null> = {
      initial: null, interim: null, final: null,
    };
    for (const { key } of STAGES) {
      out[key] = computeCondition(stages[key], lightShipN, lbpN, STAGE_MARKS[key]);
    }
    return out;
  }, [stages, lightShipN, lbpN]);

  const setStage = (k: StageKey, c: ConditionInput) =>
    setStages((s) => ({ ...s, [k]: c }));

  const cargo = computed.initial && computed.final
    ? computed.final.netCargo - computed.initial.netCargo
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl p-6 sm:p-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Draft Survey Calculator</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {shipName} · LBP {lbpN} m · Light ship {fmt(lightShipN, 0)} t
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setStages(defaultStages()); setActive("initial"); }}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Reset
          </button>
        </header>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Ship" value={shipName} onChange={setShipName} type="text" />
            <Field label="LBP (m)" value={lbp} onChange={setLbp} />
            <Field label="Light ship (t)" value={lightShip} onChange={setLightShip} />
            <Field label="Total to load (t)" value={totalToLoad} onChange={setTotalToLoad} />
          </div>
        </section>

        <div className="mb-0 flex gap-1 border-b border-slate-300 dark:border-slate-700">
          {STAGES.map(({ key, label }) => {
            const c = computed[key];
            const isActive = active === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`relative -mb-px rounded-t-lg border px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-slate-300 border-b-white bg-white text-slate-900 dark:border-slate-700 dark:border-b-slate-900 dark:bg-slate-900 dark:text-slate-100"
                    : "border-transparent bg-slate-100 text-slate-500 hover:text-slate-800 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {label}
                {c && (
                  <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
                )}
              </button>
            );
          })}
        </div>

        <div className="rounded-b-xl rounded-tr-xl border border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <StageTitle stage={active} />
          <ConditionForm
            condition={stages[active]}
            onChange={(c) => setStage(active, c)}
            computed={computed[active]}
          />
          <CargoOnboardPanel
            stage={active}
            computed={computed[active]}
            initialComputed={computed.initial}
            totalToLoad={num(totalToLoad)}
          />
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">Cargo Result (Initial → Final)</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Initial net" value={computed.initial?.netCargo ?? null} />
            <Stat label="Final net" value={computed.final?.netCargo ?? null} />
            <Stat
              label="Δ displacement"
              value={
                computed.initial && computed.final
                  ? computed.final.survey.densityCorrectedDisp - computed.initial.survey.densityCorrectedDisp
                  : null
              }
            />
          </div>
          <div className="mt-6 rounded-lg bg-blue-600 p-5 text-white">
            <div className="text-xs uppercase tracking-wider opacity-80">Cargo loaded / discharged</div>
            <div className="mt-1 text-4xl font-semibold tabular-nums">
              {cargo === null ? "—" : `${fmt(cargo, 2)} t`}
            </div>
            {cargo === null && (
              <div className="mt-1 text-xs opacity-80">Enter both Initial and Final draft readings.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function CargoOnboardPanel({
  stage,
  computed,
  initialComputed,
  totalToLoad,
}: {
  stage: StageKey;
  computed: ConditionComputed | null;
  initialComputed: ConditionComputed | null;
  totalToLoad: number;
}) {
  if (!computed) return null;
  const cargoOnboard =
    stage === "initial"
      ? 0
      : initialComputed
        ? computed.netCargo - initialComputed.netCargo
        : null;
  const difference = cargoOnboard === null ? null : totalToLoad - cargoOnboard;

  return (
    <div className="mt-6 grid gap-3 sm:max-w-md sm:ml-auto">
      <Row label="Cargo Onboard" value={cargoOnboard} tone="orange" />
      <Row label="Total to Load" value={totalToLoad} tone="cream" />
      <Row label="Difference" value={difference} tone="navy" />
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | null;
  tone: "orange" | "cream" | "navy";
}) {
  const styles: Record<typeof tone, string> = {
    orange: "bg-orange-500 text-white",
    cream: "bg-amber-50 text-slate-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-900",
    navy: "bg-blue-900 text-white",
  };
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</div>
      <div className={`min-w-[160px] rounded-md px-4 py-2 text-right text-lg font-semibold tabular-nums ${styles[tone]}`}>
        {value === null ? "—" : `${fmt(value, 0)} MT`}
      </div>
    </div>
  );
}

function StageTitle({ stage }: { stage: StageKey }) {
  const map: Record<StageKey, string> = {
    initial: "Initial Survey",
    interim: "Interim Survey",
    final: "Final Survey",
  };
  return <h2 className="mb-5 text-xl font-semibold">{map[stage]}</h2>;
}

function Field({
  label, value, onChange, type = "number",
}: {
  label: string; value: string; onChange: (v: string) => void; type?: "number" | "text";
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-slate-300 bg-white px-3 py-2 tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
      />
    </label>
  );
}

function ConditionForm({
  condition, onChange, computed,
}: {
  condition: ConditionInput;
  onChange: (c: ConditionInput) => void;
  computed: ConditionComputed | null;
}) {
  const setReading = (k: keyof DraftReadings, v: string) =>
    onChange({ ...condition, readings: { ...condition.readings, [k]: v } });
  const setDeduct = (k: keyof Deductibles, v: string) =>
    onChange({ ...condition, deductibles: { ...condition.deductibles, [k]: v } });

  const s = computed?.survey;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Draft readings (m)
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Fwd Port" value={condition.readings.fwdPort} onChange={(v) => setReading("fwdPort", v)} />
          <Field label="Mid Port" value={condition.readings.midPort} onChange={(v) => setReading("midPort", v)} />
          <Field label="Aft Port" value={condition.readings.aftPort} onChange={(v) => setReading("aftPort", v)} />
          <Field label="Fwd Stbd" value={condition.readings.fwdStbd} onChange={(v) => setReading("fwdStbd", v)} />
          <Field label="Mid Stbd" value={condition.readings.midStbd} onChange={(v) => setReading("midStbd", v)} />
          <Field label="Aft Stbd" value={condition.readings.aftStbd} onChange={(v) => setReading("aftStbd", v)} />
        </div>

        <div className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Water density
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Density (t/m³)" value={condition.density} onChange={(v) => onChange({ ...condition, density: v })} />
        </div>

        <div className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Deductibles (t)
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Fuel oil" value={condition.deductibles.fuelOil} onChange={(v) => setDeduct("fuelOil", v)} />
          <Field label="Diesel oil" value={condition.deductibles.dieselOil} onChange={(v) => setDeduct("dieselOil", v)} />
          <Field label="Fresh water" value={condition.deductibles.freshWater} onChange={(v) => setDeduct("freshWater", v)} />
          <Field label="Ballast" value={condition.deductibles.ballast} onChange={(v) => setDeduct("ballast", v)} />
          <Field label="Others" value={condition.deductibles.others} onChange={(v) => setDeduct("others", v)} />
          <Field label="Constant" value={condition.deductibles.constant} onChange={(v) => setDeduct("constant", v)} />
        </div>
      </div>

      <div>
        {s && computed ? (
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Calculation
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm tabular-nums">
              <CalcRow label="Fwd (raw → corr)" value={`${fmt(s.fwdRaw, 3)} → ${fmt(s.fwdCorr, 3)} m`} />
              <CalcRow label="Mid (raw → corr)" value={`${fmt(s.midRaw, 3)} → ${fmt(s.midCorr, 3)} m`} />
              <CalcRow label="Aft (raw → corr)" value={`${fmt(s.aftRaw, 3)} → ${fmt(s.aftCorr, 3)} m`} />
              <CalcRow label="Trim (+stern)" value={`${fmt(s.trim, 3)} m`} />
              <CalcRow label="Mean draft" value={`${fmt(s.meanDraft, 3)} m`} />
              <CalcRow label="Mean of mean" value={`${fmt(s.meanOfMean, 3)} m`} />
              <CalcRow label="Quarter mean (dAv)" value={`${fmt(s.quarterMean, 3)} m`} />
              <CalcRow label="Disp at dAv" value={`${fmt(s.dispAtDraft, 1)} t`} />
              <CalcRow label="TPC" value={fmt(s.hydroAtQuarterMean.tpc, 2)} />
              <CalcRow label="LCF" value={fmt(s.hydroAtQuarterMean.lcf, 3)} />
              <CalcRow label="MCTC" value={fmt(s.hydroAtQuarterMean.mctc, 2)} />
              <CalcRow label="1st trim corr." value={`${fmt(s.firstTrimCorrection, 1)} t`} />
              <CalcRow label="2nd trim corr." value={`${fmt(s.secondTrimCorrection, 1)} t`} />
              <CalcRow label="Corrected disp" value={`${fmt(s.correctedDisp, 1)} t`} />
              <CalcRow label="After density corr." value={`${fmt(s.densityCorrectedDisp, 1)} t`} bold />
              <CalcRow label="Total deductibles" value={`${fmt(computed.deductibles, 2)} t`} />
              <CalcRow label="Net cargo" value={`${fmt(computed.netCargo, 2)} t`} bold />
            </dl>
          </div>
        ) : (
          <div className="rounded-lg bg-slate-100 p-4 text-sm text-slate-500 dark:bg-slate-800">
            Enter draft readings to see the calculation.
          </div>
        )}
      </div>
    </div>
  );
}

function CalcRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <>
      <dt className="text-slate-600 dark:text-slate-400">{label}</dt>
      <dd className={`text-right ${bold ? "font-semibold" : ""}`}>{value}</dd>
    </>
  );
}

function Stat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
      <div className="text-xs text-slate-600 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">
        {value === null ? "—" : fmt(value, 2)}
      </div>
    </div>
  );
}
