// RC circuit time constant and charge/discharge calculations

/**
 * Calculate RC time constant
 * @param {number} R - Resistance in ohms
 * @param {number} C - Capacitance in farads
 * @returns {number} Time constant τ in seconds
 */
export function rcTau(R, C) {
  return R * C;
}

/**
 * Calculate voltage across capacitor during charging
 * v(t) = V0 * (1 - e^(-t/RC))
 * @param {number} V0 - Supply voltage (final voltage)
 * @param {number} R - Resistance in ohms
 * @param {number} C - Capacitance in farads
 * @param {number} t - Time in seconds
 * @returns {number} Voltage at time t
 */
export function rcCharge(V0, R, C, t) {
  const tau = rcTau(R, C);
  return V0 * (1 - Math.exp(-t / tau));
}

/**
 * Calculate voltage across capacitor during discharging
 * v(t) = V0 * e^(-t/RC)
 * @param {number} V0 - Initial voltage
 * @param {number} R - Resistance in ohms
 * @param {number} C - Capacitance in farads
 * @param {number} t - Time in seconds
 * @returns {number} Voltage at time t
 */
export function rcDischarge(V0, R, C, t) {
  const tau = rcTau(R, C);
  return V0 * Math.exp(-t / tau);
}