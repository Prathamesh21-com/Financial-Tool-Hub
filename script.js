// ===== WELCOME SCREEN FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const welcomeScreen = document.getElementById('welcome-screen');
    
    if (welcomeScreen) {
        setTimeout(() => {
            welcomeScreen.classList.add('hide');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
            }, 500);
        }, 3000);
    }
    
    // Initialize dark mode and back button
    initializeDarkMode();
    initializeBackButton();
});

// ===== DARK MODE FUNCTIONALITY =====
function initializeDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    if (toggle) {
        toggle.checked = currentTheme === 'dark';
        
        // Toggle event listener
        toggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark');
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

// ===== UNIVERSAL CALCULATOR FUNCTIONS =====
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

// ===== LOAN CALCULATOR FUNCTIONS =====
function calculateLoan() {
    const amount = parseFloat(document.getElementById('loan-amount').value);
    const rate = parseFloat(document.getElementById('interest-rate').value);
    const tenure = parseInt(document.getElementById('loan-tenure').value);
    
    const inputs = [
        document.getElementById('loan-amount'),
        document.getElementById('interest-rate'),
        document.getElementById('loan-tenure')
    ];
    
    if (!validateInputs(inputs)) return;
    
    const monthlyRate = rate / 12 / 100;
    const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - amount;
    
    document.getElementById('monthly-payment').textContent = formatCurrency(emi);
    document.getElementById('total-payment').textContent = formatCurrency(totalPayment);
    document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
    
    showResult(document.getElementById('result'));
    generateAmortizationTable(amount, rate, tenure, emi);
}

function generateAmortizationTable(principal, rate, tenure, emi) {
    const tableBody = document.getElementById('amortization-body');
    tableBody.innerHTML = '';
    
    let balance = principal;
    const monthlyRate = rate / 12 / 100;
    
    for (let month = 1; month <= Math.min(12, tenure); month++) {
        const interest = balance * monthlyRate;
        const principalPaid = emi - interest;
        balance -= principalPaid;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(emi)}</td>
            <td>${formatCurrency(principalPaid)}</td>
            <td>${formatCurrency(interest)}</td>
            <td>${formatCurrency(Math.max(0, balance))}</td>
        `;
        tableBody.appendChild(row);
    }
}

function toggleAmortization() {
    const table = document.getElementById('amortization-table');
    const button = document.querySelector('.toggle-table');
    
    if (table.style.display === 'none') {
        table.style.display = 'block';
        button.textContent = 'Hide Amortization Schedule';
    } else {
        table.style.display = 'none';
        button.textContent = 'Show Amortization Schedule';
    }
}

function resetLoan() {
    const inputs = [
        document.getElementById('loan-amount'),
        document.getElementById('interest-rate'),
        document.getElementById('loan-tenure')
    ];
    resetCalculator(inputs, document.getElementById('result'));
    document.getElementById('amortization-table').style.display = 'none';
    document.querySelector('.toggle-table').textContent = 'Show Amortization Schedule';
}

// ===== INTEREST CALCULATOR FUNCTIONS =====
function calculateInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const time = parseFloat(document.getElementById('time').value);
    const interestType = document.getElementById('interest-type').value;
    
    const inputs = [
        document.getElementById('principal'),
        document.getElementById('rate'),
        document.getElementById('time')
    ];
    
    if (!validateInputs(inputs)) return;
    
    let interest, total;
    
    if (interestType === 'simple') {
        interest = (principal * rate * time) / 100;
        total = principal + interest;
    } else {
        // Compound interest
        total = principal * Math.pow(1 + rate / 100, time);
        interest = total - principal;
    }
    
    document.getElementById('interest-amount').textContent = formatCurrency(interest);
    document.getElementById('total-amount').textContent = formatCurrency(total);
    
    showResult(document.getElementById('result'));
}

function resetInterest() {
    const inputs = [
        document.getElementById('principal'),
        document.getElementById('rate'),
        document.getElementById('time')
    ];
    resetCalculator(inputs, document.getElementById('result'));
}

// ===== SIP CALCULATOR FUNCTIONS =====
function calculateSIP() {
    const monthlyInvestment = parseFloat(document.getElementById('monthly-investment').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const tenure = parseInt(document.getElementById('tenure').value);
    
    const inputs = [
        document.getElementById('monthly-investment'),
        document.getElementById('rate'),
        document.getElementById('tenure')
    ];
    
    if (!validateInputs(inputs)) return;
    
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    
    const futureValue = monthlyInvestment * 
        (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * 
        (1 + monthlyRate);
    
    const totalInvestment = monthlyInvestment * months;
    const wealthGained = futureValue - totalInvestment;
    
    document.getElementById('maturity-amount').textContent = formatCurrency(futureValue);
    document.getElementById('total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('wealth-gained').textContent = formatCurrency(wealthGained);
    
    showResult(document.getElementById('result'));
}

function resetSIP() {
    const inputs = [
        document.getElementById('monthly-investment'),
        document.getElementById('rate'),
        document.getElementById('tenure')
    ];
    resetCalculator(inputs, document.getElementById('result'));
}

// ===== PV CALCULATOR FUNCTIONS =====
function calculatePV() {
    const futureValue = parseFloat(document.getElementById('future-value').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const periods = parseInt(document.getElementById('periods').value);
    
    const inputs = [
        document.getElementById('future-value'),
        document.getElementById('rate'),
        document.getElementById('periods')
    ];
    
    if (!validateInputs(inputs)) return;
    
    const presentValue = futureValue / Math.pow(1 + rate / 100, periods);
    
    document.getElementById('present-value').textContent = formatCurrency(presentValue);
    
    showResult(document.getElementById('result'));
}

function resetPV() {
    const inputs = [
        document.getElementById('future-value'),
        document.getElementById('rate'),
        document.getElementById('periods')
    ];
    resetCalculator(inputs, document.getElementById('result'));
}

// ===== FV CALCULATOR FUNCTIONS =====
function calculateFV() {
    const presentValue = parseFloat(document.getElementById('present-value').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const periods = parseInt(document.getElementById('periods').value);
    
    const inputs = [
        document.getElementById('present-value'),
        document.getElementById('rate'),
        document.getElementById('periods')
    ];
    
    if (!validateInputs(inputs)) return;
    
    const futureValue = presentValue * Math.pow(1 + rate / 100, periods);
    
    document.getElementById('future-value').textContent = formatCurrency(futureValue);
    
    showResult(document.getElementById('result'));
}

function resetFV() {
    const inputs = [
        document.getElementById('present-value'),
        document.getElementById('rate'),
        document.getElementById('periods')
    ];
    resetCalculator(inputs, document.getElementById('result'));
}
