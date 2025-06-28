/**
 * WORKERS MODULE (TypeScript)
 * This module exports worker implementations for different environments (browser, node).
 * All worker classes should be imported and typed explicitly.
 */
// import { TestWorker as NodeTestWorker } from './node/testworker';
import TestWorker from './browser/testworker';

/**
 * Workers object containing worker implementations for different environments.
 */
const workers = {
    node: {
        // TestWorker: NodeTestWorker
    },
    browser: {
        TestWorker: TestWorker
    }
};

export default workers;
