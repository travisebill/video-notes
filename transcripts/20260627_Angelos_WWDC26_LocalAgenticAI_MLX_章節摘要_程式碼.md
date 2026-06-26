# 章節摘要 + Sample Code｜Run local agentic AI on the Mac using MLX

## 8 個官方章節

### [0:00] Introduction
- 時間區段：0s ~ 32s
- 摘要：Overview of building and running agentic AI workflows entirely on Mac using MLX — no cloud, no API keys, just your hardware.

### [0:32] The chat and agentic loop
- 時間區段：32s ~ 162s
- 摘要：How traditional chat differs from the agentic loop: the model decides what to do, calls tools to run commands, read files, and hit APIs, observes the results, and iterates — all running locally for privacy and offline availability.

### [2:42] Local agentic AI stack
- 時間區段：162s ~ 276s
- 摘要：A walkthrough of the four-layer stack powering local agentic AI on the Mac: MLX (array framework for Apple Silicon), MLX-LM (model loading, quantization, and fine-tuning), MLX-LM Server (OpenAI-compatible HTTP server), and the agent layer — including popular tools like Ollama, LM Studio, and vLLM.

### [4:36] Setting up your own agent
- 時間區段：276s ~ 339s
- 摘要：Three steps to go from zero to a fully local agentic workflow: install MLX-LM with pip, start the server with a tool-calling model, and configure your agent to point at the local endpoint.

### [5:39] Making agents fast
- 時間區段：339s ~ 413s
- 摘要：How MLX tackles the first challenge of agentic workloads — efficiently processing large contexts with hundreds of thousands of tokens — including how M5 Neural Accelerators accelerate prompt processing speed.

### [6:53] Concurrency and distributed inference
- 時間區段：413s ~ 560s
- 摘要：How MLX handles continuous batching for concurrent multi-agent requests, and distributed inference to spread large models across multiple Macs over Thunderbolt.

### [9:20] More examples
- 時間區段：560s ~ 781s
- 摘要：Two-part live demo building SwiftUI apps entirely on-device. First, using OpenCode with MLX to generate a complete SwiftUI project from a description; then, using Xcode's agentic coding capabilities to build and fix a SwiftUI app — all running locally.

### [13:01] Next steps
- 時間區段：781s ~ 817s
- 摘要：Summary of the full local AI stack and practical steps to get started: install MLX-LM, launch the server, and connect your agent. All shown tools are open-source and available now.

---

## 3 段 Sample Code（含時間錨點）

### [1] Set up MLX-LM and start the local server（4:40）
```bash
# Step 1: Install MLX-LM
pip install mlx-lm

# Step 2: Start the server
mlx_lm.server --model mlx-community/Qwen-3.5-4B-8bit

# Step 3: Point your agent to the server
curl -X POST \
  http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"default_model","messages":[{"role":"user","content":"Hello!"}]}'
```

### [2] Configure an agent to use your local MLX server（5:18）
```bash
{
  "$schema": "https://opencode.ai/config.json",
  "model": "mlx/default_model",
  "small_model": "mlx/default_model",
  "provider": {
    "mlx": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "MLX (local)",
      "options": {
        "baseURL": "http://127.0.0.1:8080/v1"
      },
      "models": {
        "default_model": {
          "name": "Default MLX Model"
        }
      }
    }
  }
}
```

### [3] Launch distributed inference with MLX（8:33）
```bash
mlx.launch --hostfile hosts.json \
  --backend jaccl \
  /remote/path/to/mlx_lm.server \
  --model mlx-community/Qwen-3.5-122B-A3B-8bit
```
