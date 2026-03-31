# 🌌 Quantum Quant: AI-Powered Quantitative Agent

**Quantum Quant**is an autonomous quantitative agent that redefines market analysis. It integrates high-frequency technical signals—including RSI and MACD—with the cognitive power of generative AI to deliver precise, data-backed execution strategies for the modern investor

---

## 🚀 Key Features

* **Quantitative Analysis Engine:** Calculates real-time **RSI (Relative Strength Index)** and **MACD (Moving Average Convergence Divergence)** using live market data.
* **Neural Synthesis:** Utilizes **OpenRouter (Gemini/Llama)** to interpret technical indicators and provide 3 decisive, AI-generated bullet points on market sentiment.
* **Persistent Paper Trading:** A stateful simulator that allows users to "Execute Trades" and track their portfolio holdings in a beautiful glassmorphism dashboard.
* **Interactive Price Matrix:** Dynamic charting powered by Chart.js to visualize the last 30 days of price action.
* **Hybrid Architecture:** A decoupled Node.js/Express backend with a custom injection engine for a professional, lag-free UI experience.
* **gitclaw Integration:** Fully compliant with the gitclaw SDK, allowing the entire repository to function as a pluggable AI agent definition.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js / Express
* **Intelligence:** OpenRouter API (Gemini 2.0 Flash / Llama 3.1)
* **Market Data:** `yahoo-finance2`
* **Quant Math:** `technicalindicators`
* **Styling:** Tailwind CSS (Glassmorphism design)
* **Visualization:** Chart.js
* **Environment:** `dotenv` for secure secret management

---

## ⚙️ Installation & Setup

To run the Quantum Quant agent locally, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/RutujaWaghmare-21/quantum-quant-agent.git
    cd quantum-quant-agent
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    * Create a file named `.env` in the root directory.
    * Add your OpenRouter API Key (refer to `.env.example`):
    ```text
    OPENROUTER_API_KEY=your_sk_or_v1_key_here
    PORT=3000
    ```

4.  **Launch the Agent:**
    ```bash
    node server.js
    ```
    *Open `http://localhost:3000` in your browser.*
5.  **gitclaw Agent Mode (Autonomous SDK)**
    Quantum Quant is a "Clawless" compliant agent. This allows the repository to function as a standardized, pluggable AI        definition that can be executed directly via the **gitclaw SDK**.

    * 🛠️ Quick Start (Agent Mode)
     To interact with the agent's brain directly through the terminal, follow the steps for your operating system:

* **Step 1: Set Environment Variable**
Replace "your_key" with your actual OpenRouter API key.
 Windows (PowerShell):
```bash
$env:OPENROUTER_API_KEY="your_key"
 ```
 Mac / Linux / Git Bash:
```bash
export OPENROUTER_API_KEY="your_key"
 ```
* **Step 2: Run the Agent**
You can run the agent locally from within the project folder or directly from GitHub:
Local Execution:
```bash
npx gitclaw run .
```
Remote Execution (Direct from GitHub):
```bash
npx gitclaw run github.com/RutujaWaghmare-21/quantum-quant-agent
```
---

## 🤖 Agentic Architecture

This project follows strict Soul/Rules/Tools documentation standards, ensuring the repository is the agent definition:
* **agent.yaml:** The central manifest orchestrating identity, tools, and runtime requirements.
* **SOUL.md:** Defines the "Quantum Quant" persona—analytical, decisive, and objective.

* **RULES.md:** Operational guardrails and hard constraints to ensure financial data integrity.

* **skills/:** Modularized logic files defining the agent's high-level capabilities.

* **tools/:** Autonomous JavaScript functions that allow the agent to "grasp" and manipulate live market data.

---

## 📈 Future Roadmap

* [ ] **Real-time News Sentiment:** Correlating technical signals with global headlines via NewsAPI.
* [ ] **Multi-Asset Comparison:** Advanced risk-parity analysis across different sectors.
* [ ] **Webhook Alerts:** Automated Discord/Slack triggers for specific RSI/MACD crossovers.

---

## ⚖️ Disclaimer
*Quantum Quant is a simulated tool created for educational and hackathon purposes. It does not provide real financial advice. Invest at your own risk.*

---
