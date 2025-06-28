import NeatJS from '../src/index';

describe('Network mutation and crossover', () => {
    it('should mutate a network by adding a node and a connection', () => {
        const network = NeatJS.architect.Perceptron(2, 4, 1);
        const originalNodeCount = network.nodes.length;
        const originalConnCount = network.connections.length;
        network.mutate(NeatJS.methods.mutation.ADD_NODE);
        network.mutate(NeatJS.methods.mutation.ADD_CONN);
        expect(network.nodes.length).toBeGreaterThan(originalNodeCount);
        expect(network.connections.length).toBeGreaterThan(originalConnCount);
    });

    it('should perform crossover between two networks', () => {
        const parent1 = NeatJS.architect.Perceptron(2, 4, 1);
        const parent2 = NeatJS.architect.Perceptron(2, 4, 1);
        // Mutate parents to make them different
        parent1.mutate(NeatJS.methods.mutation.ADD_NODE);
        parent2.mutate(NeatJS.methods.mutation.ADD_CONN);
        // Crossover
        const child = (NeatJS.Network as any).crossOver(parent1, parent2, false);
        expect(child.nodes.length).toBeGreaterThan(0);
        expect(child.connections.length).toBeGreaterThan(0);
        expect(child.input).toBe(parent1.input);
        expect(child.output).toBe(parent1.output);
    });
});
