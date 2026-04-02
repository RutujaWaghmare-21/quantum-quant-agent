const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// APIs and Math Tools
const YahooFinanceLib = require('yahoo-finance2');
const yahooFinance = new (YahooFinanceLib.default || YahooFinanceLib)({ suppressNotices: ['ripHistorical'] });
const { RSI, MACD } = require('technicalindicators');

// Load environment variables
dotenv.config();

const app = express();
let portfolio = [];
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// ==========================================
// 1. HTML PAGE ROUTES
// ==========================================
app.get('/compare', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'compare.html'));
});
app.get('/chat_ui', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'result.html'));
});
// ==========================================
// 2. API: MULTI-ASSET COMPARE
// ==========================================
app.post('/compare', async (req, res) => {
    const stocksInput = req.body.stocks || "";
    const tickers = stocksInput.split(',').map(s => s.trim().toUpperCase()).filter(s => s.length > 0);
    if (tickers.length === 0) return res.json({ error: "Please enter at least one valid stock ticker." });
    console.log(`[SYSTEM] Comparing assets: ${tickers.join(', ')}`);
    let results = [];
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 6); // 6 Months back
        for (const ticker of tickers) {
            try {
                const data = await yahooFinance.historical(ticker, { period1: startDate, period2: endDate, interval: '1d' });
                if (data && data.length > 10) {
                    const startPrice = data[0].close;
                    const currentPrice = data[data.length - 1].close;
                    const returnPct = (((currentPrice - startPrice) / startPrice) * 100).toFixed(2);
                    const returns = [];
                    for(let i=1; i<data.length; i++) {
                        returns.push((data[i].close - data[i-1].close) / data[i-1].close);
                    }
                    const mean = returns.reduce((a,b)=>a+b, 0) / returns.length;
                    const variance = returns.reduce((a,b)=>a + Math.pow(b - mean, 2), 0) / returns.length;
                    const riskPct = (Math.sqrt(variance) * Math.sqrt(252) * 100).toFixed(2); // Annualized volatility
                    let sentiment = returnPct > 5 ? "Positive" : returnPct < -5 ? "Negative" : "Neutral";
                    results.push({
                        stock: ticker,
                        current: currentPrice.toFixed(2),
                        return_percent: parseFloat(returnPct),
                        risk: parseFloat(riskPct),
                        sentiment: sentiment
                    });
                }
            } catch (e) {
                console.log(`Could not fetch data for ${ticker}`);
            }
        }
        res.json(results);
    } catch (error) {
        console.error("Compare Error:", error);
        res.json({ error: "System Error during multi-asset comparison." });
    }
});
// ==========================================
// 3. API: THE CHATBOT ORACLE
// ==========================================
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    console.log(`[ORACLE] User asked: "${userMessage}"`);
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "your_api_key_here") {
        return res.json({ reply: "⚠️ **Mock Mode:** I am Quantum Oracle. To enable my real AI analysis, please add an OpenRouter API key to your `.env` file." });
    }
    try {
        const prompt = `
        You are Quantum Oracle, a highly decisive, expert quantitative financial AI.
        The user is asking you a question about their portfolio, risk, or general finance.
        User Question: "${userMessage}"
        Answer directly, confidently, and in simple terms. Use bullet points if helpful. Do not use markdown headers.
        `;
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openrouter/auto",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            let formattedReply = data.choices[0].message.content.replace(/\n/g, "<br>");
            res.json({ reply: formattedReply });
        } else {
            res.json({ reply: "My neural pathways are temporarily congested. Please try again." });
        }
    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ reply: "System error communicating with the AI grid." });
    }
});
// ==========================================
// 4. MAIN ENGINE: THE QUANT ANALYSIS
// ==========================================
app.post('/analyze', async (req, res) => {
    const ticker = req.body.ticker ? req.body.ticker.toUpperCase() : "AAPL";
    const principal = parseFloat(req.body.principal) || 0;
    const years = parseInt(req.body.years) || 5;
    const income = parseFloat(req.body.income) || 0;
    const expenses = parseFloat(req.body.expenses) || 0;
    const risk = req.body.risk || "Medium";
    const savings = Math.max(0, income - expenses);

    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(endDate.getMonth() - 6);
        
        const historicalData = await yahooFinance.historical(ticker, { period1: startDate, period2: endDate, interval: '1d' });

        if (!historicalData || historicalData.length < 30) {
            return res.send("<h2 style='text-align:center; margin-top:50px; font-family:sans-serif;'>Error: Not enough data for this ticker.</h2><a href='/'>Go Back</a>");
        }

        const closePrices = historicalData.map(day => day.close);
        const currentPrice = closePrices[closePrices.length - 1];
        const chartDates = historicalData.map(day => day.date.toISOString().split('T')[0]).slice(-30);
        const chartPrices = closePrices.slice(-30);

        const rsiValues = RSI.calculate({ values: closePrices, period: 14 });
        const latestRsi = rsiValues[rsiValues.length - 1] || 50;
        const macdValues = MACD.calculate({ values: closePrices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, SimpleMAOscillator: false, SimpleMASignal: false });
        const latestMacd = macdValues[macdValues.length - 1] || { histogram: 0 };

        let decision = "HOLD 📊";
        let confidence = 65;
        let targetPrice; 

        if (latestMacd.histogram > 0 && latestRsi < 60) {
            decision = "BUY 📈";
            confidence = 85;
            targetPrice = currentPrice * 1.12; 
        } else if (latestRsi > 70 && latestMacd.histogram < 0) {
            decision = "SELL 📉";
            confidence = 88;
            targetPrice = currentPrice * 0.90; 
        } else {
            targetPrice = currentPrice * 1.04; 
        }

        let aiExplanation = "<p class='text-slate-400'>AI analysis offline.</p>";
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

        if (OPENROUTER_API_KEY && OPENROUTER_API_KEY.length > 10) {
            const prompt = `You are Quantum Oracle. Starting with $${principal}, investing $${savings}/mo for ${years}y. Risk: ${risk}. Verdict: ${decision} for ${ticker}. RSI: ${latestRsi.toFixed(2)}, MACD: ${latestMacd.histogram.toFixed(2)}. Give 3 short, punchy investment bullet points.`;
            try {
                const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST", 
                    headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ model: "openrouter/auto", messages: [{ role: "user", content: prompt }] })
                });
                const aiData = await aiResponse.json();
                if (aiData.choices && aiData.choices[0]) {
    aiExplanation = aiData.choices[0].message.content
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
            return `<li class="mb-3 p-3 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border-l-4 border-blue-500 text-slate-800 dark:text-slate-100 shadow-sm list-none">
                ${line.replace(/^- /, '').replace(/^\d+\. /, '')}
            </li>`;
        })
        .join('');
    aiExplanation = `<ul class="space-y-2 p-1">${aiExplanation}</ul>`;
}
            } catch (e) { console.error(e); }
        }

        let resultHtmlPath = path.join(__dirname, 'public', 'dashboard.html');
        let htmlPage = fs.readFileSync(resultHtmlPath, 'utf-8');

        const injectionScript = `
        <script>
            document.getElementById('target-ticker-display').textContent = "TICKER: ${ticker}";
            document.getElementById('decision-text').textContent = "${decision}";
            
            const dt = document.getElementById('decision-text');
            if("${decision}".includes("BUY")) dt.className = "text-6xl font-black text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] mb-2 tracking-tighter";
            else if("${decision}".includes("SELL")) dt.className = "text-6xl font-black text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)] mb-2 tracking-tighter";
            else dt.className = "text-6xl font-black text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] mb-2 tracking-tighter";

            document.getElementById('confidence-bar').style.width = "${confidence}%";
            document.getElementById('confidence-text').textContent = "${confidence}%";

            document.getElementById('spot-price').textContent = "${currentPrice.toFixed(2)}";
            document.getElementById('model-target').textContent = "$${targetPrice.toFixed(2)}"; // FIXED: Now uses calculated targetPrice
            
            document.getElementById('ind-rsi').textContent = "${latestRsi.toFixed(2)}";
            document.getElementById('ind-macd').textContent = "${latestMacd.histogram.toFixed(2)}";
            
            document.getElementById('ai-explanation').innerHTML = \`${aiExplanation}\`;

            setTimeout(() => {
                if (window.quantumChart) {
                    window.quantumChart.data.labels = ${JSON.stringify(chartDates)};
                    window.quantumChart.data.datasets[0].data = ${JSON.stringify(chartPrices)};
                    window.quantumChart.update();
                }
            }, 250);
        </script>
        `;

        res.send(htmlPage + injectionScript);

    } catch (error) {
        console.error(error);
        res.status(500).send("System Error");
    }
});
app.post('/paper_trade', (req, res) => {
    const { stock, price, shares } = req.body;
    if (!stock || !price) {
        return res.status(400).json({ message: "Invalid trade data." });
    }
    const newTrade = {
        stock: stock,
        buy_price: parseFloat(price),
        shares: parseInt(shares) || 10,
        total_cost: (parseFloat(price) * (parseInt(shares) || 10)).toFixed(2),
        date: new Date().toLocaleString()
    };
    portfolio.push(newTrade);
    console.log(`[BANK] Trade Executed: Bought ${newTrade.shares} units of ${stock}`);  
    res.json({ 
        status: "success", 
        message: `Successfully bought ${newTrade.shares} shares of ${stock} at $${price}!` 
    });
});
app.get('/get_portfolio', (req, res) => {
    res.json(portfolio);
});
app.listen(PORT, () => {
    console.log(`Quantum Quant Server running at http://localhost:${PORT}`);
});
