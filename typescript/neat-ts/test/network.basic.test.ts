import Connection from '../src/architecture/connection';
import Network from '../src/architecture/network';
import Node from '../src/architecture/node';

describe('Network', () => {
    it('should create a network with correct input/output nodes', () => {
        const net = new Network(2, 1);
        expect(net.input).toBe(2);
        expect(net.output).toBe(1);
        expect(net.nodes.length).toBe(3);
        expect(net.nodes.filter(n => n.type === 'input').length).toBe(2);
        expect(net.nodes.filter(n => n.type === 'output').length).toBe(1);
    });

    it('should activate and propagate without error', () => {
        const net = new Network(2, 1);
        const output = net.activate([1, 0]);
        expect(Array.isArray(output)).toBe(true);
        expect(output.length).toBe(1);
        expect(typeof output[0]).toBe('number');
        expect(() => net.propagate(0.3, 0.1, true, [0.5])).not.toThrow();
    });
});

describe('Node', () => {
    it('should activate with input', () => {
        const node = new Node('input');
        expect(node.activate(1)).toBe(1);
    });

    it('should connect to another node', () => {
        const n1 = new Node('input');
        const n2 = new Node('output');
        const conns = n1.connect(n2);
        expect(conns.length).toBeGreaterThan(0);
        expect(conns[0].from).toBe(n1);
        expect(conns[0].to).toBe(n2);
    });
});

describe('Connection', () => {
    it('should create a connection and serialize to JSON', () => {
        const n1 = new Node('input');
        const n2 = new Node('output');
        const conn = new Connection(n1, n2, 0.5);
        const json = conn.toJSON();
        expect(json.weight).toBe(0.5);
    });
});
