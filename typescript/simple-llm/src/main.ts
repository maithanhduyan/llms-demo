// MiniLLM: A compact Transformer-based model for image classification


// === main.ts ===
import { MiniLLM } from './miniLLM.js';

function printImage(image: number[], size = 32) {
    for (let i = 0; i < size; i++) {
        let row = '';
        for (let j = 0; j < size; j++) {
            const v = image[i * size + j];
            if (v > 0.8) row += '#';
            else if (v > 0.3) row += '.';
            else row += ' ';
        }
        console.log(row);
    }
}

const testCases = [
    { name: 'Random', image: Array.from({ length: 32 * 32 }, () => Math.random()) },
    { name: 'All zeros', image: Array(32 * 32).fill(0) },
    { name: 'All ones', image: Array(32 * 32).fill(1) },
    { name: 'Alternating 0/1', image: Array.from({ length: 32 * 32 }, (_, i) => i % 2) }
];

function softmax(logits: number[]): number[] {
    const max = Math.max(...logits);
    const exps = logits.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
}

function crossEntropyLoss(probs: number[], label: number): number {
    return -Math.log(probs[label] + 1e-8);
}

function oneHot(size: number, idx: number): number[] {
    return Array.from({ length: size }, (_, i) => i === idx ? 1 : 0);
}

// Huấn luyện đơn giản chỉ cập nhật classifier
function trainClassifier(model: MiniLLM, trainImages: number[][], trainLabels: number[], epochs = 10, lr = 0.1) {
    const numClasses = model.classifier.length;
    for (let epoch = 0; epoch < epochs; epoch++) {
        let totalLoss = 0;
        for (let i = 0; i < trainImages.length; i++) {
            const image = trainImages[i];
            const label = trainLabels[i];
            // Forward
            const patches = model.embedPatches(image);
            const embedded = patches.map(patch => model.patchEmbed(patch));
            const encoded = model.transformer.forward(embedded);
            const meanVec = encoded.reduce((acc, vec) => acc.map((v, i) => v + vec[i]), new Array(64).fill(0)).map(v => v / encoded.length);
            const logits = model.classifier.map(row => row.reduce((sum, w, j) => sum + w * meanVec[j], 0));
            const probs = softmax(logits);
            // Loss
            const loss = crossEntropyLoss(probs, label);
            totalLoss += loss;
            // Gradient w.r.t classifier weights (simple SGD)
            const target = oneHot(numClasses, label);
            for (let c = 0; c < numClasses; c++) {
                const grad = (probs[c] - target[c]);
                for (let j = 0; j < 64; j++) {
                    model.classifier[c][j] -= lr * grad * meanVec[j];
                }
            }
        }
        console.log(`Epoch ${epoch + 1}, Loss: ${(totalLoss / trainImages.length).toFixed(4)}`);
    }
}

// Tạo dữ liệu giả lập để huấn luyện thử
const numTrain = 20;
const trainImages: number[][] = [];
const trainLabels: number[] = [];
for (let i = 0; i < numTrain; i++) {
    // Ảnh random, nhãn random
    trainImages.push(Array.from({ length: 32 * 32 }, () => Math.random()));
    trainLabels.push(Math.floor(Math.random() * 10));
}

// Khởi tạo model một lần, dùng cho cả train và test
const model = new MiniLLM(32, 4, 10);
trainClassifier(model, trainImages, trainLabels, 5, 0.05);

// Kiểm thử lại các testCases như cũ
testCases.forEach(({ name, image }) => {
    console.log(`\nTest case: ${name}`);
    printImage(image);
    const logits = model.forward(image);
    console.log('Logits:', logits);
    if (!logits.length || logits.some(x => isNaN(x))) {
        console.error('Lỗi: logits rỗng hoặc chứa NaN. Kiểm tra lại pipeline hoặc dữ liệu đầu vào.');
    }
    const prediction = logits.indexOf(Math.max(...logits));
    console.log(`Predicted class: ${prediction}`);
});
