import { ValueTransformer } from 'typeorm';

/**
 * Converts between a Postgres BIGINT column and a JS number.
 *
 * The pg driver returns BIGINT as a string, because a JS number only holds
 * integers exactly up to Number.MAX_SAFE_INTEGER (2^53 - 1, about 90 trillion
 * UZS in tiyin). Our amounts stay far below that, so we use plain numbers, but
 * throw instead of silently rounding if a value ever goes past the limit.
 */
export const bigintToNumber: ValueTransformer = {
  // App -> database. Only plain numbers are checked; anything else (undefined
  // when a column is left to its default, query operators) passes through.
  to(value: unknown) {
    if (typeof value === 'number' && !Number.isSafeInteger(value)) {
      throw new Error(
        `Cannot write ${value} to a BIGINT column: not a safe integer`,
      );
    }
    return value;
  },

  // Database -> app.
  from(value: string | null) {
    if (value === null) {
      return null;
    }
    const n = Number(value);
    if (!Number.isSafeInteger(n)) {
      throw new Error(
        `BIGINT value ${value} exceeds the JS safe integer range`,
      );
    }
    return n;
  },
};
