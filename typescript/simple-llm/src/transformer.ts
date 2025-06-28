// === transformer.ts ===
import { ActivationFn } from './activation.js';
import { matMul, dot } from './utils.js';
import { selfAttention } from './attention.js';

export class TransformerBlock {
  hiddenDim: number;
  activation: ActivationFn;
  w1: number[][];
  w2: number[][];

  constructor(hiddenDim: number, activation: ActivationFn) {
    this.hiddenDim = hiddenDim;
    this.activation = activation;
    this.w1 = this.initWeight(hiddenDim, hiddenDim);
    this.w2 = this.initWeight(hiddenDim, hiddenDim);
  }

  initWeight(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 0.1 - 0.05)
    );
  }

  forward(x: number[][]): number[][] {
    const attended = selfAttention(x);
    return attended.map(v => this.feedForward(v));
  }

  feedForward(x: number[]): number[] {
    const h1 = matMul(this.w1, x).map(this.activation);
    return matMul(this.w2, h1);
  }
}
