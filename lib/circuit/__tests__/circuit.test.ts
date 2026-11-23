import { describe, it, expect } from 'vitest';
import { resistorToOhms, ohmsToResistor, getTolerance, DIGIT_COLORS } from '../resistor.js';
import { solveOhm, solveLed, roundUpE24, E24 } from '../ohm.js';
import { rcTau, rcCharge, rcDischarge } from '../rc.js';
import { formatOhms, formatSI } from '../format.js';

describe('resistorToOhms', () => {
  it('should parse yellow-violet-red-gold as 4700 ohms', () => {
    const bands = ['yellow', 'violet', 'red', 'gold'];
    const result = resistorToOhms(bands);
    expect(result).toBe(4700);
  });

  it('should format 4700 ohms as "4,7 kΩ"', () => {
    const formatted = formatOhms(4700);
    expect(formatted).toBe('4,7 kΩ');
  });

  it('should get ±5% tolerance for gold', () => {
    const tol = getTolerance('gold');
    expect(tol).toBe(0.05);
  });

  it('should parse 5-band resistors correctly', () => {
    const bands = ['brown', 'black', 'black', 'brown', 'brown']; // 1kΩ 1%
    const result = resistorToOhms(bands);
    expect(result).toBe(1000);
  });
});

describe('ohmsToResistor', () => {
  it('should reverse resistorToOhms for 4700 ohms', () => {
    const bands = ohmsToResistor(4700, 4);
    expect(bands[0]).toBe('yellow');
    expect(bands[1]).toBe('violet');
    expect(bands[2]).toBe('red');
    expect(bands[3]).toBe('gold');

    // Verify by converting back
    const ohms = resistorToOhms(bands);
    expect(ohms).toBe(4700);
  });

  it('should handle 5-band reverse lookup', () => {
    const bands = ohmsToResistor(1000, 5);
    const ohms = resistorToOhms(bands);
    expect(ohms).toBeCloseTo(1000, -1); // Within 10 ohms
  });
});

describe('solveOhm', () => {
  it('should solve V and R given I and R', () => {
    const result = solveOhm({ I: 0.001, R: 1000 });
    expect(result.V).toBe(1);
    expect(result.I).toBe(0.001);
    expect(result.R).toBe(1000);
    expect(result.P).toBe(0.001);
  });

  it('should solve I given V and R', () => {
    const result = solveOhm({ V: 9, R: 1000 });
    expect(result.I).toBe(0.009);
  });

  it('should calculate power correctly', () => {
    const result = solveOhm({ V: 12, I: 0.5 });
    expect(result.P).toBe(6);
  });
});

describe('roundUpE24', () => {
  it('should round 700 up to 750', () => {
    const result = roundUpE24(700);
    expect(result).toBe(750);
  });

  it('should round up to next value', () => {
    const result = roundUpE24(710);
    expect(result).toBe(750);
  });

  it('should handle decade boundaries', () => {
    const result = roundUpE24(950);
    expect(result).toBe(1000);
  });
});

describe('solveLed', () => {
  it('should calculate LED resistor for 9V supply, 2V LED, 10mA', () => {
    const result = solveLed({ Vs: 9, Vf: 2, If_mA: 10 });
    expect(result.R).toBe(700);
    expect(result.R_e24).toBe(750);
    expect(result.P_R_W).toBeCloseTo(0.07, 2);
    expect(result.valid).toBe(true);
  });

  it('should reject invalid voltage (Vs <= Vf)', () => {
    const result = solveLed({ Vs: 2, Vf: 2, If_mA: 10 });
    expect(result.valid).toBe(false);
    expect(result.message).toContain('greater than');
  });

  it('should reject Vs < Vf', () => {
    const result = solveLed({ Vs: 1.5, Vf: 2, If_mA: 10 });
    expect(result.valid).toBe(false);
  });
});

describe('rcTau', () => {
  it('should calculate τ = 1ms for 1kΩ and 1µF', () => {
    const tau = rcTau(1000, 1e-6);
    expect(tau).toBe(1e-3);
  });
});

describe('rcCharge', () => {
  it('should reach 63.2% at t = τ', () => {
    const V0 = 10;
    const R = 1000;
    const C = 1e-6;
    const tau = rcTau(R, C);
    const v = rcCharge(V0, R, C, tau);
    // At t = τ, v = V0 * (1 - 1/e) ≈ 0.632 * V0
    expect(v).toBeCloseTo(6.32, 1);
  });

  it('should reach 99.3% at t = 5τ', () => {
    const V0 = 10;
    const R = 1000;
    const C = 1e-6;
    const tau = rcTau(R, C);
    const v = rcCharge(V0, R, C, 5 * tau);
    // At t = 5τ, v ≈ 0.993 * V0
    expect(v).toBeCloseTo(9.93, 1);
  });
});

describe('rcDischarge', () => {
  it('should decay to 36.8% at t = τ', () => {
    const V0 = 10;
    const R = 1000;
    const C = 1e-6;
    const tau = rcTau(R, C);
    const v = rcDischarge(V0, R, C, tau);
    // At t = τ, v = V0 * (1/e) ≈ 0.368 * V0
    expect(v).toBeCloseTo(3.68, 1);
  });

  it('should decay to 0.7% at t = 5τ', () => {
    const V0 = 10;
    const R = 1000;
    const C = 1e-6;
    const tau = rcTau(R, C);
    const v = rcDischarge(V0, R, C, 5 * tau);
    // At t = 5τ, v ≈ 0.007 * V0
    expect(v).toBeCloseTo(0.067, 2);
  });
});

describe('formatOhms', () => {
  it('should format 4700 as "4,7 kΩ"', () => {
    expect(formatOhms(4700)).toBe('4,7 kΩ');
  });

  it('should format 1000 as "1 kΩ"', () => {
    expect(formatOhms(1000)).toBe('1 kΩ');
  });

  it('should format 100 as "100 Ω"', () => {
    expect(formatOhms(100)).toBe('100 Ω');
  });

  it('should format 0 as "0 Ω"', () => {
    expect(formatOhms(0)).toBe('0 Ω');
  });
});

describe('formatSI', () => {
  it('should format farads with µ prefix', () => {
    const formatted = formatSI(1e-6, 'F');
    expect(formatted).toContain('µF');
  });

  it('should format resistance', () => {
    const formatted = formatSI(4700, 'Ω');
    expect(formatted).toContain('kΩ');
  });
});