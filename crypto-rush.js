// Crypto Rush Game
class CryptoRushGame {
    constructor() {
        this.cash = 5000;
        this.totalHashPower = 0;
        this.miningSpeed = 0;
        this.day = 1;
        this.isMining = false;
        this.transactions = [];
        
        this.cryptocurrencies = [
            { symbol: "BTC", name: "Bitcoin", price: 45000, volatility: 0.12, owned: 0, miningRate: 0.0001, color: "#f7931a" },
            { symbol: "ETH", name: "Ethereum", price: 3200, volatility: 0.15, owned: 0, miningRate: 0.001, color: "#627eea" },
            { symbol: "LTC", name: "Litecoin", price: 150, volatility: 0.10, owned: 0, miningRate: 0.01, color: "#bfbbbb" },
            { symbol: "XRP", name: "Ripple", price: 0.85, volatility: 0.08, owned: 0, miningRate: 0.1, color: "#00aae4" },
            { symbol: "ADA", name: "Cardano", price: 1.20, volatility: 0.18, owned: 0, miningRate: 0.05, color: "#0033ad" },
            { symbol: "DOGE", name: "Dogecoin", price: 0.25, volatility: 0.25, owned: 0, miningRate: 0.2, color: "#c2a633" }
        ];
        
        this.miningRigs = [
            { id: 1, name: "Basic Miner", hashPower: 10, cost: 500, upkeep: 10, owned: 0, miningMultiplier: 1 },
            { id: 2, name: "GPU Rig", hashPower: 50, cost: 2000, upkeep: 25, owned: 0, miningMultiplier: 2 },
            { id: 3, name: "ASIC Miner", hashPower: 200, cost: 5000, upkeep: 50, owned: 0, miningMultiplier: 5 },
            { id: 4, name: "Mining Farm", hashPower: 1000, cost: 20000, upkeep: 200, owned: 0, miningMultiplier: 20 },
            { id: 5, name: "Quantum Miner", hashPower: 5000, cost: 100000, upkeep: 500, owned: 0, miningMultiplier: 100 }
        ];
        
        this.marketTrend = 'up';
        this.marketInterval = null;
        this.miningInterval = null;
        this.events = [];
        
        this.initializeGame();
    }
    
    initializeGame() {
        // DOM Elements
        this.cashBalanceEl = document.getElementById('cash-balance');
        this.totalHashEl = document.getElementById('total-hash');
        this.miningSpeedEl = document.getElementById('mining-speed');
        this.netWorthEl = document.getElementById('net-worth');
        this.cryptoTableEl = document.getElementById('crypto-list');
        this.cryptoSelectEl = document.getElementById('crypto-select');
        this.cryptoAmountEl = document.getElementById('crypto-amount');
        this.buyCryptoBtn = document.getElementById('buy-crypto-btn');
        this.sellCryptoBtn = document.getElementById('sell-crypto-btn');
        this.miningRigsEl = document.getElementById('mining-rigs');
        this.cryptoHoldingsEl = document.getElementById('crypto-holdings');
        this.currentHashEl = document.getElementById('current-hash');
        this.minerIconEl = document.getElementById('miner-icon');
        this.mineToggleBtn = document.getElementById('mine-toggle-btn');
        this.upgradeRigsBtn = document.getElementById('upgrade-rigs-btn');
        this.resetGameBtn = document.getElementById('reset-game-btn');
        
        // Event Listeners
        this.buyCryptoBtn.addEventListener('click', () => this.buyCrypto());
        this.sellCryptoBtn.addEventListener('click', () => this.sellCrypto());
        this.mineToggleBtn.addEventListener('click', () => this.toggleMining());
        this.upgradeRigsBtn.addEventListener('click', () => this.upgradeAllRigs());
        this.resetGameBtn.addEventListener('click', () => this.resetGame());
        
        this.cryptoAmountEl.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.buyCrypto();
        });
        
        // Initialize UI
        this.updateUI();
        this.populateCryptoSelect();
        this.setupMiningRigs();
        this.startMarketSimulation();
    }
    
    startMarketSimulation() {
        clearInterval(this.marketInterval);
        
        this.marketInterval = setInterval(() => {
            // Determine market trend
            const trends = ['up', 'down', 'volatile'];
            if (Math.random() < 0.2) {
                this.marketTrend = trends[Math.floor(Math.random() * trends.length)];
            }
            
            // Update cryptocurrency prices
            this.cryptocurrencies.forEach(crypto => {
                let changePercent;
                
                // Base volatility
                changePercent = (Math.random() - 0.5) * 2 * crypto.volatility;
                
                // Apply market trend
                if (this.marketTrend === 'up') {
                    changePercent += Math.abs(changePercent) * 0.5;
                } else if (this.marketTrend === 'down') {
                    changePercent -= Math.abs(changePercent) * 0.5;
                } else if (this.marketTrend === 'volatile') {
                    changePercent *= 2;
                }
                
                crypto.price += crypto.price * changePercent;
                crypto.price = Math.max(crypto.price, 0.01);
                crypto.price = parseFloat(crypto.price.toFixed(4));
            });
            
            // Occasionally add market events
            if (Math.random() < 0.1) {
                this.addEvent();
            }
            
            // Update UI
            this.updateUI();
            
        }, 5000); // Update every 5 seconds
    }
    
    addEvent() {
        const events = [
            "Bull market rally! Crypto prices surging.",
            "Market correction happening. Prices dropping.",
            "High volatility in crypto markets today.",
            "Regulatory news affecting crypto prices.",
            "Major adoption announcement boosts market.",
            "Mining difficulty increased across networks.",
            "New blockchain technology announcement.",
            "Institutional investors entering crypto market."
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        this.events.push({
            message: event,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        // Keep only last 5 events
        if (this.events.length > 5) {
            this.events.shift();
        }
    }
    
    populateCryptoSelect() {
        this.cryptoSelectEl.innerHTML = '<option value="">Select cryptocurrency...</option>';
        
        this.cryptocurrencies.forEach(crypto => {
            const option = document.createElement('option');
            option.value = crypto.symbol;
            option.textContent = `${crypto.symbol} - ${crypto.name} ($${crypto.price.toFixed(4)})`;
            this.cryptoSelectEl.appendChild(option);
        });
    }
    
    setupMiningRigs() {
        this.miningRigsEl.innerHTML = '';
        
        this.miningRigs.forEach(rig => {
            const rigElement = document.createElement('div');
            rigElement.className = 'mining-rig';
            rigElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <div>
                        <strong style="font-size: 1.1rem;">${rig.name}</strong>
                        <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
                            <i class="fas fa-microchip"></i> ${rig.hashPower} MH/s
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 600; color: #ffd93d;">$${rig.cost.toLocaleString()}</div>
                        <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">
                            $${rig.upkeep}/day upkeep
                        </div>
                    </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 5px 10px; border-radius: 8px;">
                            <i class="fas fa-server"></i> ${rig.owned} owned
                        </div>
                        <div style="font-size: 0.9rem; color: #6bcf7f;">
                            ${rig.miningMultiplier}x mining
                        </div>
                    </div>
                    <button class="game-btn game-btn-buy buy-rig-btn" data-rig-id="${rig.id}" ${this.cash < rig.cost ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Buy
                    </button>
                </div>
            `;
            
            this.miningRigsEl.appendChild(rigElement);
        });
        
        // Add event listeners to buy buttons
        document.querySelectorAll('.buy-rig-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rigId = parseInt(e.currentTarget.getAttribute('data-rig-id'));
                this.buyMiningRig(rigId);
            });
        });
    }
    
    updateUI() {
        // Update stats
        this.cashBalanceEl.textContent = `$${this.cash.toFixed(2)}`;
        this.totalHashEl.textContent = `${this.totalHashPower} MH/s`;
        this.miningSpeedEl.textContent = `${this.miningSpeed.toFixed(4)} coins/day`;
        
        // Calculate net worth
        let cryptoValue = 0;
        this.cryptocurrencies.forEach(crypto => {
            cryptoValue += crypto.owned * crypto.price;
        });
        
        let rigsValue = 0;
        this.miningRigs.forEach(rig => {
            rigsValue += rig.owned * rig.cost * 0.5;
        });
        
        const netWorth = this.cash + cryptoValue + rigsValue;
        this.netWorthEl.textContent = `$${netWorth.toFixed(2)}`;
        
        // Update current hash rate
        this.currentHashEl.textContent = `${this.totalHashPower} MH/s`;
        
        // Update cryptocurrency table
        this.updateCryptoTable();
        
        // Update mining rigs
        this.setupMiningRigs();
        
        // Update crypto holdings
        this.updateHoldings();
        
        // Update mining button
        this.updateMiningButton();
    }
    
    updateCryptoTable() {
        this.cryptoTableEl.innerHTML = '';
        
        this.cryptocurrencies.forEach(crypto => {
            // Calculate 24h change
            const change24h = (Math.random() - 0.5) * 20;
            const changeClass = change24h >= 0 ? 'price-up' : 'price-down';
            const changeSymbol = change24h >= 0 ? '+' : '';
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="crypto-logo" style="background: ${crypto.color};">${crypto.symbol.charAt(0)}</div>
                        <div>
                            <div class="stock-name">${crypto.name}</div>
                            <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
                                ${crypto.symbol}
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="stock-symbol" style="background: ${crypto.color}20; color: ${crypto.color};">${crypto.symbol}</span>
                </td>
                <td class="stock-price">$${crypto.price.toFixed(4)}</td>
                <td class="${changeClass}">${changeSymbol}${change24h.toFixed(2)}%</td>
                <td><strong>${crypto.owned.toFixed(4)}</strong></td>
                <td>${(crypto.miningRate * this.totalHashPower * 86400).toFixed(4)}/day</td>
                <td>
                    <button class="quick-buy" data-symbol="${crypto.symbol}">
                        <i class="fas fa-bolt"></i> Mine
                    </button>
                </td>
            `;
            
            this.cryptoTableEl.appendChild(row);
        });
        
        // Add event listeners to mine buttons
        document.querySelectorAll('.quick-buy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const symbol = e.currentTarget.getAttribute('data-symbol');
                const crypto = this.cryptocurrencies.find(c => c.symbol === symbol);
                if (crypto && this.isMining) {
                    this.showNotification(`⛏️ Mining ${crypto.symbol} at ${(crypto.miningRate * this.totalHashPower).toFixed(4)} coins/sec`, "info");
                }
            });
        });
    }
    
    updateHoldings() {
        let holdingsHTML = '';
        let hasHoldings = false;
        
        this.cryptocurrencies.forEach(crypto => {
            if (crypto.owned > 0) {
                hasHoldings = true;
                const cryptoValue = crypto.owned * crypto.price;
                
                holdingsHTML += `
                    <div class="portfolio-item">
                        <div>
                            <div class="portfolio-symbol" style="color: ${crypto.color};">${crypto.symbol}</div>
                            <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">
                                ${crypto.name}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div>${crypto.owned.toFixed(4)}</div>
                            <div class="portfolio-amount">$${cryptoValue.toFixed(2)}</div>
                            <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.5);">
                                $${crypto.price.toFixed(4)} each
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        if (hasHoldings) {
            this.cryptoHoldingsEl.innerHTML = holdingsHTML;
        } else {
            this.cryptoHoldingsEl.innerHTML = `
                <div style="text-align: center; padding: 30px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-coins" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    <p>No crypto holdings yet</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Start mining or buy crypto to begin!</p>
                </div>
            `;
        }
    }
    
    updateMiningButton() {
        if (this.isMining) {
            this.mineToggleBtn.innerHTML = '<i class="fas fa-pause"></i> Stop Mining';
            this.mineToggleBtn.classList.remove('game-btn-action');
            this.mineToggleBtn.classList.add('game-btn-sell');
            this.minerIconEl.style.animation = 'mine 1.5s infinite';
        } else {
            this.mineToggleBtn.innerHTML = '<i class="fas fa-play"></i> Start Mining';
            this.mineToggleBtn.classList.remove('game-btn-sell');
            this.mineToggleBtn.classList.add('game-btn-action');
            this.minerIconEl.style.animation = 'none';
        }
    }
    
    calculateHashPower() {
        let totalHash = 0;
        this.miningRigs.forEach(rig => {
            totalHash += rig.hashPower * rig.owned;
        });
        this.totalHashPower = totalHash;
    }
    
    calculateMiningSpeed() {
        let totalMiningRate = 0;
        this.cryptocurrencies.forEach(crypto => {
            totalMiningRate += crypto.miningRate * this.totalHashPower;
        });
        this.miningSpeed = totalMiningRate * 86400; // Convert to per day
    }
    
    buyMiningRig(rigId) {
        const rig = this.miningRigs.find(r => r.id === rigId);
        
        if (this.cash < rig.cost) {
            this.showNotification(`Insufficient funds. Need $${rig.cost}`, "error");
            return;
        }
        
        // Buy rig
        this.cash -= rig.cost;
        rig.owned += 1;
        
        // Recalculate hash power and mining speed
        this.calculateHashPower();
        this.calculateMiningSpeed();
        
        // Update UI
        this.updateUI();
        
        this.showNotification(`✅ Purchased ${rig.name} for $${rig.cost}`, "success");
    }
    
    toggleMining() {
        if (this.totalHashPower === 0 && !this.isMining) {
            this.showNotification("Buy mining rigs first!", "error");
            return;
        }
        
        this.isMining = !this.isMining;
        
        if (this.isMining) {
            this.startMining();
            this.showNotification("⛏️ Mining started!", "success");
        } else {
            this.stopMining();
            this.showNotification("⛏️ Mining stopped", "info");
        }
        
        this.updateMiningButton();
    }
    
    startMining() {
        if (this.miningInterval) clearInterval(this.miningInterval);
        
        this.miningInterval = setInterval(() => {
            // Mine each cryptocurrency
            this.cryptocurrencies.forEach(crypto => {
                const minedAmount = (crypto.miningRate * this.totalHashPower) / 10;
                crypto.owned += minedAmount;
            });
            
            // Random mining event
            if (Math.random() < 0.01) {
                const events = [
                    "Mining efficiency increased!",
                    "Found a rare crypto block!",
                    "Network difficulty decreased.",
                    "Cooling system working optimally."
                ];
                this.showNotification(events[Math.floor(Math.random() * events.length)], "success");
            }
            
            // Update UI every second
            this.updateUI();
            
        }, 100);
    }
    
    stopMining() {
        if (this.miningInterval) {
            clearInterval(this.miningInterval);
            this.miningInterval = null;
        }
    }
    
    buyCrypto() {
        const symbol = this.cryptoSelectEl.value;
        const amount = parseFloat(this.cryptoAmountEl.value);
        
        if (!symbol) {
            this.showNotification("Select a cryptocurrency", "error");
            return;
        }
        
        if (!amount || amount <= 0) {
            this.showNotification("Enter valid amount", "error");
            return;
        }
        
        const crypto = this.cryptocurrencies.find(c => c.symbol === symbol);
        const totalCost = amount * crypto.price;
        
        if (totalCost > this.cash) {
            this.showNotification(`Need $${totalCost.toFixed(2)}`, "error");
            return;
        }
        
        // Buy crypto
        this.cash -= totalCost;
        crypto.owned += amount;
        
        this.transactions.push({
            type: 'BUY',
            symbol: crypto.symbol,
            amount: amount,
            price: crypto.price,
            total: totalCost,
            time: new Date().toLocaleTimeString()
        });
        
        this.updateUI();
        this.cryptoAmountEl.value = '';
        
        this.showNotification(`✅ Bought ${amount.toFixed(4)} ${symbol}`, "success");
    }
    
    sellCrypto() {
        const symbol = this.cryptoSelectEl.value;
        const amount = parseFloat(this.cryptoAmountEl.value);
        
        if (!symbol) {
            this.showNotification("Select a cryptocurrency", "error");
            return;
        }
        
        if (!amount || amount <= 0) {
            this.showNotification("Enter valid amount", "error");
            return;
        }
        
        const crypto = this.cryptocurrencies.find(c => c.symbol === symbol);
        
        if (crypto.owned < amount) {
            this.showNotification(`Only own ${crypto.owned.toFixed(4)}`, "error");
            return;
        }
        
        const totalValue = amount * crypto.price;
        
        // Sell crypto
        this.cash += totalValue;
        crypto.owned -= amount;
        
        this.transactions.push({
            type: 'SELL',
            symbol: crypto.symbol,
            amount: amount,
            price: crypto.price,
            total: totalValue,
            time: new Date().toLocaleTimeString()
        });
        
        this.updateUI();
        this.cryptoAmountEl.value = '';
        
        this.showNotification(`✅ Sold ${amount.toFixed(4)} ${symbol}`, "success");
    }
    
    upgradeAllRigs() {
        let upgradeCost = 0;
        let upgradedCount = 0;
        
        this.miningRigs.forEach(rig => {
            if (rig.owned > 0) {
                upgradeCost += rig.cost * 0.2 * rig.owned;
                upgradedCount += rig.owned;
            }
        });
        
        if (upgradedCount === 0) {
            this.showNotification("No rigs to upgrade", "error");
            return;
        }
        
        if (this.cash < upgradeCost) {
            this.showNotification(`Need $${upgradeCost.toFixed(2)}`, "error");
            return;
        }
        
        // Apply upgrade
        this.cash -= upgradeCost;
        
        // Increase mining multiplier
        this.miningRigs.forEach(rig => {
            if (rig.owned > 0) {
                rig.miningMultiplier += 0.5;
            }
        });
        
        // Recalculate mining speed
        this.calculateMiningSpeed();
        
        this.updateUI();
        this.showNotification(`✅ Upgraded ${upgradedCount} rigs`, "success");
    }
    
    resetGame() {
        if (!confirm("Reset game? All progress will be lost.")) return;
        
        // Reset state
        this.cash = 5000;
        this.totalHashPower = 0;
        this.miningSpeed = 0;
        this.day = 1;
        this.isMining = false;
        this.transactions = [];
        this.events = [];
        
        // Reset cryptocurrencies
        this.cryptocurrencies.forEach(crypto => {
            crypto.owned = 0;
            const initialPrices = {
                "BTC": 45000,
                "ETH": 3200,
                "LTC": 150,
                "XRP": 0.85,
                "ADA": 1.20,
                "DOGE": 0.25
            };
            crypto.price = initialPrices[crypto.symbol] * (0.9 + Math.random() * 0.2);
            crypto.price = parseFloat(crypto.price.toFixed(4));
        });
        
        // Reset mining rigs
        this.miningRigs.forEach(rig => {
            rig.owned = 0;
            rig.miningMultiplier = rig.id === 1 ? 1 : rig.id === 2 ? 2 : rig.id === 3 ? 5 : rig.id === 4 ? 20 : 100;
        });
        
        // Stop mining
        this.stopMining();
        
        // Update UI
        this.updateUI();
        
        this.showNotification("🔄 Game reset! Start mining empire!", "info");
    }
    
    showNotification(message, type = "info") {
        // Same notification function as Stock Market game
        const notification = document.createElement('div');
        notification.className = `game-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    const game = new CryptoRushGame();
});