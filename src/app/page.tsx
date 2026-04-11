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

const STAGES: { key: StageKey; label: string }[] = [
  { key: "initial", label: "Initial Survey" },
  { key: "interim", label: "Interim Survey" },
  { key: "final", label: "Final Survey" },
];

const STAGE_MARKS: Record<StageKey, MarkDistances> = {
  initial: { fwd: 1.75, mid: 0, aft: 13.4, lbm: 305.85 },
  interim: { fwd: 1.75, mid: 0.6, aft: 13.4, lbm: 305.85 },
  final: { fwd: 1.75, mid: 0.6, aft: 13.4, lbm: 305.85 },
};

type StageTheme = {
  accent: string;
  softBg: string;
  ring: string;
  bar: string;
  shipHull: string;
  shipStroke: string;
  waterline: string;
};

const STAGE_THEME: Record<StageKey, StageTheme> = {
  initial: {
    accent: "text-sky-600 dark:text-sky-400",
    softBg: "from-sky-50/60 to-white dark:from-sky-950/30 dark:to-slate-900",
    ring: "ring-sky-500/20",
    bar: "bg-gradient-to-r from-sky-500 to-cyan-500",
    shipHull: "fill-sky-100 dark:fill-sky-950/60",
    shipStroke: "stroke-sky-400 dark:stroke-sky-600",
    waterline: "stroke-sky-300 dark:stroke-sky-700",
  },
  interim: {
    accent: "text-amber-600 dark:text-amber-400",
    softBg: "from-amber-50/60 to-white dark:from-amber-950/30 dark:to-slate-900",
    ring: "ring-amber-500/20",
    bar: "bg-gradient-to-r from-amber-500 to-orange-500",
    shipHull: "fill-amber-100 dark:fill-amber-950/60",
    shipStroke: "stroke-amber-400 dark:stroke-amber-600",
    waterline: "stroke-amber-300 dark:stroke-amber-700",
  },
  final: {
    accent: "text-emerald-600 dark:text-emerald-400",
    softBg: "from-emerald-50/60 to-white dark:from-emerald-950/30 dark:to-slate-900",
    ring: "ring-emerald-500/20",
    bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
    shipHull: "fill-emerald-100 dark:fill-emerald-950/60",
    shipStroke: "stroke-emerald-400 dark:stroke-emerald-600",
    waterline: "stroke-emerald-300 dark:stroke-emerald-700",
  },
};

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

  const copyWeightsToFinal = () => {
    setStages((s) => ({
      ...s,
      final: { ...s.final, deductibles: { ...s.initial.deductibles } },
    }));
  };

  const cargo = computed.initial && computed.final
    ? computed.final.netCargo - computed.initial.netCargo
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-[1400px] px-6 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Draft Survey
            </div>
            <h1 className="mt-1 bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400">
              {shipName}
            </h1>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              LBP {lbpN} m · Light ship {fmt(lightShipN, 0)} t
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStages(defaultStages())}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Reset
          </button>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Ship" value={shipName} onChange={setShipName} type="text" />
            <Field label="LBP (m)" value={lbp} onChange={setLbp} />
            <Field label="Light ship (t)" value={lightShip} onChange={setLightShip} />
            <Field label="Total to load (t)" value={totalToLoad} onChange={setTotalToLoad} />
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          {STAGES.map(({ key, label }, idx) => (
            <StageColumn
              key={key}
              stage={key}
              label={label}
              condition={stages[key]}
              onChange={(c) => setStage(key, c)}
              computed={computed[key]}
              initialComputed={computed.initial}
              totalToLoad={num(totalToLoad)}
              onCopyWeights={idx === 0 ? copyWeightsToFinal : undefined}
            />
          ))}
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Voyage Summary · Initial → Final
            </h2>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <SummaryStat label="Initial net" value={computed.initial?.netCargo ?? null} />
            <SummaryStat label="Final net" value={computed.final?.netCargo ?? null} />
            <SummaryStat
              label="Δ displacement"
              value={
                computed.initial && computed.final
                  ? computed.final.survey.densityCorrectedDisp - computed.initial.survey.densityCorrectedDisp
                  : null
              }
            />
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-6 py-6 text-white">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">
                Cargo loaded / discharged
              </div>
              <div className="mt-2 text-5xl font-bold tabular-nums">
                {cargo === null ? "—" : `${fmt(cargo, 2)}`}
                <span className="ml-2 text-2xl font-medium opacity-70">t</span>
              </div>
              {cargo === null && (
                <div className="mt-2 text-sm opacity-80">Enter both Initial and Final draft readings.</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StageColumn({
  stage,
  label,
  condition,
  onChange,
  computed,
  initialComputed,
  totalToLoad,
  onCopyWeights,
}: {
  stage: StageKey;
  label: string;
  condition: ConditionInput;
  onChange: (c: ConditionInput) => void;
  computed: ConditionComputed | null;
  initialComputed: ConditionComputed | null;
  totalToLoad: number;
  onCopyWeights?: () => void;
}) {
  const theme = STAGE_THEME[stage];
  const setReading = (k: keyof DraftReadings, v: string) =>
    onChange({ ...condition, readings: { ...condition.readings, [k]: v } });
  const setDeduct = (k: keyof Deductibles, v: string) =>
    onChange({ ...condition, deductibles: { ...condition.deductibles, [k]: v } });

  const s = computed?.survey;
  const cargoOnboard =
    stage === "initial"
      ? 0
      : initialComputed && computed
        ? computed.netCargo - initialComputed.netCargo
        : null;
  const difference = cargoOnboard === null ? null : totalToLoad - cargoOnboard;

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b ${theme.softBg} shadow-sm ring-1 ${theme.ring} dark:border-slate-800`}>
      <div className={`h-1.5 w-full ${theme.bar}`} />
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className={`text-lg font-bold uppercase tracking-wide ${theme.accent}`}>
            {label}
          </h2>
          {computed && (
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:bg-slate-800/70 dark:text-slate-300`}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              entered
            </span>
          )}
        </div>

        <ShipDiagram
          readings={condition.readings}
          setReading={setReading}
          theme={theme}
        />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Field
            label="Density (t/m³)"
            value={condition.density}
            onChange={(v) => onChange({ ...condition, density: v })}
          />
          <div className="rounded-lg border border-slate-200 bg-white/60 p-2 text-xs backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Trim / Deflection
            </div>
            {s ? (
              <div className="mt-1 space-y-0.5 tabular-nums">
                <div>
                  <span className="font-semibold">{fmt(Math.abs(s.trim), 3)} m</span>{" "}
                  <span className="text-slate-500">
                    by the {s.trim >= 0 ? "stern" : "head"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">{fmt(Math.abs(s.deflectionM) * 100, 1)} cm</span>{" "}
                  <span className="text-slate-500">
                    {s.deflectionM >= 0 ? "SAG" : "HOG"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-1 text-slate-400">—</div>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white/80 p-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Known Weights (t)
            </div>
            {onCopyWeights && (
              <button
                type="button"
                onClick={onCopyWeights}
                className="rounded-md bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm transition hover:bg-sky-500"
              >
                Copy → Final
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            <WeightRow label="Fuel oil" value={condition.deductibles.fuelOil} onChange={(v) => setDeduct("fuelOil", v)} />
            <WeightRow label="Diesel oil" value={condition.deductibles.dieselOil} onChange={(v) => setDeduct("dieselOil", v)} />
            <WeightRow label="Fresh water" value={condition.deductibles.freshWater} onChange={(v) => setDeduct("freshWater", v)} />
            <WeightRow label="Ballast" value={condition.deductibles.ballast} onChange={(v) => setDeduct("ballast", v)} />
            <WeightRow label="Others" value={condition.deductibles.others} onChange={(v) => setDeduct("others", v)} />
            <WeightRow label="Constant" value={condition.deductibles.constant} onChange={(v) => setDeduct("constant", v)} />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <ResultRow
            label="Cargo onboard"
            value={cargoOnboard}
            tone="orange"
            hideOnInitial={stage === "initial"}
          />
          {stage !== "initial" && (
            <>
              <ResultRow label="Total to load" value={totalToLoad} tone="cream" />
              <ResultRow label="Difference" value={difference} tone="navy" />
            </>
          )}
        </div>

        {s && computed && (
          <details className="mt-4 rounded-lg border border-slate-200 bg-white/60 p-3 text-xs backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
            <summary className="cursor-pointer font-semibold text-slate-600 dark:text-slate-300">
              Show full calculation
            </summary>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 tabular-nums">
              <CalcRow label="Fwd corr" value={`${fmt(s.fwdCorr, 3)} m`} />
              <CalcRow label="Mid corr" value={`${fmt(s.midCorr, 3)} m`} />
              <CalcRow label="Aft corr" value={`${fmt(s.aftCorr, 3)} m`} />
              <CalcRow label="Mean draft" value={`${fmt(s.meanDraft, 3)} m`} />
              <CalcRow label="Mean of mean" value={`${fmt(s.meanOfMean, 3)} m`} />
              <CalcRow label="Quarter mean" value={`${fmt(s.quarterMean, 3)} m`} />
              <CalcRow label="Disp at dAv" value={`${fmt(s.dispAtDraft, 1)} t`} />
              <CalcRow label="TPC" value={fmt(s.hydroAtQuarterMean.tpc, 2)} />
              <CalcRow label="LCF" value={fmt(s.hydroAtQuarterMean.lcf, 3)} />
              <CalcRow label="MCTC" value={fmt(s.hydroAtQuarterMean.mctc, 2)} />
              <CalcRow label="1st corr" value={`${fmt(s.firstTrimCorrection, 1)} t`} />
              <CalcRow label="2nd corr" value={`${fmt(s.secondTrimCorrection, 1)} t`} />
              <CalcRow label="Corrected" value={`${fmt(s.correctedDisp, 1)} t`} />
              <CalcRow label="w/ density" value={`${fmt(s.densityCorrectedDisp, 1)} t`} bold />
              <CalcRow label="Deductibles" value={`${fmt(computed.deductibles, 2)} t`} />
              <CalcRow label="Net" value={`${fmt(computed.netCargo, 2)} t`} bold />
            </dl>
          </details>
        )}
      </div>
    </div>
  );
}

function ShipDiagram({
  readings,
  setReading,
  theme,
}: {
  readings: Record<keyof DraftReadings, string>;
  setReading: (k: keyof DraftReadings, v: string) => void;
  theme: StageTheme;
}) {
  return (
    <div className="relative mx-auto h-[300px] w-full max-w-[320px]">
      <svg viewBox="0 0 320 300" className="absolute inset-0 h-full w-full">
        {/* waterline rings */}
        <line x1="15" y1="60" x2="305" y2="60" strokeDasharray="3 4" strokeWidth="1" className={theme.waterline} />
        <line x1="15" y1="150" x2="305" y2="150" strokeDasharray="3 4" strokeWidth="1" className={theme.waterline} />
        <line x1="15" y1="240" x2="305" y2="240" strokeDasharray="3 4" strokeWidth="1" className={theme.waterline} />

        {/* ship hull plan view — bow pointing up */}
        <path
          d="M 160 15
             C 200 25 215 55 215 90
             L 215 240
             C 215 260 205 275 190 282
             L 130 282
             C 115 275 105 260 105 240
             L 105 90
             C 105 55 120 25 160 15 Z"
          className={`${theme.shipHull} ${theme.shipStroke}`}
          strokeWidth="2"
        />
        {/* centerline */}
        <line x1="160" y1="20" x2="160" y2="282" strokeDasharray="2 4" strokeWidth="1" className={theme.shipStroke} opacity="0.5" />
        {/* bow label */}
        <text x="160" y="45" textAnchor="middle" className="fill-slate-500 text-[9px] font-semibold uppercase tracking-wider">
          BOW
        </text>
        <text x="160" y="270" textAnchor="middle" className="fill-slate-500 text-[9px] font-semibold uppercase tracking-wider">
          STERN
        </text>
      </svg>

      {/* Fwd Port — top left */}
      <DraftInput position="top-[45px] left-0" label="Fwd P" value={readings.fwdPort} onChange={(v) => setReading("fwdPort", v)} />
      {/* Fwd Stbd — top right */}
      <DraftInput position="top-[45px] right-0" label="Fwd S" value={readings.fwdStbd} onChange={(v) => setReading("fwdStbd", v)} />
      {/* Mid Port — middle left */}
      <DraftInput position="top-[135px] left-0" label="Mid P" value={readings.midPort} onChange={(v) => setReading("midPort", v)} />
      {/* Mid Stbd — middle right */}
      <DraftInput position="top-[135px] right-0" label="Mid S" value={readings.midStbd} onChange={(v) => setReading("midStbd", v)} />
      {/* Aft Port — bottom left */}
      <DraftInput position="bottom-[10px] left-0" label="Aft P" value={readings.aftPort} onChange={(v) => setReading("aftPort", v)} />
      {/* Aft Stbd — bottom right */}
      <DraftInput position="bottom-[10px] right-0" label="Aft S" value={readings.aftStbd} onChange={(v) => setReading("aftStbd", v)} />
    </div>
  );
}

function DraftInput({
  position,
  label,
  value,
  onChange,
}: {
  position: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={`absolute ${position} w-[68px]`}>
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        placeholder="0.00"
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded-md border border-slate-300 bg-white/90 px-2 py-1 text-center text-sm font-semibold tabular-nums shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-900/90"
      />
    </div>
  );
}

function WeightRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 text-xs text-slate-600 dark:text-slate-400">{label}</div>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        placeholder="0"
        onChange={(e) => onChange(e.target.value)}
        className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1 text-right text-xs tabular-nums focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
      />
    </div>
  );
}

function ResultRow({
  label,
  value,
  tone,
  hideOnInitial,
}: {
  label: string;
  value: number | null;
  tone: "orange" | "cream" | "navy";
  hideOnInitial?: boolean;
}) {
  if (hideOnInitial) return null;
  const styles: Record<typeof tone, string> = {
    orange: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    cream: "bg-amber-50 text-slate-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-100 dark:border-amber-900",
    navy: "bg-gradient-to-r from-blue-800 to-indigo-900 text-white",
  };
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</div>
      <div className={`min-w-[120px] rounded-lg px-3 py-1.5 text-right text-sm font-bold tabular-nums shadow-sm ${styles[tone]}`}>
        {value === null ? "—" : `${fmt(value, 0)} MT`}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "number",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "number" | "text";
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <input
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm tabular-nums shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
      />
    </label>
  );
}

function CalcRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <>
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className={`text-right ${bold ? "font-semibold text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"}`}>
        {value}
      </dd>
    </>
  );
}

function SummaryStat({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
        {value === null ? "—" : fmt(value, 2)}
      </div>
    </div>
  );
}
