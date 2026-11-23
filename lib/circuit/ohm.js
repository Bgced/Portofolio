// E24 resistor series (per decade)
export const E24 = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4,
  2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2,
  6.8, 7.5, 8.2, 9.1
];

/**
 * Round a resistance value UP to the nearest E24 value
 * @param {number} ohms - Resistance in ohms
 * @returns {number} Nearest E24 value (rounded up)
 */
export function roundUpE24(ohms) {
  if (ohms <= 0 || !Number.isFinite(ohms)) {
    throw new Error("Resistance must be positive");
  }

  const log = Math.log10(ohms);
  const exponent = Math.floor(log);
  const normalized = ohms / Math.pow(10, exponent);

  // Find the first E24 value >= normalized
  let found = null;
  for (const val of E24) {
    if (val >= normalized - 0.001) { // small tolerance for floating point
      found = val;
      break;
    }
  }

  // If we exceeded 9.1, round up to next decade
  if (found === null) {
    return 10.0 * Math.pow(10, exponent);
  }

  return found * Math.pow(10, exponent);
}

/**
 * Solve Ohm's Law: given any 2 of V, I, R, return all 4 including P (power)
 * @param {{V?: number, I?: number, R?: number}} params - Voltage (V), Current (A), Resistance (Ω)
 * @returns {{V: number, I: number, R: number, P: number}} All four parameters
 */
export function solveOhm({ V, I, R }) {
  let voltage, current, resistance;

  if (V !== undefined && I !== undefined) {
    voltage = V;
    current = I;
    resistance = V / I;
  } else if (V !== undefined && R !== undefined) {
    voltage = V;
    resistance = R;
    current = V / R;
  } else if (I !== undefined && R !== undefined) {
    current = I;
    resistance = R;
    voltage = I * R;
  } else {
    throw new Error("Provide at least two of: V, I, R");
  }

  const power = voltage * current;

  return { V: voltage, I: current, R: resistance, P: power };
}

/**
 * Calculate LED resistor requirements
 * @param {{Vs: number, Vf: number, If_mA: number}} params - Supply voltage, LED forward voltage, LED current (mA)
 * @returns {{R: number, R_e24: number, P_R_W: number, valid: boolean, message: string}} Results
 */
export function solveLed({ Vs, Vf, If_mA }) {
  if (Vs <= Vf) {
    return {
      R: 0,
      R_e24: 0,
      P_R_W: 0,
      valid: false,
      message: "Supply voltage must be greater than LED forward voltage"
    };
  }

  const If = If_mA / 1000; // Convert mA to A
  const R = (Vs - Vf) / If;
  const R_e24 = roundUpE24(R);

  // Power dissipated by resistor: P = I² × R
  const P_R_W = If * If * R_e24;

  return {
    R,
    R_e24,
    P_R_W,
    valid: true,
    message: ""
  };
}