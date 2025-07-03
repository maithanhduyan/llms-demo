#[derive(Debug, Clone)]
pub struct Network {
    pub input: usize,
    pub output: usize,
    pub weights: Vec<f64>,
    pub bias: Vec<f64>,
}

impl Network {
    pub fn new(input: usize, output: usize) -> Self {
        let mut rng = rand::thread_rng();
        use rand::Rng;
        let weights = (0..(input * 2 + 2 * output))
            .map(|_| rand::random::<f64>() * 2.0 - 1.0)
            .collect();
        let bias = (0..3).map(|_| rand::random::<f64>() * 2.0 - 1.0).collect();
        Network {
            input,
            output,
            weights,
            bias,
        }
    }

    /// Forward propagate inputs through a 2-2-1 perceptron
    pub fn forward(&self, inputs: &[f64]) -> Vec<f64> {
        // Hidden layer
        let h1 = (inputs[0] * self.weights[0] + inputs[1] * self.weights[1] + self.bias[0]).tanh();
        let h2 = (inputs[0] * self.weights[2] + inputs[1] * self.weights[3] + self.bias[1]).tanh();
        // Output layer
        let o = (h1 * self.weights[4] + h2 * self.weights[5] + self.bias[2]).tanh();
        vec![o]
    }

    /// Đánh giá lỗi MSE trên tập dữ liệu
    pub fn evaluate(&self, data: &[([f64; 2], f64)]) -> f64 {
        let mut error = 0.0;
        for (input, target) in data.iter() {
            let output = self.forward(&input[..]);
            let o = output[0];
            error += (target - o).powi(2);
        }
        error / data.len() as f64
    }

    /// Đột biến mạng (giả lập)
    pub fn mutate(&mut self) {
        for w in &mut self.weights {
            *w += (rand::random::<f64>() - 0.5) * 0.2;
        }
        for b in &mut self.bias {
            *b += (rand::random::<f64>() - 0.5) * 0.2;
        }
    }

    /// Huấn luyện mạng (giả lập)
    pub fn train(&mut self, data: &[([f64; 2], f64)]) {
        // Simple SGD for demo
        let lr = 0.2;
        for (input, target) in data.iter() {
            let h1 =
                (input[0] * self.weights[0] + input[1] * self.weights[1] + self.bias[0]).tanh();
            let h2 =
                (input[0] * self.weights[2] + input[1] * self.weights[3] + self.bias[1]).tanh();
            let o = (h1 * self.weights[4] + h2 * self.weights[5] + self.bias[2]).tanh();
            let error = target - o;
            // Backprop output
            let delta_o = error * (1.0 - o * o);
            // Backprop hidden
            let delta_h1 = delta_o * self.weights[4] * (1.0 - h1 * h1);
            let delta_h2 = delta_o * self.weights[5] * (1.0 - h2 * h2);
            // Update weights
            self.weights[4] += lr * delta_o * h1;
            self.weights[5] += lr * delta_o * h2;
            self.weights[0] += lr * delta_h1 * input[0];
            self.weights[1] += lr * delta_h1 * input[1];
            self.weights[2] += lr * delta_h2 * input[0];
            self.weights[3] += lr * delta_h2 * input[1];
            self.bias[2] += lr * delta_o;
            self.bias[0] += lr * delta_h1;
            self.bias[1] += lr * delta_h2;
        }
    }
}
