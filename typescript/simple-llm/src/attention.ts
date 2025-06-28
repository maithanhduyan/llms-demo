// === attention.ts ===
import { dot, softmax } from './utils.js';

export function selfAttention(inputs: number[][]): number[][] {
  const d = inputs[0].length;
  const output: number[][] = [];

  for (let i = 0; i < inputs.length; i++) {
    const scores = inputs.map(j => dot(inputs[i], j));
    const weights = softmax(scores);
    const attended = new Array(d).fill(0);

    for (let j = 0; j < inputs.length; j++) {
      for (let k = 0; k < d; k++) {
        attended[k] += weights[j] * inputs[j][k];
      }
    }
    output.push(attended);
  }

  return output;
}
