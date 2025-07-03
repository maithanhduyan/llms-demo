use neat_rust::architecture::architect::Architect;
use neat_rust::architecture::network::Network;

fn main() {
    println!("NEAT-RS XOR demo: 10 cá thể, 10 thế hệ");
    // Khởi tạo quần thể 10 mạng perceptron 2-2-1
    let mut population: Vec<Network> = (0..10)
        .map(|_| Architect::perceptron(&[2, 2, 1]))
        .collect();

    // Dữ liệu XOR
    let xor_data = [
        ([0.0, 0.0], 0.0),
        ([0.0, 1.0], 1.0),
        ([1.0, 0.0], 1.0),
        ([1.0, 1.0], 0.0),
    ];

    for gen in 0..10 {
        println!("\nThế hệ {}", gen + 1);
        // Đánh giá từng cá thể
        let mut scores: Vec<(usize, f64)> = population
            .iter()
            .enumerate()
            .map(|(i, net)| (i, net.evaluate(&xor_data)))
            .collect();
        scores.sort_by(|a, b| a.1.partial_cmp(&b.1).unwrap());
        for (i, score) in &scores {
            println!("Cá thể {}: MSE = {:.4}", i + 1, score);
        }
        // Chọn lọc: giữ lại 5 cá thể tốt nhất, nhân bản và đột biến thành 10 cá thể mới
        let mut new_population = Vec::new();
        for &(i, _) in scores.iter().take(5) {
            new_population.push(population[i].clone());
            let mut mutated = population[i].clone();
            mutated.mutate();
            new_population.push(mutated);
        }
        // Huấn luyện từng cá thể (giả lập)
        for net in new_population.iter_mut() {
            net.train(&xor_data);
        }
        population = new_population;
    }
    println!("\nLưu ý: Cần hoàn thiện logic forward, mutate, train để đạt kết quả thực tế cho bài toán XOR.");
}
