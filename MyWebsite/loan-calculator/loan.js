document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-mode-toggle");

  // Restore dark mode on reload
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    if (toggle) toggle.checked = true;
  }

  // Listen for toggle changes
  if (toggle) {
    toggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode", this.checked);
      localStorage.setItem("darkMode", this.checked);
    });
  }

  // Add input validation
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      if (this.value < 0) this.value = Math.abs(this.value);
    });
  });
});

function calculateLoan() {
  const amount = parseFloat(document.getElementById('loan-amount').value);
  const annualRate = parseFloat(document.getElementById('interest-rate').value);
  const months = parseInt(document.getElementById('loan-tenure').value);
  const resultDiv = document.getElementById('result');

  // Validation
  if (isNaN(amount) || isNaN(annualRate) || isNaN(months) || amount <= 0 || annualRate <= 0 || months <= 0) {
    showError("⚠️ Please enter valid positive numbers.");
    return;
  }

  if (amount < 1000) {
    showError("⚠️ Minimum loan amount is ₹1000.");
    return;
  }

  if (months < 6) {
    showError("⚠️ Minimum loan tenure is 6 months.");
    return;
  }

  if (annualRate > 30) {
    showError("⚠️ Maximum interest rate is 30%.");
    return;
  }

  // Calculate loan details
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - amount;

  // Format numbers with commas
  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update result display
  document.getElementById('monthly-payment').textContent = formatCurrency(monthlyPayment);
  document.getElementById('total-payment').textContent = formatCurrency(totalPayment);
  document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
  
  // Generate amortization schedule
  generateAmortizationSchedule(amount, monthlyRate, months, monthlyPayment);
  
  // Show result with animation
  resultDiv.classList.add('show');
}

function generateAmortizationSchedule(principal, monthlyRate, months, monthlyPayment) {
  let balance = principal;
  const amortizationBody = document.getElementById('amortization-body');
  amortizationBody.innerHTML = '';
  
  // Show only first 12 months for brevity
  const displayMonths = Math.min(months, 12);
  
  for (let i = 1; i <= displayMonths; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    
    // Ensure balance doesn't go negative
    if (balance < 0) balance = 0;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i}</td>
      <td>₹${monthlyPayment.toFixed(2)}</td>
      <td>₹${principalPayment.toFixed(2)}</td>
      <td>₹${interestPayment.toFixed(2)}</td>
      <td>₹${balance.toFixed(2)}</td>
    `;
    amortizationBody.appendChild(row);
  }
  
  // Add a summary row if we're not showing all months
  if (months > 12) {
    const summaryRow = document.createElement('tr');
    summaryRow.innerHTML = `
      <td colspan="5" style="text-align: center; font-style: italic;">
        ... ${months - 12} more months
      </td>
    `;
    amortizationBody.appendChild(summaryRow);
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

function showError(message) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<p style='color: #ff5252; text-align: center; font-weight: bold;'>${message}</p>`;
  resultDiv.classList.add('show');
  
  // Shake animation for error
  resultDiv.style.animation = 'shake 0.5s';
  setTimeout(() => {
    resultDiv.style.animation = '';
  }, 500);
}

function resetLoan() {
  document.getElementById("loan-amount").value = "";
  document.getElementById("interest-rate").value = "";
  document.getElementById("loan-tenure").value = "";
  document.getElementById("result").classList.remove("show");
  document.getElementById("amortization-table").style.display = "none";
  document.querySelector('.toggle-table').textContent = 'Show Amortization Schedule';
}

// Add keypress event to calculate when Enter is pressed
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    calculateLoan();
  }
});

// Add styles for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    50% { transform: translateX(10px); }
    75% { transform: translateX(-10px); }
  }
`;
document.head.appendChild(style);