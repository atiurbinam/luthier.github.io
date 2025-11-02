/**
 * Generates a Euclidean rhythm pattern using an algorithm equivalent to Bjorklund's,
 * often implemented as Bresenham's line algorithm for simplicity and efficiency.
 * @param steps The total number of steps in the sequence (e.g., 16).
 * @param pulses The number of active pulses (notes) to distribute.
 * @returns An array of booleans representing the rhythm pattern.
 */
export const generateEuclideanPattern = (steps: number, pulses: number): boolean[] => {
  if (pulses > steps || pulses < 0 || steps <= 0) {
    return Array(steps).fill(false);
  }
  if (pulses === steps) {
    return Array(steps).fill(true);
  }

  const result: boolean[] = [];
  let accumulator = 0;
  for (let i = 0; i < steps; i++) {
    accumulator += pulses;
    if (accumulator >= steps) {
      accumulator -= steps;
      result.push(true);
    } else {
      result.push(false);
    }
  }
  return result;
};