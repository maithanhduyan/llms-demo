use neat_rust::architecture::network::Network;

#[test]
fn test_forward_xor() {
    let mut net = Network::new(2, 1);
    // Đào tạo mạng cho bài toán XOR
    let xor_data = [
        ([0.0, 0.0], 0.0),
        ([0.0, 1.0], 1.0),
        ([1.0, 0.0], 1.0),
        ([1.0, 1.0], 0.0),
    ];
    for _ in 0..20000 {
        net.train(&xor_data);
    }
    // Đánh giá kết quả
    for (input, target) in xor_data.iter() {
        let output = net.forward(&input[..])[0];
        assert!(
            (output - target).abs() < 0.2,
            "XOR failed: input={:?}, output={:.3}, target={}",
            input,
            output,
            target
        );
    }
}
