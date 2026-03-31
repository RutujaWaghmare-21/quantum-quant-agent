const YahooFinanceLib = require('yahoo-finance2');
const yahooFinance = new (YahooFinanceLib.default || YahooFinanceLib)({ suppressNotices: ['ripHistorical'] });
const { RSI, MACD } = require('technicalindicators');

/**
 * tool: get_market_analysis
 * description: Fetches historical data and calculates RSI/MACD for a given ticker.
 * @param {string} ticker - The stock ticker symbol (e.g., 'AAPL').
 */
async function get_market_analysis(ticker) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);

    const data = await yahooFinance.historical(ticker, { period1: startDate, period2: endDate, interval: '1d' });
    const closePrices = data.map(day => day.close);
    
    const rsiValues = RSI.calculate({ values: closePrices, period: 14 });
    const macdValues = MACD.calculate({ values: closePrices, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 });

    return {
        ticker: ticker,
        currentPrice: closePrices[closePrices.length - 1],
        rsi: rsiValues[rsiValues.length - 1],
        macd: macdValues[macdValues.length - 1].histogram
    };
}

module.exports = { get_market_analysis };
