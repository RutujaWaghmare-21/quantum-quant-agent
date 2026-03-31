---
name: quantitative-market-analysis
description: "Analyzes live stock market data using RSI and MACD indicators to provide trading signals."
allowed-tools: YahooFinance Node.js OpenRouter
---

# Quantitative Market Analysis Skill

## Capability
The agent can ingest a stock ticker, fetch 6 months of historical daily closing prices, and calculate technical indicators to determine market momentum.

## Execution Logic
1. **Data Acquisition:** Use the `yahoo-finance2` tool to retrieve historical data.
2. **Signal Calculation:** - Compute **RSI (14-day)**: Identify overbought (>70) or oversold (<30) conditions.
    - Compute **MACD**: Analyze the histogram for bullish/bearish crossovers.
3. **Synthesis:** Pass the raw indicators to the Neural Grid (OpenRouter) to generate a high-conviction narrative.
4. **Action:** Output a "BUY", "SELL", or "HOLD" verdict based on the weighted confidence of the math and the AI reasoning.

## Constraints
- Only analyze tickers available on major public exchanges.
- Do not execute real-world financial transactions; output is for simulation only.
