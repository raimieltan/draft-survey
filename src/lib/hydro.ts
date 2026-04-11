export type HydroRow = {
  draft: number;
  disp: number;
  tpc: number;
  lcf: number;
  mctc: number;
  lcb: number;
};

export type ShipParticulars = {
  name: string;
  lbp: number;
  beam: number;
  lightShip: number;
  summerDraft: number;
  summerDisp: number;
  fwa: number;
};

export const WARRAMBOO: ShipParticulars = {
  name: "MV WARRAMBOO",
  lbp: 321,
  beam: 57,
  lightShip: 33323,
  summerDraft: 18.025,
  summerDisp: 284041,
  fwa: 409,
};

export const HYDRO: HydroRow[] = [
  { draft: 6.0, disp: 87474, tpc: 153.8, lcf: -14.35, mctc: 2892.0, lcb: -15.19 },
  { draft: 6.2, disp: 90554, tpc: 154.2, lcf: -14.27, mctc: 2906.0, lcb: -15.16 },
  { draft: 6.4, disp: 93640, tpc: 154.5, lcf: -14.17, mctc: 2920.4, lcb: -15.12 },
  { draft: 6.6, disp: 96732, tpc: 154.8, lcf: -14.07, mctc: 2934.9, lcb: -15.09 },
  { draft: 6.8, disp: 99830, tpc: 155.1, lcf: -13.96, mctc: 2949.5, lcb: -15.05 },
  { draft: 7.0, disp: 102934, tpc: 155.4, lcf: -13.84, mctc: 2964.0, lcb: -15.01 },
  { draft: 7.2, disp: 106044, tpc: 155.7, lcf: -13.72, mctc: 2978.3, lcb: -14.97 },
  { draft: 7.4, disp: 109160, tpc: 156.0, lcf: -13.60, mctc: 2992.4, lcb: -14.93 },
  { draft: 7.6, disp: 112282, tpc: 156.3, lcf: -13.48, mctc: 3006.4, lcb: -14.89 },
  { draft: 7.8, disp: 115410, tpc: 156.6, lcf: -13.34, mctc: 3020.4, lcb: -14.85 },
  { draft: 8.0, disp: 118544, tpc: 156.9, lcf: -13.21, mctc: 3034.5, lcb: -14.80 },
  { draft: 8.2, disp: 121683, tpc: 157.1, lcf: -13.06, mctc: 3048.8, lcb: -14.76 },
  { draft: 8.4, disp: 124828, tpc: 157.4, lcf: -12.91, mctc: 3063.3, lcb: -14.71 },
  { draft: 8.6, disp: 127978, tpc: 157.7, lcf: -12.75, mctc: 3078.2, lcb: -14.66 },
  { draft: 8.8, disp: 131135, tpc: 158.0, lcf: -12.58, mctc: 3093.4, lcb: -14.61 },
  { draft: 9.0, disp: 134298, tpc: 158.3, lcf: -12.40, mctc: 3109.1, lcb: -14.56 },
  { draft: 9.2, disp: 137467, tpc: 158.6, lcf: -12.21, mctc: 3125.4, lcb: -14.51 },
  { draft: 9.4, disp: 140642, tpc: 158.9, lcf: -12.01, mctc: 3142.2, lcb: -14.45 },
  { draft: 9.6, disp: 143823, tpc: 159.2, lcf: -11.80, mctc: 3159.5, lcb: -14.39 },
  { draft: 9.8, disp: 147011, tpc: 159.6, lcf: -11.59, mctc: 3177.3, lcb: -14.33 },
  { draft: 10.0, disp: 150205, tpc: 159.9, lcf: -11.36, mctc: 3195.6, lcb: -14.27 },
  { draft: 10.2, disp: 153405, tpc: 160.2, lcf: -11.13, mctc: 3214.3, lcb: -14.20 },
  { draft: 10.4, disp: 156612, tpc: 160.5, lcf: -10.89, mctc: 3233.3, lcb: -14.13 },
  { draft: 10.6, disp: 159826, tpc: 160.9, lcf: -10.65, mctc: 3252.8, lcb: -14.07 },
  { draft: 10.8, disp: 163047, tpc: 161.2, lcf: -10.39, mctc: 3272.6, lcb: -13.99 },
  { draft: 11.0, disp: 166274, tpc: 161.6, lcf: -10.13, mctc: 3292.7, lcb: -13.92 },
  { draft: 11.2, disp: 169508, tpc: 161.9, lcf: -9.86, mctc: 3313.1, lcb: -13.84 },
  { draft: 11.4, disp: 172750, tpc: 162.3, lcf: -9.58, mctc: 3333.9, lcb: -13.76 },
  { draft: 11.6, disp: 175999, tpc: 162.6, lcf: -9.30, mctc: 3354.8, lcb: -13.68 },
  { draft: 11.8, disp: 179254, tpc: 163.0, lcf: -9.00, mctc: 3376.1, lcb: -13.60 },
  { draft: 12.0, disp: 182517, tpc: 163.3, lcf: -8.71, mctc: 3397.5, lcb: -13.51 },
  { draft: 12.2, disp: 185787, tpc: 163.7, lcf: -8.41, mctc: 3419.1, lcb: -13.42 },
  { draft: 12.4, disp: 189065, tpc: 164.1, lcf: -8.10, mctc: 3441.0, lcb: -13.33 },
  { draft: 12.6, disp: 192349, tpc: 164.4, lcf: -7.79, mctc: 3462.9, lcb: -13.24 },
  { draft: 12.8, disp: 195641, tpc: 164.8, lcf: -7.48, mctc: 3484.9, lcb: -13.14 },
  { draft: 13.0, disp: 198940, tpc: 165.1, lcf: -7.17, mctc: 3507.0, lcb: -13.04 },
  { draft: 13.2, disp: 202245, tpc: 165.5, lcf: -6.85, mctc: 3529.2, lcb: -12.94 },
  { draft: 13.4, disp: 205559, tpc: 165.8, lcf: -6.53, mctc: 3551.3, lcb: -12.84 },
  { draft: 13.6, disp: 208879, tpc: 166.2, lcf: -6.22, mctc: 3573.6, lcb: -12.74 },
  { draft: 13.8, disp: 212206, tpc: 166.5, lcf: -5.90, mctc: 3595.9, lcb: -12.63 },
  { draft: 14.0, disp: 215540, tpc: 166.9, lcf: -5.58, mctc: 3618.3, lcb: -12.52 },
  { draft: 14.2, disp: 218882, tpc: 167.3, lcf: -5.26, mctc: 3640.9, lcb: -12.41 },
  { draft: 14.4, disp: 222230, tpc: 167.6, lcf: -4.94, mctc: 3663.5, lcb: -12.30 },
  { draft: 14.6, disp: 225586, tpc: 167.9, lcf: -4.63, mctc: 3686.0, lcb: -12.18 },
  { draft: 14.8, disp: 228948, tpc: 168.3, lcf: -4.32, mctc: 3708.2, lcb: -12.07 },
  { draft: 15.0, disp: 232317, tpc: 168.6, lcf: -4.03, mctc: 3730.1, lcb: -11.95 },
  { draft: 15.2, disp: 235690, tpc: 168.9, lcf: -3.73, mctc: 3751.6, lcb: -11.84 },
  { draft: 15.4, disp: 239071, tpc: 169.2, lcf: -3.45, mctc: 3772.6, lcb: -11.72 },
  { draft: 15.6, disp: 242458, tpc: 169.5, lcf: -3.17, mctc: 3793.5, lcb: -11.60 },
  { draft: 15.8, disp: 245851, tpc: 169.9, lcf: -2.90, mctc: 3814.4, lcb: -11.49 },
  { draft: 16.0, disp: 249251, tpc: 170.2, lcf: -2.63, mctc: 3835.5, lcb: -11.37 },
  { draft: 16.2, disp: 252658, tpc: 170.5, lcf: -2.35, mctc: 3856.9, lcb: -11.25 },
  { draft: 16.4, disp: 256071, tpc: 170.8, lcf: -2.08, mctc: 3878.6, lcb: -11.13 },
  { draft: 16.6, disp: 259490, tpc: 171.2, lcf: -1.80, mctc: 3900.7, lcb: -11.00 },
  { draft: 16.8, disp: 262916, tpc: 171.5, lcf: -1.53, mctc: 3923.2, lcb: -10.88 },
  { draft: 17.0, disp: 266349, tpc: 171.8, lcf: -1.25, mctc: 3946.0, lcb: -10.76 },
  { draft: 17.2, disp: 269788, tpc: 172.1, lcf: -0.97, mctc: 3969.1, lcb: -10.64 },
  { draft: 17.4, disp: 273233, tpc: 172.4, lcf: -0.69, mctc: 3992.3, lcb: -10.51 },
  { draft: 17.6, disp: 276685, tpc: 172.7, lcf: -0.42, mctc: 4015.1, lcb: -10.39 },
  { draft: 17.8, disp: 280143, tpc: 173.1, lcf: -0.16, mctc: 4037.2, lcb: -10.26 },
  { draft: 18.0, disp: 283607, tpc: 173.4, lcf: 0.09, mctc: 4058.2, lcb: -10.14 },
  { draft: 18.2, disp: 287077, tpc: 173.6, lcf: 0.32, mctc: 4077.9, lcb: -10.01 },
  { draft: 18.4, disp: 290553, tpc: 174.0, lcf: 0.53, mctc: 4096.2, lcb: -9.89 },
  { draft: 18.6, disp: 294034, tpc: 174.2, lcf: 0.73, mctc: 4113.1, lcb: -9.76 },
  { draft: 18.8, disp: 297520, tpc: 174.4, lcf: 0.90, mctc: 4128.7, lcb: -9.64 },
  { draft: 19.0, disp: 301011, tpc: 174.6, lcf: 1.06, mctc: 4142.9, lcb: -9.52 },
  { draft: 19.2, disp: 304505, tpc: 174.8, lcf: 1.20, mctc: 4155.9, lcb: -9.39 },
  { draft: 19.4, disp: 308003, tpc: 175.0, lcf: 1.33, mctc: 4167.9, lcb: -9.27 },
  { draft: 19.6, disp: 311504, tpc: 175.2, lcf: 1.44, mctc: 4178.9, lcb: -9.15 },
  { draft: 19.8, disp: 315008, tpc: 175.3, lcf: 1.54, mctc: 4189.3, lcb: -9.03 },
  { draft: 20.0, disp: 318516, tpc: 175.5, lcf: 1.63, mctc: 4199.2, lcb: -8.92 },
  { draft: 20.2, disp: 322028, tpc: 175.7, lcf: 1.71, mctc: 4208.9, lcb: -8.80 },
  { draft: 20.4, disp: 325542, tpc: 175.8, lcf: 1.79, mctc: 4218.1, lcb: -8.69 },
  { draft: 20.6, disp: 329058, tpc: 175.9, lcf: 1.87, mctc: 4226.8, lcb: -8.57 },
  { draft: 20.8, disp: 332577, tpc: 176.0, lcf: 1.93, mctc: 4234.7, lcb: -8.46 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function interpHydro(draft: number): HydroRow | null {
  if (!Number.isFinite(draft)) return null;
  const first = HYDRO[0];
  const last = HYDRO[HYDRO.length - 1];
  if (draft <= first.draft) return { ...first, draft };
  if (draft >= last.draft) return { ...last, draft };
  for (let i = 0; i < HYDRO.length - 1; i++) {
    const a = HYDRO[i];
    const b = HYDRO[i + 1];
    if (draft >= a.draft && draft <= b.draft) {
      const t = (draft - a.draft) / (b.draft - a.draft);
      return {
        draft,
        disp: lerp(a.disp, b.disp, t),
        tpc: lerp(a.tpc, b.tpc, t),
        lcf: lerp(a.lcf, b.lcf, t),
        mctc: lerp(a.mctc, b.mctc, t),
        lcb: lerp(a.lcb, b.lcb, t),
      };
    }
  }
  return null;
}

export type DraftReadings = {
  fwdPort: number;
  fwdStbd: number;
  midPort: number;
  midStbd: number;
  aftPort: number;
  aftStbd: number;
};

export type MarkDistances = {
  fwd: number;
  mid: number;
  aft: number;
  lbm: number;
};

export const WARRAMBOO_MARKS: MarkDistances = {
  fwd: 1.75,
  mid: 0,
  aft: 13.4,
  lbm: 305.85,
};

export type SurveyInput = {
  readings: DraftReadings;
  density: number;
  lbp: number;
  marks: MarkDistances;
};

export type SurveyResult = {
  fwdRaw: number;
  midRaw: number;
  aftRaw: number;
  apparentTrim: number;
  fwdCorr: number;
  midCorr: number;
  aftCorr: number;
  trim: number;
  meanDraft: number;
  meanOfMean: number;
  quarterMean: number;
  deflectionM: number;
  hydroAtQuarterMean: HydroRow;
  dispAtDraft: number;
  firstTrimCorrection: number;
  secondTrimCorrection: number;
  correctedDisp: number;
  densityCorrectedDisp: number;
};

export function calculateSurvey(input: SurveyInput): SurveyResult {
  const { readings: r, density, lbp, marks } = input;
  const fwdRaw = (r.fwdPort + r.fwdStbd) / 2;
  const midRaw = (r.midPort + r.midStbd) / 2;
  const aftRaw = (r.aftPort + r.aftStbd) / 2;
  const apparentTrim = aftRaw - fwdRaw;

  const fwdCorr = fwdRaw - (marks.fwd * apparentTrim) / marks.lbm;
  const aftCorr = aftRaw + (marks.aft * apparentTrim) / marks.lbm;
  const midCorr = midRaw + (marks.mid * apparentTrim) / marks.lbm;

  const trim = aftCorr - fwdCorr;
  const meanDraft = (fwdCorr + aftCorr) / 2;
  const meanOfMean = (meanDraft + midCorr) / 2;
  const quarterMean = (3 * midCorr + meanDraft) / 4;
  const deflectionM = midCorr - meanDraft;

  const h = interpHydro(quarterMean)!;
  const dispAtDraft = h.disp;

  const firstTrimCorrection = (trim * h.lcf * 100 * h.tpc) / lbp;

  const hPlus = interpHydro(quarterMean + 0.5);
  const hMinus = interpHydro(quarterMean - 0.5);
  const dMctc = hPlus && hMinus ? hPlus.mctc - hMinus.mctc : 0;
  const secondTrimCorrection = (50 * trim * trim * dMctc) / lbp;

  const correctedDisp = dispAtDraft + firstTrimCorrection + secondTrimCorrection;
  const densityCorrectedDisp = correctedDisp * (density / 1.025);

  return {
    fwdRaw,
    midRaw,
    aftRaw,
    apparentTrim,
    fwdCorr,
    midCorr,
    aftCorr,
    trim,
    meanDraft,
    meanOfMean,
    quarterMean,
    deflectionM,
    hydroAtQuarterMean: h,
    dispAtDraft,
    firstTrimCorrection,
    secondTrimCorrection,
    correctedDisp,
    densityCorrectedDisp,
  };
}
