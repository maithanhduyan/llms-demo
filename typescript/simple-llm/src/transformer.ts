// === transformer.ts ===
import { ActivationFn } from './activation.js';
import { dot, matMul, softmax } from './utils.js';

function layerNorm(x: number[][]): number[][] {
  // Đơn giản: chuẩn hóa từng vector theo mean/std
  return x.map(vec => {
    const mean = vec.reduce((a, b) => a + b, 0) / vec.length;
    const std = Math.sqrt(vec.reduce((a, b) => a + (b - mean) ** 2, 0) / vec.length + 1e-6);
    return vec.map(v => (v - mean) / std);
  });
}

export class TransformerBlock {
  hiddenDim: number;
  activation: ActivationFn;
  w1: number[][];
  w2: number[][];
  Wq: number[][];
  Wk: number[][];
  Wv: number[][];

  constructor(hiddenDim: number, activation: ActivationFn) {
    this.hiddenDim = hiddenDim;
    this.activation = activation;
    this.w1 = this.initWeight(hiddenDim, hiddenDim);
    this.w2 = this.initWeight(hiddenDim, hiddenDim);
    this.Wq = this.initWeight(hiddenDim, hiddenDim);
    this.Wk = this.initWeight(hiddenDim, hiddenDim);
    this.Wv = this.initWeight(hiddenDim, hiddenDim);
  }

  initWeight(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 0.1 - 0.05)
    );
  }

  selfAttentionQKV(inputs: number[][]): number[][] {
    // Q = Wq * x, K = Wk * x, V = Wv * x
    const Q = inputs.map(x => matMul(this.Wq, x));
    const K = inputs.map(x => matMul(this.Wk, x));
    const V = inputs.map(x => matMul(this.Wv, x));
    const d = Q[0].length;
    const output: number[][] = [];
    for (let i = 0; i < Q.length; i++) {
      const scores = K.map(k => dot(Q[i], k) / Math.sqrt(d));
      const weights = softmax(scores);
      const attended = new Array(d).fill(0);
      for (let j = 0; j < V.length; j++) {
        for (let k = 0; k < d; k++) {
          attended[k] += weights[j] * V[j][k];
        }
      }
      output.push(attended);
    }
    return output;
  }

  forward(x: number[][]): number[][] {
    // Attention + residual + layer norm
    const attended = this.selfAttentionQKV(x);
    const residual1 = x.map((v, i) => v.map((val, j) => val + attended[i][j]));
    const norm1 = layerNorm(residual1);
    // Feedforward + residual + layer norm
    const ff = norm1.map(v => this.feedForward(v));
    const residual2 = norm1.map((v, i) => v.map((val, j) => val + ff[i][j]));
    const norm2 = layerNorm(residual2);
    return norm2;
  }

  feedForward(x: number[]): number[] {
    const h1 = matMul(this.w1, x).map(this.activation);
    return matMul(this.w2, h1);
  }
}
