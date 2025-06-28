import NeatJS from '../src/index';

describe('Simple XOR demo using Perceptron', () => {
    it('should learn XOR logic', () => {
        const network = NeatJS.architect.Perceptron(2, 4, 1);
        const trainingSet = [
            { input: [0, 0], output: [0] },
            { input: [0, 1], output: [1] },
            { input: [1, 0], output: [1] },
            { input: [1, 1], output: [0] },
        ];
        for (let i = 0; i < 10000; i++) {
            for (const sample of trainingSet) {
                network.activate(sample.input);
                network.propagate(0.3, 0.1, true, sample.output);
            }
        }
        const out00 = network.activate([0, 0])[0];
        const out01 = network.activate([0, 1])[0];
        const out10 = network.activate([1, 0])[0];
        const out11 = network.activate([1, 1])[0];
        expect(out00).toBeLessThan(0.1);
        expect(out01).toBeGreaterThan(0.9);
        expect(out10).toBeGreaterThan(0.9);
        expect(out11).toBeLessThan(0.1);
    });
});

