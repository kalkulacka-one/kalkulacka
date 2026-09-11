/**
 * The icon set.
 *
 * Two families live here, and they are not interchangeable:
 *
 *  - The *marks* (`check`, `cross`, `star`) are the heavy prototype shapes the
 *    answer buttons are built from. Their paths are verbatim from the visual
 *    spec so the marks stay pixel-identical to it.
 *  - The *thin set* is everything spread from `THIN` below. It carries the
 *    logo's geometry — flat-cut ends, mitred corners, 45° diagonals — down to
 *    a hairline, so an icon reads as the same family as the wordmark without
 *    competing with the answer buttons for weight.
 *
 * Drawing a new thin icon: spread `THIN`, work on the 24 grid with the artwork
 * inside the middle 20 (terminals on 2/4/6…22), keep every angle a multiple of
 * 45° unless the shape is genuinely round, and use `dots` for anything solid —
 * those are the family's only filled elements, and they echo the two dots in
 * the wordmark.
 */
export type IconDefinition = {
  viewBox: string;
  /** `fill` uses currentColor as the fill; `stroke` outlines it. */
  mode: "fill" | "stroke";
  /** Outline geometry; more than one entry where a mark needs disjoint strokes. */
  paths: readonly string[];
  /** Solid circles, `[cx, cy, r]` — always filled, never stroked. */
  dots?: readonly (readonly [number, number, number])[];
  strokeWidth?: number;
  strokeLinejoin?: "round" | "miter";
  strokeLinecap?: "round" | "butt";
};

/** Shared geometry for the thin set. See the module comment before changing it. */
const THIN = {
  viewBox: "0 0 24 24",
  mode: "stroke",
  strokeWidth: 1.5,
  strokeLinecap: "butt",
  strokeLinejoin: "miter",
} as const satisfies Omit<IconDefinition, "paths">;

export const icons = {
  /** "Ano" — the checkmark. */
  check: {
    viewBox: "0 0 23 18",
    mode: "fill",
    paths: ["M18.8702 0L22.2876 3.36487L10.8466 14.6297L7.42918 17.9946L0 10.6797L3.41742 7.31483L7.4292 11.2649L18.8702 0Z"],
  },
  /** "Ne" — the cross. */
  cross: {
    viewBox: "0 0 19 18",
    mode: "fill",
    paths: [
      "M14.8585 3.3987e-05L18.2758 3.36491L12.5553 8.99735L18.2758 14.6298L14.8584 17.9946L9.13789 12.3622L3.4174 17.9946L0 14.6297L5.72047 8.99733L0 3.36485L3.41742 0L9.13792 5.6325L14.8585 3.3987e-05Z",
    ],
  },
  /**
   * "Nevím" — a position taken that carries no direction.
   *
   * On the cross's own 19×18 box so the three marks size identically from one
   * `size` prop, and cut to the same weight: a bar this heavy sits between a
   * check and a cross without either looking thin next to it.
   */
  neutral: {
    viewBox: "0 0 19 18",
    mode: "fill",
    paths: ["M0 6.8H19V11.2H0V6.8Z"],
  },
  /** "Pro mě důležité" — outlined until active, then filled. */
  star: {
    viewBox: "0 0 24 23",
    mode: "stroke",
    paths: ["M12 1.8 L15.1 8.1 L22 9.1 L17 14 L18.2 20.9 L12 17.6 L5.8 20.9 L7 14 L2 9.1 L8.9 8.1 Z"],
    strokeWidth: 2,
    strokeLinejoin: "round",
  },
  chevronLeft: {
    viewBox: "0 0 9 15",
    mode: "stroke",
    paths: ["M7.5 1.5 L1.5 7.5 L7.5 13.5"],
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  chevronRight: {
    viewBox: "0 0 9 15",
    mode: "stroke",
    paths: ["M1.5 1.5 L7.5 7.5 L1.5 13.5"],
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
  close: {
    viewBox: "0 0 22 22",
    mode: "stroke",
    paths: ["M3 3 L19 19 M19 3 L3 19"],
    strokeWidth: 2,
    strokeLinecap: "round",
  },

  /* The thin set — 24 grid, 1.5 stroke, flat ends, mitred corners. */

  /** Arrow keys, with 45° heads so they rhyme with the logo's diagonals. */
  arrowLeft: { ...THIN, paths: ["M20 12 L4 12 M10 6 L4 12 L10 18"] },
  arrowRight: { ...THIN, paths: ["M4 12 L20 12 M14 6 L20 12 L14 18"] },
  arrowUp: { ...THIN, paths: ["M12 20 L12 4 M6 10 L12 4 L18 10"] },
  arrowDown: { ...THIN, paths: ["M12 4 L12 20 M6 14 L12 20 L18 14"] },
  /** Hairline counterparts of the answer marks, for inline use at 14–16px. */
  checkThin: { ...THIN, paths: ["M3.5 12 L9 17.5 L20.5 6"] },
  crossThin: { ...THIN, paths: ["M5 5 L19 19 M19 5 L5 19"] },
  starThin: {
    ...THIN,
    paths: ["M12 2.5 L14.53 8.52 L21.03 9.06 L16.09 13.33 L17.58 19.69 L12 16.3 L6.42 19.69 L7.91 13.33 L2.97 9.06 L9.47 8.52 Z"],
  },
  /**
   * Punctuation drawn as marks rather than set as type. A `,` or `.` at key-cap
   * size is a couple of pixels of glyph adrift in a 24px box; built from the
   * family's own dot and a 45° tail they carry the same weight as the arrows
   * beside them. The two share a dot radius and centre so they read as a pair.
   */
  comma: { ...THIN, paths: ["M12.4 12.8 L8.6 16.6"], dots: [[12, 11, 2.6]] },
  period: { ...THIN, paths: [], dots: [[12, 13, 2.6]] },
  chevronLeftThin: { ...THIN, paths: ["M15 4 L7 12 L15 20"] },
  chevronRightThin: { ...THIN, paths: ["M9 4 L17 12 L9 20"] },
  chevronDownThin: { ...THIN, paths: ["M4 9 L12 17 L20 9"] },
  chevronUpThin: { ...THIN, paths: ["M4 15 L12 7 L20 15"] },
  /**
   * The lens is one of the few shapes the family allows to be genuinely round;
   * its handle stays on the 45° diagonal so it still rhymes with the wordmark.
   */
  search: {
    ...THIN,
    paths: ["M17 10.5 A6.5 6.5 0 1 1 4 10.5 A6.5 6.5 0 1 1 17 10.5", "M15.1 15.1 L20 20"],
  },
  info: {
    ...THIN,
    paths: ["M21 12 A9 9 0 1 1 3 12 A9 9 0 1 1 21 12", "M12 11.5 L12 17"],
    dots: [[12, 7.6, 1.15]],
  },
  share: {
    ...THIN,
    paths: ["M12 3.5 L12 15 M6.5 9 L12 3.5 L17.5 9 M4.5 14 L4.5 20.5 L19.5 20.5 L19.5 14"],
  },
  /** Save. `share`'s own tray with the arrow turned around and coming down into it. */
  download: {
    ...THIN,
    paths: ["M12 3.5 L12 15 M6.5 9.5 L12 15 L17.5 9.5 M4.5 14 L4.5 20.5 L19.5 20.5 L19.5 14"],
  },
  /** Copy to clipboard. Two overlapping rectangles, corners on the grid. */
  copy: {
    ...THIN,
    paths: ["M9 3.5 L20.5 3.5 L20.5 15 L15 15", "M3.5 9 L15 9 L15 20.5 L3.5 20.5 Z"],
  },
  /** A URL. Two hooks on the diagonal the wordmark's cut already runs along. */
  link: {
    ...THIN,
    paths: ["M10.5 7.5 L13.5 4.5 A4.243 4.243 0 0 1 19.5 10.5 L16.5 13.5", "M13.5 16.5 L10.5 19.5 A4.243 4.243 0 0 1 4.5 13.5 L7.5 10.5"],
  },
  /** Results — three bars, the progress row's shape at icon scale. */
  results: { ...THIN, paths: ["M4 20 L4 13 M12 20 L12 5 M20 20 L20 9"] },
  list: { ...THIN, paths: ["M4 6 L20 6 M4 12 L20 12 M4 18 L20 18"] },
  plus: { ...THIN, paths: ["M12 4 L12 20 M4 12 L20 12"] },
  /**
   * Start over. The ring is one of the shapes the family allows to be round;
   * the gap and the arrowhead sit on the diagonal so it still reads as drawn
   * with the same pen as the wordmark.
   */
  restart: { ...THIN, paths: ["M12 19 A7 7 0 1 1 19 12", "M16 9 L19 12 L22 9"] },
  /** Leave — an arrow stepping out through the open side of a frame. */
  exit: {
    ...THIN,
    paths: ["M13 4 L4 4 L4 20 L13 20", "M10 12 L20 12 M15.5 7.5 L20 12 L15.5 16.5"],
  },
  more: {
    ...THIN,
    paths: [],
    dots: [
      [5, 12, 1.6],
      [12, 12, 1.6],
      [19, 12, 1.6],
    ],
  },
  /** Light mode. The disc is round like `search`'s lens; the rays stay on 45° diagonals. */
  sun: {
    ...THIN,
    paths: ["M16 12 A4 4 0 1 1 8 12 A4 4 0 1 1 16 12", "M12 2 L12 5", "M12 19 L12 22", "M2 12 L5 12", "M19 12 L22 12", "M4.9 4.9 L7 7", "M17 17 L19.1 19.1", "M4.9 19.1 L7 17", "M17 7 L19.1 4.9"],
  },
  /** Dark mode. One circle bitten out of another, same construction as `restart`'s ring. */
  moon: {
    ...THIN,
    paths: ["M21 12.79 A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79 Z"],
    strokeLinejoin: "round",
  },

  /*
   * Topics.
   *
   * One per subject the questions are tagged with, so a topic list reads as a
   * list of *subjects* rather than eleven identical rows of type. They are all
   * from the thin set — same pen as the rest — and each is a single obvious
   * object rather than a scene: at 20px a bus with passengers is a smudge, a
   * bus is a bus. `topicOther` is the fallback for a tag this set has no
   * drawing for, which is every tag once the real backend supplies its own.
   */
  /** Doprava — a tram/bus body over two wheels. */
  topicTransport: {
    ...THIN,
    paths: ["M5 4 L19 4 L19 17 L5 17 Z", "M5 10 L19 10", "M8 13.5 L16 13.5"],
    dots: [
      [8, 19.5, 1.4],
      [16, 19.5, 1.4],
    ],
  },
  /** Bydlení — a house, gable on the 45°. */
  topicHousing: {
    ...THIN,
    paths: ["M3 12 L12 3 L21 12", "M5.5 9.5 L5.5 20 L18.5 20 L18.5 9.5", "M10 20 L10 14 L14 14 L14 20"],
  },
  /** Energetika — the bolt, every edge on a 45° or a vertical. */
  topicEnergy: {
    ...THIN,
    paths: ["M13.5 2.5 L5 13 L11 13 L10.5 21.5 L19 11 L13 11 Z"],
  },
  /** Školství — a mortarboard over its book block. */
  topicEducation: {
    ...THIN,
    paths: ["M2 9 L12 4 L22 9 L12 14 Z", "M6.5 11.25 L6.5 17 L17.5 17 L17.5 11.25", "M20 10 L20 15"],
  },
  /** Sociální politika — care, drawn as a heart on the family's diagonals. */
  topicSocial: {
    ...THIN,
    paths: ["M12 20.5 L4 12.5 A4.5 4.5 0 0 1 12 7.5 A4.5 4.5 0 0 1 20 12.5 Z"],
  },
  /** Životní prostředí — a tree, canopy as a triangle. */
  topicEnvironment: {
    ...THIN,
    paths: ["M12 3 L4.5 13 L19.5 13 Z", "M12 8.5 L6.5 16 L17.5 16 Z", "M12 16 L12 21"],
  },
  /** Kultura a sport — a note; the stem's head is one of the family's dots. */
  topicCulture: {
    ...THIN,
    paths: ["M9 16 L9 5.5 L19 3 L19 13.5"],
    dots: [
      [6.6, 16.4, 2.4],
      [16.6, 13.9, 2.4],
    ],
  },
  /** Veřejný pořádek — a shield, cut off the diagonals rather than curved. */
  topicSafety: {
    ...THIN,
    paths: ["M12 2.5 L20 5.5 L20 12 L12 21.5 L4 12 L4 5.5 Z"],
  },
  /** Rozpočet — a note of money, with the family's dot for its face. */
  topicBudget: {
    ...THIN,
    paths: ["M2.5 6 L21.5 6 L21.5 18 L2.5 18 Z", "M6 9.5 L6 14.5", "M18 9.5 L18 14.5"],
    dots: [[12, 12, 2.4]],
  },
  /** Transparentnost — an eye, drawn as two 45° cuts rather than a lens. */
  topicTransparency: {
    ...THIN,
    paths: ["M2 12 L7 7 L17 7 L22 12 L17 17 L7 17 Z"],
    dots: [[12, 12, 2.2]],
  },
  /** Veřejné služby — the columned institution, distinct from housing's gable. */
  topicServices: {
    ...THIN,
    paths: ["M2.5 9 L12 4 L21.5 9", "M5.5 9 L5.5 18 M10 9 L10 18 M14 9 L14 18 M18.5 9 L18.5 18", "M3 18 L21 18 M2 20.5 L22 20.5"],
  },
  /** No drawing for this tag — a bookmark, which claims nothing about the subject. */
  topicOther: {
    ...THIN,
    paths: ["M6 3 L18 3 L18 21 L12 15.5 L6 21 Z"],
  },
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;
