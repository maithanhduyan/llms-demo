# NEAT-TS: Thư viện NeuroEvolution of Augmenting Topologies (TypeScript)

## Giới thiệu
NEAT-TS là thư viện mã nguồn mở hiện đại, triển khai thuật toán NEAT (NeuroEvolution of Augmenting Topologies) bằng TypeScript. NEAT là một phương pháp tiến hóa mạng nơ-ron nhân tạo, cho phép tự động tối ưu cả trọng số lẫn cấu trúc mạng (thêm node, connection, hidden layer) thông qua các phép lai ghép (crossover), đột biến (mutation) và chọn lọc tự nhiên (elitism).

Thư viện hướng tới mục tiêu:
- Dễ sử dụng, dễ mở rộng, phù hợp cho nghiên cứu và ứng dụng thực tế.
- Chuẩn hóa TypeScript, hỗ trợ build, test, sử dụng như một package hiện đại.
- Có thể dùng cho các bài toán học máy, tối ưu, AI agent, v.v.

## Những gì đã làm được
- **Chuyển đổi toàn bộ mã nguồn từ JavaScript sang TypeScript**: Chuẩn hóa type, import/export, JSDoc, đảm bảo an toàn và dễ bảo trì.
- **Tách biệt rõ ràng giữa mã nguồn thư viện và test/demo**: `src/` cho core, `test/` cho kiểm thử.
- **Viết test case tự động cho các chức năng chính**:
  - Học bài toán XOR (Perceptron, tiến hóa nhiều thế hệ)
  - Mutation, crossover, kiểm tra sinh ra hidden layer
  - Tiến hóa population nhiều thế hệ, giữ lại elite
- **Chuẩn hóa cấu trúc build, test, export**: Có thể sử dụng như một thư viện TypeScript hiện đại.
- **Tối ưu lại các method chính**: `crossOver`, `merge`, `toJSON`, `fromJSON`, `test`, ...
- **Đảm bảo toàn bộ test pass, không còn lỗi biên dịch**

## Hạn chế & Hướng cải tiến tiếp theo
- **Chưa có giao diện trực quan (UI/Visualization)**: Nên bổ sung demo trực quan hóa tiến hóa mạng.
- **Chưa tối ưu hiệu năng cho population lớn**: Cần tối ưu multithreading, memory, hoặc tích hợp WebWorker.
- **Chưa hỗ trợ các biến thể NEAT nâng cao**: (HyperNEAT, CoDeepNEAT, ...)
- **Chưa có API/CLI cho người dùng cuối**: Nên bổ sung REST API hoặc CLI để dễ tích hợp vào hệ thống khác.
- **Chưa có nhiều ví dụ ứng dụng thực tế**: Nên bổ sung các ví dụ về game AI, robot, tối ưu hàm, v.v.

## Ứng dụng thực tế
- **Tối ưu chiến lược AI trong game**: Evolve agent thông minh cho game, giải bài toán điều khiển, học tăng cường.
- **Tối ưu hàm phức tạp**: Tìm cực trị hàm số mà các phương pháp gradient-based khó áp dụng.
- **Tự động thiết kế mạng nơ-ron**: Tìm kiến trúc mạng phù hợp cho bài toán mới mà không cần chuyên gia.
- **Nghiên cứu AI tiến hóa**: Là nền tảng cho các nghiên cứu về tiến hóa mạng nơ-ron, AI tự thích nghi.

## Đóng góp & phát triển
- Mọi đóng góp, issue, pull request đều được hoan nghênh!
- Hãy fork, thử nghiệm, và đề xuất cải tiến cho NEAT-TS.

---
Tác giả: [Tên của bạn]
