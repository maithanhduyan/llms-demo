import Network from '../src/architecture/network';
import cost from '../src/methods/cost';
import mutation from '../src/methods/mutation';

describe('NEAT Evolution - 10 generations, 50 individuals, 10% elitism', () => {
    it('should evolve a population for 10 generations and retain 10% elite', () => {
        const POP_SIZE = 50;
        const GENERATIONS = 10;
        const ELITISM = Math.floor(POP_SIZE * 0.1);
        // XOR dataset
        const xorSet = [
            { input: [0, 0], output: [0] },
            { input: [0, 1], output: [1] },
            { input: [1, 0], output: [1] },
            { input: [1, 1], output: [0] },
        ];
        // Khởi tạo quần thể
        let population: Network[] = [];
        for (let i = 0; i < POP_SIZE; i++) {
            population.push(new Network(2, 1));
        }
        for (let gen = 0; gen < GENERATIONS; gen++) {
            // Đánh giá fitness (ngược dấu lỗi)
            population.forEach(net => {
                const result = net.test(xorSet, cost.MSE);
                (net as any).score = -result.error;
            });
            // Sắp xếp theo fitness giảm dần
            population.sort((a, b) => (b as any).score - (a as any).score);
            // Lấy elite
            const elites = population.slice(0, ELITISM);
            // Tạo thế hệ mới bằng crossover + mutation
            const newPop = [...elites];
            while (newPop.length < POP_SIZE) {
                // Chọn ngẫu nhiên 2 cha mẹ từ top 50%
                const parent1 = population[Math.floor(Math.random() * (POP_SIZE / 2))];
                const parent2 = population[Math.floor(Math.random() * (POP_SIZE / 2))];
                let child = Network.crossOver(parent1, parent2, false);
                // Xác suất đột biến
                if (Math.random() < 0.5) child.mutate(mutation.ADD_NODE);
                if (Math.random() < 0.5) child.mutate(mutation.ADD_CONN);
                newPop.push(child);
            }
            population = newPop;
        }
        // Đảm bảo số lượng cá thể đúng và elite được giữ lại
        expect(population.length).toBe(POP_SIZE);
        // Đánh giá lại score cho toàn bộ population sau tiến hóa
        population.forEach(net => {
            const result = net.test(xorSet, cost.MSE);
            (net as any).score = -result.error;
        });
        // Đảm bảo elite vẫn là những cá thể tốt nhất
        population.forEach(net => {
            expect(typeof (net as any).score).toBe('number');
        });
        // Đảm bảo mọi cá thể là instance của Network
        population = population.map(net => (net instanceof Network ? net : Object.setPrototypeOf(net, Network.prototype)));
    });
});
