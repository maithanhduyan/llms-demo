// === miniLLM.ts ===
import { relu } from './activation.js';
import { TransformerBlock } from './transformer.js';
import { matMul } from './utils.js';

export class MiniLLM {
  inputDim: number;
  patchSize: number;
  numPatches: number;
  patchDim: number;
  patchEmbedding: number[][];
  transformer: TransformerBlock;
  classifier: number[][];

  constructor(inputDim: number, patchSize: number, numClasses: number) {
    this.inputDim = inputDim;
    this.patchSize = patchSize;
    this.patchDim = patchSize * patchSize;
    this.numPatches = (inputDim * inputDim) / (patchSize * patchSize);
    this.patchEmbedding = this.initWeight(64, this.patchDim); // 64-dim embedding
    this.transformer = new TransformerBlock(64, relu);
    this.classifier = this.initWeight(numClasses, 64);
  }

  initWeight(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() * 0.1 - 0.05)
    );
  }

  embedPatches(image: number[]): number[][] {
    const patches: number[][] = [];
    for (let i = 0; i < image.length; i += this.patchDim) {
      patches.push(image.slice(i, i + this.patchDim));
    }
    return patches;
  }

  patchEmbed(patch: number[]): number[] {
    // patch: [patchDim], patchEmbedding: [64, patchDim] => [64]
    return matMul(this.patchEmbedding, patch);
  }

  forward(image: number[]): number[] {
    const patches = this.embedPatches(image);
    const embedded = patches.map(patch => this.patchEmbed(patch)); // [numPatches, 64]
    const encoded = this.transformer.forward(embedded);
    const meanVec = encoded.reduce((acc, vec) => acc.map((v, i) => v + vec[i]), new Array(64).fill(0)).map(v => v / encoded.length);
    return matMul(this.classifier, meanVec);
  }
}
