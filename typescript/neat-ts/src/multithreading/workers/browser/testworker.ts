// Converted from js/multithreading/workers/browser/testworker.js to TypeScript
import multi, { activations, testSerializedSet } from '../../multi';

/**
 * WebWorker for NEAT-TS
 */
class TestWorker {
    url: string;
    worker: Worker;
    constructor(dataSet: any[], cost: any) {
        let blob = new Blob([this._createBlobString(cost)]);
        this.url = window.URL.createObjectURL(blob);
        this.worker = new Worker(this.url);
        let data = { set: new Float64Array(dataSet).buffer };
        this.worker.postMessage(data, [data.set]);
    }
    evaluate(network: any): Promise<number> {
        return new Promise((resolve) => {
            let serialized = network.serialize();
            let data = {
                activations: new Float64Array(serialized[0]).buffer,
                states: new Float64Array(serialized[1]).buffer,
                conns: new Float64Array(serialized[2]).buffer
            };
            this.worker.onmessage = function (e) {
                let error = new Float64Array(e.data.buffer)[0];
                resolve(error);
            };
            this.worker.postMessage(data, [data.activations, data.states, data.conns]);
        });
    }
    terminate(): void {
        this.worker.terminate();
        window.URL.revokeObjectURL(this.url);
    }
    _createBlobString(cost: any): string {
        let source = `
      var F = [${activations.toString()}];
      var cost = ${cost.toString()};
      var multi = {
        deserializeDataSet: ${multi.deserializeDataSet.toString()},
        testSerializedSet: ${testSerializedSet.toString()},
        activateSerializedNetwork: ${multi.activateSerializedNetwork.toString()}
      };
      this.onmessage = function (e) {
        if(typeof e.data.set === 'undefined'){
          var A = new Float64Array(e.data.activations);
          var S = new Float64Array(e.data.states);
          var data = new Float64Array(e.data.conns);
          var error = multi.testSerializedSet(set, cost, A, S, data, F);
          var answer = { buffer: new Float64Array([error ]).buffer };
          self.postMessage(answer, [answer.buffer]);
        } else {
          set = new Float64Array(e.data.set);
        }
      }`;
        return source;
    }
}

export default TestWorker;
