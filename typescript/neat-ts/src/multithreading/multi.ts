// Converted from js/multithreading/multi.js to TypeScript
import workers from './workers/workers';

/**
 * Multithreading utilities for NEAT-TS
 */
const multi = {
    workers: workers,
    serializeDataSet: function (dataSet: any[]): number[] {
        let serialized = [dataSet[0].input.length, dataSet[0].output.length];
        for (let i = 0; i < dataSet.length; i++) {
            let j;
            for (j = 0; j < serialized[0]; j++) {
                serialized.push(dataSet[i].input[j]);
            }
            for (j = 0; j < serialized[1]; j++) {
                serialized.push(dataSet[i].output[j]);
            }
        }
        return serialized;
    },
    activateSerializedNetwork: function (input: number[], A: any[], S: any[], data: any[], F: any[]): any[] {
        for (let i = 0; i < data[0]; i++) A[i] = input[i];
        for (let i = 2; i < data.length; i++) {
            let index = data[i++];
            let bias = data[i++];
            let squash = data[i++];
            let selfweight = data[i++];
            let selfgater = data[i++];
            S[index] = (selfgater === -1 ? 1 : A[selfgater]) * selfweight * S[index] + bias;
            while (data[i] !== -2) {
                S[index] += A[data[i++]] * data[i++] * (data[i++] === -1 ? 1 : A[data[i - 1]]);
            }
            A[index] = F[squash](S[index]);
        }
        let output = [];
        for (let i = A.length - data[1]; i < A.length; i++) output.push(A[i]);
        return output;
    },
    deserializeDataSet: function (serializedSet: number[]): any[] {
        let set = [];
        let sampleSize = serializedSet[0] + serializedSet[1];
        for (let i = 0; i < (serializedSet.length - 2) / sampleSize; i++) {
            let input = [];
            for (let j = 2 + i * sampleSize; j < 2 + i * sampleSize + serializedSet[0]; j++) {
                input.push(serializedSet[j]);
            }
            let output = [];
            for (let j = 2 + i * sampleSize + serializedSet[0]; j < 2 + i * sampleSize + sampleSize; j++) {
                output.push(serializedSet[j]);
            }
            set.push(input);
            set.push(output);
        }
        return set;
    },
};

// List of compiled activation functions in a certain order
export const activations: ((x: number) => number)[] = [
    (x: number) => 1 / (1 + Math.exp(-x)),
    (x: number) => Math.tanh(x),
    (x: number) => x,
    (x: number) => (x > 0 ? 1 : 0),
    (x: number) => (x > 0 ? x : 0),
    (x: number) => x / (1 + Math.abs(x)),
    (x: number) => Math.sin(x),
    (x: number) => Math.exp(-Math.pow(x, 2)),
    (x: number) => (Math.sqrt(Math.pow(x, 2) + 1) - 1) / 2 + x,
    (x: number) => (x > 0 ? 1 : -1),
    (x: number) => 2 / (1 + Math.exp(-x)) - 1,
    (x: number) => Math.max(-1, Math.min(1, x)),
    (x: number) => Math.abs(x),
    (x: number) => 1 - x,
    (x: number) => {
        const a = 1.6732632423543772;
        return (x > 0 ? x : a * Math.exp(x) - a) * 1.050700987355480;
    }
];

// Test a serialized set using a cost function and activations
export function testSerializedSet(
    set: number[][],
    cost: (target: number[], output: number[]) => number,
    A: number[],
    S: number[],
    data: number[],
    F: ((x: number) => number)[]
): number {
    let error = 0;
    for (let i = 0; i < set.length; i += 2) {
        const output = multi.activateSerializedNetwork(set[i], A, S, data, F);
        error += cost(set[i + 1], output);
    }
    return error / (set.length / 2);
}

// Attach to multi for compatibility
(multi as any).activations = activations;
(multi as any).testSerializedSet = testSerializedSet;

export default multi;
