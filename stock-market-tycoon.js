// Stock Market Tycoon Game
class StockMarketGame {
    constructor() {
        this.cash = 10000;
        this.day = 1;
        this.gameActive = true;
        this.transactions = [];
        this.stocks = [
            { symbol: "TECH", name: "TechGiant Inc", price: 150, volatility: 0.08, owned: 0, color: "#ff6b6b" },
            { symbol: "ENERGY", name: "PowerGrid Co", price: 80, volatility: 0.05, owned: 0, color: "#ffd93d" },
            { symbol: "PHARMA", name: "MediCare Ltd", price: 120, volatility: 0.06, owned: 0, color: "#6bcf7f" },
            { symbol: "AUTO", name: "MotorWorks Corp", price: 65, volatility: 0.1, owned: 0, color: "#4d96ff" },
            { symbol: "FIN", name: "Global Bank", price: 95, volatility: 0.07, owned: 0, color: "#9d4edd" },
            { symbol: "RET", name: "ShopMart Stores", price: 70, volatility: 0.04, owned: 0, color: "#ff9f43" }
        ];
        
        this.newsEvents = [
            { title: "Tech Sector Shows Strong Growth", effect: "TECH", impact: 0.1 },
            { title: "Oil Prices Surge Amid Supply Concerns", effect: "ENERGY", impact: 0.15 },
            { title: "New Drug Approval Boosts Pharma Stocks", effect: "PHARMA", impact: 0.12 },
            { title: "Auto Sales Decline for Third Quarter", effect: "AUTO", impact: -0.1 },
            { title: "Interest Rate Hike Hits Banking Sector", effect: "FIN", impact: -0.08 },
            { title: "Retail Sales Exceed Expectations", effect: "RET", impact: 0.07 },
            { title: "Market Correction Underway", effect: "ALL", impact: -0.05 },
            { title: "Economic Growth Exceeds Forecasts", effect: "ALL", impact: 0.06 },
            { title: "Tech Innovation Drives Market Rally", effect: "TECH", impact: 0.08 },
            { title: "Renewable Energy Investments Soar", effect: "ENERGY", impact: 0.12 }
        ];
        
        this.currentNews = [];
        this.timeLeft = 30;
        this.timerInterval = null;
        this.maxStreak = 0;
        this.currentStreak = 0;
        
        this.initializeGame();
    }
    
    initializeGame() {
        // DOM Elements
        this.cashBalanceEl = document.getElementById('cash-balance');
        this.portfolioValueEl = document.getElementById('portfolio-value');
        this.netWorthEl = document.getElementById('net-worth');
        this.currentDayEl = document.getElementById('current-day');
        this.timerEl = document.getElementById('timer');
        this.stocksListEl = document.getElementById('stocks-list');
        this.stockSelectEl = document.getElementById('stock-select');
        this.sharesInputEl = document.getElementById('shares-input');
        this.buyBtn = document.getElementById('buy-btn');
        this.sellBtn = document.getElementById('sell-btn');
        this.portfolioItemsEl = document.getElementById('portfolio-items');
        this.emptyPortfolioEl = document.getElementById('empty-portfolio');
        this.newsContainerEl = document.getElementById('news-container');
        this.transactionLogEl = document.getElementById('transaction-log');
        this.resetBtn = document.getElementById('reset-btn');
        
        // Event Listeners
        this.buyBtn.addEventListener('click', () => this.buyStock());
        this.sellBtn.addEventListener('click', () => this.sellStock());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        this.sharesInputEl.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.buyStock();
        });
        
        // Initialize UI
        this.updateUI();
        this.populateStockSelect();
        this.generateNews();
        this.startTimer();
        
        // Quick action buttons
        this.setupQuickActions();
    }
    
    startTimer() {
        clearInterval(this.timerInterval);
        this.timeLeft = 30;
        this.timerEl.textContent = this.timeLeft;
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerEl.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.updateMarket();
                this.generateNews();
                this.timeLeft = 30;
            }
        }, 1000);
    }
    
    updateMarket() {
        // Update each stock price
        this.stocks.forEach(stock => {
            // Random price change based on volatility
            const changePercent = (Math.random() - 0.5) * 2 * stock.volatility;
            stock.price += stock.price * changePercent;
            stock.price = Math.max(stock.price, 1);
            stock.price = parseFloat(stock.price.toFixed(2));
            
            // Apply news effects
            this.currentNews.forEach(news => {
                if (news.effect === stock.symbol || news.effect === "ALL") {
                    stock.price += stock.price * news.impact;
                    stock.price = parseFloat(stock.price.toFixed(2));
                }
            });
        });
        
        // Increment day
        this.day++;
        this.currentDayEl.textContent = this.day;
        
        // Check win condition
        const netWorth = this.calculateNetWorth();
        if (netWorth >= 20000 && this.gameActive) {
            this.gameActive = false;
            this.showNotification("🎉 Congratulations! You've reached $20,000 and won the game!", "success");
        }
        
        this.updateUI();
    }
    
    generateNews() {
        this.currentNews = [];
        this.newsContainerEl.innerHTML = '';
        
        // Pick 2-3 random news items
        const numNews = Math.floor(Math.random() * 2) + 2;
        const shuffledNews = [...this.newsEvents].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numNews; i++) {
            const news = shuffledNews[i];
            this.currentNews.push(news);
            
            // Create news item
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            const impactClass = news.impact > 0 ? 'price-up' : 'price-down';
            const impactText = news.impact > 0 ? `+${Math.round(news.impact * 100)}%` : `${Math.round(news.impact * 100)}%`;
            
            newsItem.innerHTML = `
                <div class="news-title">${news.title} <span class="${impactClass}">${impactText}</span></div>
                <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
                    Affects: ${news.effect === "ALL" ? "All Stocks" : news.effect}
                </div>
                <div class="news-time">Day ${this.day}</div>
            `;
            
            this.newsContainerEl.appendChild(newsItem);
        }
    }
    
    populateStockSelect() {
        this.stockSelectEl.innerHTML = '<option value="">Select a stock...</option>';
        
        this.stocks.forEach(stock => {
            const option = document.createElement('option');
            option.value = stock.symbol;
            option.textContent = `${stock.symbol} - ${stock.name} ($${stock.price.toFixed(2)})`;
            this.stockSelectEl.appendChild(option);
        });
    }
    
    setupQuickActions() {
        // Quick actions will be added in updateUI
    }
    
    updateUI() {
        // Update cash balance
        this.cashBalanceEl.textContent = `$${this.cash.toFixed(2)}`;
        
        // Update stocks table
        this.stocksListEl.innerHTML = '';
        this.stocks.forEach(stock => {
            const row = document.createElement('tr');
            
            // Calculate daily change
            const dailyChange = (Math.random() - 0.5) * 20;
            const changeClass = dailyChange >= 0 ? 'price-up' : 'price-down';
            const changeSymbol = dailyChange >= 0 ? '+' : '';
            
            row.innerHTML = `
                <td>
                    <div class="stock-name">${stock.name}</div>
                    <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
                        <i class="fas fa-industry"></i> ${stock.symbol === "TECH" ? "Technology" : 
                          stock.symbol === "ENERGY" ? "Energy" :
                          stock.symbol === "PHARMA" ? "Pharmaceuticals" :
                          stock.symbol === "AUTO" ? "Automotive" :
                          stock.symbol === "FIN" ? "Finance" : "Retail"}
                    </div>
                </td>
                <td>
                    <span class="stock-symbol" style="background: ${stock.color}20; color: ${stock.color};">${stock.symbol}</span>
                </td>
                <td class="stock-price">$${stock.price.toFixed(2)}</td>
                <td class="${changeClass}">${changeSymbol}${dailyChange.toFixed(2)}</td>
                <td><strong>${stock.owned}</strong> shares</td>
                <td>$${(stock.owned * stock.price).toFixed(2)}</td>
                <td>
                    <button class="quick-buy" data-symbol="${stock.symbol}">
                        <i class="fas fa-plus"></i> Quick Buy
                    </button>
                    <button class="quick-sell" data-symbol="${stock.symbol}">
                        <i class="fas fa-minus"></i> Quick Sell
                    </button>
                </td>
            `;
            
            this.stocksListEl.appendChild(row);
        });
        
        // Update portfolio display
        this.updatePortfolioDisplay();
        
        // Update transaction log
        this.updateTransactionLog();
        
        // Update portfolio value and net worth
        const portfolioValue = this.calculatePortfolioValue();
        const netWorth = this.calculateNetWorth();
        
        this.portfolioValueEl.textContent = `$${portfolioValue.toFixed(2)}`;
        this.netWorthEl.textContent = `$${netWorth.toFixed(2)}`;
        
        // Update stock select options
        this.populateStockSelect();
        
        // Add event listeners to quick action buttons
        document.querySelectorAll('.quick-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const symbol = e.currentTarget.getAttribute('data-symbol');
                this.stockSelectEl.value = symbol;
                this.sharesInputEl.value = 10;
                this.buyStock();
            });
        });
        
        document.querySelectorAll('.quick-sell').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const symbol = e.currentTarget.getAttribute('data-symbol');
                this.stockSelectEl.value = symbol;
                this.sharesInputEl.value = 10;
                this.sellStock();
            });
        });
    }
    
    updatePortfolioDisplay() {
        // Check if portfolio is empty
        let hasStocks = false;
        let portfolioHTML = '';
        
        this.stocks.forEach(stock => {
            if (stock.owned > 0) {
                hasStocks = true;
                const stockValue = stock.owned * stock.price;
                const percentage = ((stockValue / this.calculatePortfolioValue()) * 100).toFixed(1);
                
                portfolioHTML += `
                    <div class="portfolio-item">
                        <div>
                            <div class="portfolio-symbol" style="color: ${stock.color};">${stock.symbol}</div>
                            <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
                                ${stock.name}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div>${stock.owned} shares</div>
                            <div class="portfolio-amount">$${stockValue.toFixed(2)}</div>
                            <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.5);">
                                ${percentage}% of portfolio
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        if (hasStocks) {
            this.emptyPortfolioEl.style.display = 'none';
            this.portfolioItemsEl.innerHTML = portfolioHTML;
        } else {
            this.emptyPortfolioEl.style.display = 'block';
            this.portfolioItemsEl.innerHTML = '';
        }
    }
    
    updateTransactionLog() {
        // Show only last 6 transactions
        const recentTransactions = this.transactions.slice(-6);
        
        if (recentTransactions.length === 0) {
            this.transactionLogEl.innerHTML = `
                <div style="text-align: center; padding: 30px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-exchange-alt" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    <p>No transactions yet</p>
                </div>
            `;
            return;
        }
        
        let logHTML = '';
        recentTransactions.reverse().forEach(transaction => {
            const transactionClass = transaction.type === 'BUY' ? 'transaction-buy' : 'transaction-sell';
            const icon = transaction.type === 'BUY' ? 'fa-arrow-up' : 'fa-arrow-down';
            
            logHTML += `
                <div class="transaction-entry ${transactionClass}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <i class="fas ${icon}"></i>
                            <strong>${transaction.type}</strong> ${transaction.shares} ${transaction.symbol}
                        </div>
                        <div>
                            $${transaction.total.toFixed(2)}
                        </div>
                    </div>
                    <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6); margin-top: 5px;">
                        Day ${transaction.day} • $${transaction.price.toFixed(2)} per share
                    </div>
                </div>
            `;
        });
        
        this.transactionLogEl.innerHTML = logHTML;
    }
    
    calculatePortfolioValue() {
        let total = 0;
        this.stocks.forEach(stock => {
            total += stock.owned * stock.price;
        });
        return parseFloat(total.toFixed(2));
    }
    
    calculateNetWorth() {
        return parseFloat((this.cash + this.calculatePortfolioValue()).toFixed(2));
    }
    
    buyStock() {
        const symbol = this.stockSelectEl.value;
        const shares = parseInt(this.sharesInputEl.value);
        
        if (!symbol) {
            this.showNotification("Please select a stock", "error");
            return;
        }
        
        if (!shares || shares <= 0) {
            this.showNotification("Please enter a valid number of shares", "error");
            return;
        }
        
        const stock = this.stocks.find(s => s.symbol === symbol);
        const totalCost = shares * stock.price;
        
        if (totalCost > this.cash) {
            this.showNotification(`Insufficient funds. You need $${totalCost.toFixed(2)}`, "error");
            return;
        }
        
        // Execute buy
        this.cash -= totalCost;
        stock.owned += shares;
        
        // Record transaction
        this.transactions.push({
            type: 'BUY',
            symbol: stock.symbol,
            shares: shares,
            price: stock.price,
            total: totalCost,
            day: this.day
        });
        
        // Update UI
        this.updateUI();
        
        // Clear inputs
        this.sharesInputEl.value = '';
        
        // Success message
        this.showNotification(`✅ Bought ${shares} shares of ${stock.symbol} for $${totalCost.toFixed(2)}`, "success");
    }
    
    sellStock() {
        const symbol = this.stockSelectEl.value;
        const shares = parseInt(this.sharesInputEl.value);
        
        if (!symbol) {
            this.showNotification("Please select a stock", "error");
            return;
        }
        
        if (!shares || shares <= 0) {
            this.showNotification("Please enter a valid number of shares", "error");
            return;
        }
        
        const stock = this.stocks.find(s => s.symbol === symbol);
        
        if (stock.owned < shares) {
            this.showNotification(`You only own ${stock.owned} shares of ${stock.symbol}`, "error");
            return;
        }
        
        const totalValue = shares * stock.price;
        
        // Execute sell
        this.cash += totalValue;
        stock.owned -= shares;
        
        // Record transaction
        this.transactions.push({
            type: 'SELL',
            symbol: stock.symbol,
            shares: shares,
            price: stock.price,
            total: totalValue,
            day: this.day
        });
        
        // Update UI
        this.updateUI();
        
        // Clear inputs
        this.sharesInputEl.value = '';
        
        // Success message
        this.showNotification(`✅ Sold ${shares} shares of ${stock.symbol} for $${totalValue.toFixed(2)}`, "success");
    }
    
    resetGame() {
        if (!confirm("Are you sure you want to reset the game? All progress will be lost.")) {
            return;
        }
        
        // Reset game state
        this.cash = 10000;
        this.day = 1;
        this.gameActive = true;
        this.transactions = [];
        this.currentStreak = 0;
        this.maxStreak = 0;
        
        // Reset stocks
        this.stocks.forEach(stock => {
            stock.owned = 0;
            // Reset to initial prices with some randomness
            const initialPrices = {
                "TECH": 150,
                "ENERGY": 80,
                "PHARMA": 120,
                "AUTO": 65,
                "FIN": 95,
                "RET": 70
            };
            stock.price = initialPrices[stock.symbol] * (0.9 + Math.random() * 0.2);
            stock.price = parseFloat(stock.price.toFixed(2));
        });
        
        // Reset timer
        this.startTimer();
        
        // Generate new news
        this.generateNews();
        
        // Update UI
        this.updateUI();
        
        this.showNotification("🔄 Game reset! You have $10,000 to start trading again.", "info");
    }
    
    showNotification(message, type = "info") {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `game-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .game-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    color: #333;
                    padding: 15px 20px;
                    border-radius: 12px;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 4s forwards;
                    max-width: 350px;
                    border-left: 4px solid #4d96ff;
                }
                
                .notification-success {
                    border-left-color: #6bcf7f;
                }
                
                .notification-error {
                    border-left-color: #ff6b6b;
                }
                
                .notification-info {
                    border-left-color: #4d96ff;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-left: auto;
                    padding: 0;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
                
                body.dark-mode .game-notification {
                    background: rgba(30, 30, 40, 0.95);
                    color: white;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new StockMarketGame();
});