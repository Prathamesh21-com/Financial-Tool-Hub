// ===== WELCOME SCREEN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    
    if (welcomeScreen) {
        setTimeout(() => {
            welcomeScreen.classList.add('hide');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 500);
        }, 2500);
    }
    
    // Initialize all functionality
    initializeDarkMode();
    initializeBackButton();
});

// ===== DARK MODE FUNCTIONALITY =====
function initializeDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
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
        });
    }
}

// ===== BACK BUTTON LOGIC =====
function initializeBackButton() {
    const backButton = document.getElementById('backButton');
    
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Check if we have history and came from within our site
            if (document.referrer.includes('prathamesh21-com.github.io/Financial-Tool-Hub') && 
                document.referrer !== window.location.href) {
                window.history.back();
            } else {
                // Redirect to home page
                window.location.href = '/Financial-Tool-Hub/index.html';
            }
        });
    }
}

// ===== EXISTING CALCULATOR FUNCTIONS (keep all your current functions) =====
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

// Keep all your existing calculator functions below...
// calculateLoan(), calculateInterest(), etc.
