// ===== WELCOME SCREEN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    
    if (welcomeScreen) {
        setTimeout(() => {
            welcomeScreen.classList.add('hide');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                // Show selection screen after welcome
                const selectionScreen = document.getElementById('selection-screen');
                if (selectionScreen) {
                    selectionScreen.style.display = 'flex';
                    setTimeout(() => {
                        selectionScreen.style.opacity = "1";
                    }, 50);
                }
            }, 500);
        }, 2500);
    }
    
    // Initialize all functionality
    initializeDarkMode();
    initializeBackButtons();
    initializeSelectionScreen();
});

// ===== DARK MODE FUNCTIONALITY =====
function initializeDarkMode() {
    const toggles = document.querySelectorAll('#darkModeToggle, #darkToggleCalculators, #darkToggleGames');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Set all toggles to correct state
    toggles.forEach(toggle => {
        if (toggle) {
            toggle.checked = currentTheme === 'dark';
            
            // Toggle event listener
            toggle.addEventListener('change', function() {
                if (this.checked) {
                    document.body.classList.add('dark-mode');
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                }
                
                // Sync all other toggles
                toggles.forEach(t => {
                    if (t !== this) {
                        t.checked = this.checked;
                    }
                });
            });
        }
    });
}

// ===== SELECTION SCREEN FUNCTIONALITY =====
function initializeSelectionScreen() {
    const calculatorSelect = document.getElementById('calculator-select');
    const gamesSelect = document.getElementById('games-select');
    const backToSelectionBtns = document.querySelectorAll('#back-to-selection, #back-to-selection-games');
    
    if (calculatorSelect) {
        calculatorSelect.addEventListener('click', () => {
            const selectionScreen = document.getElementById('selection-screen');
            const calculatorsPage = document.getElementById('calculators-page');
            
            if (selectionScreen && calculatorsPage) {
                selectionScreen.classList.add('hide');
                setTimeout(() => {
                    selectionScreen.style.display = 'none';
                    calculatorsPage.classList.add('active');
                }, 500);
            }
        });
    }
    
    if (gamesSelect) {
        gamesSelect.addEventListener('click', () => {
            const selectionScreen = document.getElementById('selection-screen');
            const gamesPage = document.getElementById('games-page');
            
            if (selectionScreen && gamesPage) {
                selectionScreen.classList.add('hide');
                setTimeout(() => {
                    selectionScreen.style.display = 'none';
                    gamesPage.classList.add('active');
                }, 500);
            }
        });
    }
    
    // Back to selection functionality
    backToSelectionBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                const calculatorsPage = document.getElementById('calculators-page');
                const gamesPage = document.getElementById('games-page');
                const selectionScreen = document.getElementById('selection-screen');
                
                if (calculatorsPage) calculatorsPage.classList.remove('active');
                if (gamesPage) gamesPage.classList.remove('active');
                
                if (selectionScreen) {
                    selectionScreen.style.display = 'flex';
                    selectionScreen.classList.remove('hide');
                }
            });
        }
    });
}

// ===== BACK BUTTON LOGIC (CORRECTED) =====
function initializeBackButtons() {
    const backButtons = document.querySelectorAll('.back-btn, .calculator-back-btn, #backButton');
    
    backButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Check if we're on a calculator page (files in root)
                const isCalculatorPage = window.location.pathname.includes('loan') ||
                                        window.location.pathname.includes('interest') ||
                                        window.location.pathname.includes('sip') ||
                                        window.location.pathname.includes('pv') ||
                                        window.location.pathname.includes('fv');
                
                // Check if we're on a game page (files inside /games folder)
                const isGamePage = window.location.pathname.includes('/games/');
                
                if (isCalculatorPage) {
                    // Calculator pages are in root → go to index.html directly
                    window.location.href = 'index.html';
                } else if (isGamePage) {
                    // Game pages are inside /games folder → go up one level
                    window.location.href = '../index.html';
                } else if (document.referrer && 
                          document.referrer.includes(window.location.hostname) && 
                          document.referrer !== window.location.href) {
                    // If we have valid history within our site
                    window.history.back();
                } else {
                    // Default to home page
                    window.location.href = 'index.html';
                }
            });
        }
    });
}

// ===== EXISTING CALCULATOR FUNCTIONS =====
function formatCurrency(amount) {
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function validateInputs(inputs) {
    for (let input of inputs) {
        if (!input.value || isNaN(input.value) || parseFloat(input.value) <= 0) {
            input.style.border = '2px solid red';
            return false;
        }
        input.style.border = '1px solid #ccc';
    }
    return true;
}

function showResult(resultElement) {
    resultElement.classList.add('show');
    resultElement.style.display = 'block';
}

function resetCalculator(inputs, resultElement) {
    inputs.forEach(input => {
        input.value = '';
        input.style.border = '1px solid #ccc';
    });
    
    if (resultElement) {
        resultElement.classList.remove('show');
        resultElement.style.display = 'none';
    }
}

// ===== SCROLL TO TOP FUNCTION =====
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== GAMES UTILITY FUNCTIONS =====
function gameAlert(message, type = 'info') {
    // Create custom alert for games
    const alertDiv = document.createElement('div');
    alertDiv.className = `game-alert game-alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="game-alert-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Add close functionality
    alertDiv.querySelector('.game-alert-close').addEventListener('click', () => {
        alertDiv.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Add game alert styles dynamically
if (!document.querySelector('#game-alert-styles')) {
    const style = document.createElement('style');
    style.id = 'game-alert-styles';
    style.textContent = `
        .game-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            color: #333;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        }
        
        .game-alert-success {
            border-left: 4px solid #2ecc71;
        }
        
        .game-alert-error {
            border-left: 4px solid #e74c3c;
        }
        
        .game-alert-info {
            border-left: 4px solid #3498db;
        }
        
        .game-alert-close {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 1rem;
            margin-left: auto;
            padding: 0;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        body.dark-mode .game-alert {
            background: rgba(30, 30, 30, 0.95);
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Keep all your existing calculator functions below...
// calculateLoan(), calculateInterest(), etc.
