// IEC 60062 resistor color code utilities
export const DIGIT_COLORS = [
  "black", "brown", "red", "orange", "yellow",
  "green", "blue", "violet", "grey", "white"
];

export const MULTIPLIER_COLORS = [
  "black", "brown", "red", "orange", "yellow",
  "green", "blue", "violet", "grey", "white",
  "gold", "silver"
];

export const TOLERANCE_COLORS = [
  "brown", "red", "green", "blue", "violet",
  "grey", "gold", "silver"
];

const COLOR_HEX = {
  black: "#000000",
  brown: "#8B4513",
  red: "#FF0000",
  orange: "#FF8C00",
  yellow: "#FFD700",
  green: "#008000",
  blue: "#0000FF",
  violet: "#8B00FF",
  grey: "#808080",
  white: "#FFFFFF",
  gold: "#D4AF37",
  silver: "#C0C0C0"
};

const DIGIT_MAP = {
  black: 0, brown: 1, red: 2, orange: 3, yellow: 4,
  green: 5, blue: 6, violet: 7, grey: 8, white: 9
};

const MULTIPLIER_MAP = {
  black: 1, brown: 10, red: 100, orange: 1e3, yellow: 1e4,
  green: 1e5, blue: 1e6, violet: 1e7, grey: 1e8, white: 1e9,
  gold: 0.1, silver: 0.01
};

const TOLERANCE_MAP = {
  brown: 0.01,
  red: 0.02,
  green: 0.005,
  blue: 0.0025,
  violet: 0.001,
  grey: 0.0005,
  gold: 0.05,
  silver: 0.10
};

/**
 * Parse resistor bands (4-band or 5-band) and return resistance in ohms
 * @param {string[]} bands - Array of color names (e.g., ["yellow", "violet", "red", "gold"])
 * @returns {number} Resistance in ohms
 */
export function resistorToOhms(bands) {
  if (bands.length === 4) {
    const [d1, d2, mult, tol] = bands;
    const digit1 = DIGIT_MAP[d1];
    const digit2 = DIGIT_MAP[d2];
    const multiplier = MULTIPLIER_MAP[mult];
    const baseValue = digit1 * 10 + digit2;
    return baseValue * multiplier;
  } else if (bands.length === 5) {
    const [d1, d2, d3, mult, tol] = bands;
    const digit1 = DIGIT_MAP[d1];
    const digit2 = DIGIT_MAP[d2];
    const digit3 = DIGIT_MAP[d3];
    const multiplier = MULTIPLIER_MAP[mult];
    const baseValue = digit1 * 100 + digit2 * 10 + digit3;
    return baseValue * multiplier;
  }
  throw new Error("Invalid number of bands (must be 4 or 5)");
}

/**
 * Get tolerance percentage from tolerance color
 * @param {string} color - Tolerance color name
 * @returns {number} Tolerance as decimal (e.g., 0.05 for ±5%)
 */
export function getTolerance(color) {
  return TOLERANCE_MAP[color] || 0;
}

/**
 * Get hex color code for a color name
 * @param {string} name - Color name
 * @returns {string} Hex color code
 */
export function getColorHex(name) {
  return COLOR_HEX[name] || "#000000";
}

/**
 * Convert resistance value to nearest resistor bands (reverse lookup)
 * @param {number} ohms - Resistance in ohms
 * @param {number} bandCount - Number of bands (4 or 5)
 * @returns {string[]} Array of color names
 */
export function ohmsToResistor(ohms, bandCount = 4) {
  if (ohms <= 0 || !Number.isFinite(ohms)) {
    throw new Error("Resistance must be positive");
  }

  const tolerance = bandCount === 4 ? "gold" : "brown";

  if (bandCount === 4) {
    // 4-band: 2 digits + multiplier
    const log = Math.log10(ohms);
    const exponent = Math.floor(log);
    const normalized = ohms / Math.pow(10, exponent);

    // Find best 2-digit match
    let bestMatch = { digits: 10, mult: 0, error: Infinity };
    for (let d1 = 0; d1 < 10; d1++) {
      for (let d2 = 0; d2 < 10; d2++) {
        const base = d1 * 10 + d2;
        for (let mult = -2; mult <= 9; mult++) {
          const value = base * Math.pow(10, mult);
          const err = Math.abs(value - ohms) / ohms;
          if (err < bestMatch.error) {
            bestMatch = { digits: base, mult, error: err };
          }
        }
      }
    }

    const d1 = Math.floor(bestMatch.digits / 10);
    const d2 = bestMatch.digits % 10;

    // Find closest multiplier color
    let multColor = "black";
    let multError = Infinity;
    for (const [color, value] of Object.entries(MULTIPLIER_MAP)) {
      const err = Math.abs(value - Math.pow(10, bestMatch.mult));
      if (err < multError) {
        multError = err;
        multColor = color;
      }
    }

    return [
      DIGIT_COLORS[d1],
      DIGIT_COLORS[d2],
      multColor,
      tolerance
    ];
  } else {
    // 5-band: 3 digits + multiplier
    let bestMatch = { digits: 100, mult: 0, error: Infinity };
    for (let d1 = 0; d1 < 10; d1++) {
      for (let d2 = 0; d2 < 10; d2++) {
        for (let d3 = 0; d3 < 10; d3++) {
          const base = d1 * 100 + d2 * 10 + d3;
          for (let mult = -2; mult <= 9; mult++) {
            const value = base * Math.pow(10, mult);
            const err = Math.abs(value - ohms) / ohms;
            if (err < bestMatch.error) {
              bestMatch = { digits: base, mult, error: err };
            }
          }
        }
      }
    }

    const d1 = Math.floor(bestMatch.digits / 100);
    const d2 = Math.floor((bestMatch.digits % 100) / 10);
    const d3 = bestMatch.digits % 10;

    let multColor = "black";
    let multError = Infinity;
    for (const [color, value] of Object.entries(MULTIPLIER_MAP)) {
      const err = Math.abs(value - Math.pow(10, bestMatch.mult));
      if (err < multError) {
        multError = err;
        multColor = color;
      }
    }

    return [
      DIGIT_COLORS[d1],
      DIGIT_COLORS[d2],
      DIGIT_COLORS[d3],
      multColor,
      tolerance
    ];
  }
}