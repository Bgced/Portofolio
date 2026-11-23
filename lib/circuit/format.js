/**
 * Format resistance in engineering notation with SI units
 * @param {number} ohms - Resistance in ohms
 * @returns {string} Formatted resistance (e.g., "4.7 kΩ")
 */
export function formatOhms(ohms) {
  if (ohms === 0) return "0 Ω";
  if (!Number.isFinite(ohms)) return "∞ Ω";

  const abs = Math.abs(ohms);

  if (abs >= 1e9) {
    return `${(ohms / 1e9).toFixed(2)} GΩ`;
  } else if (abs >= 1e6) {
    return `${(ohms / 1e6).toFixed(2)} MΩ`;
  } else if (abs >= 1e3) {
    const val = ohms / 1e3;
    // Use comma as decimal separator, no trailing zeros
    const formatted = val.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    return `${formatted} kΩ`;
  } else if (abs >= 1) {
    const formatted = ohms.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
    return `${formatted} Ω`;
  } else {
    return `${ohms.toFixed(3)} Ω`;
  }
}

/**
 * Format value with SI unit prefix
 * @param {number} value - Value to format
 * @param {string} unit - Unit string (e.g., "F", "A", "V")
 * @returns {string} Formatted value with appropriate SI prefix
 */
export function formatSI(value, unit) {
  if (value === 0) return `0 ${unit}`;
  if (!Number.isFinite(value)) return `∞ ${unit}`;

  const abs = Math.abs(value);
  let prefix = "";
  let scaled = value;

  if (abs >= 1e9) {
    prefix = "G";
    scaled = value / 1e9;
  } else if (abs >= 1e6) {
    prefix = "M";
    scaled = value / 1e6;
  } else if (abs >= 1e3) {
    prefix = "k";
    scaled = value / 1e3;
  } else if (abs >= 1) {
    prefix = "";
    scaled = value;
  } else if (abs >= 1e-3) {
    prefix = "m";
    scaled = value / 1e-3;
  } else if (abs >= 1e-6) {
    prefix = "µ";
    scaled = value / 1e-6;
  } else if (abs >= 1e-9) {
    prefix = "n";
    scaled = value / 1e-9;
  } else if (abs >= 1e-12) {
    prefix = "p";
    scaled = value / 1e-12;
  }

  // Format with appropriate decimal places, use comma separator
  const decimals = Math.abs(scaled) >= 100 ? 1 : Math.abs(scaled) >= 10 ? 2 : 3;
  const formatted = scaled.toFixed(decimals).replace(/\.?0+$/, '').replace('.', ',');

  return `${formatted} ${prefix}${unit}`;
}