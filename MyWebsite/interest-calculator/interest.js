document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-mode-toggle");
  const interestType = document.getElementById("interest-type");
  const compoundFrequencyGroup = document.getElementById("compound-frequency-group");

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

  // Show/hide compound frequency based on interest type
  interestType.addEventListener("change", function() {
    if (this.value === "compound") {
      compoundFrequencyGroup.style.display = "block";
    } else {
      compoundFrequencyGroup.style.display = "none";
    }
  });

  // Add input validation
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      if (this.value < 0) this.value = Math.abs(this.value);
    });
  });
});

function calculateInterest() {
  const principal = parseFloat(document.getElementById("principal").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const time = parseFloat(document.getElementById("time").value);
  const interestType = document.getElementById("interest-type").value;
  const resultDiv = document.getElementById("result");
  const comparisonChart = document.getElementById("comparison-chart");

  // Validation
  if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
    showError("⚠️ Please enter valid positive numbers.");
    return;
  }

  if (principal < 100) {
    showError("⚠️ Minimum principal amount is ₹100.");
    return;
  }

  if (time > 50) {
    showError("⚠️ Maximum time period is 50 years.");
    return;
  }

  if (rate > 30) {
    showError("⚠️ Maximum interest rate is 30%.");
    return;
  }

  let interest = 0;
  let totalAmount = 0;

  if (interestType === "simple") {
    // Simple Interest formula
    interest = (principal * rate * time) / 100;
    totalAmount = principal + interest;
    
    // Hide comparison chart for simple interest
    comparisonChart.style.display = "none";
  } else {
    // Compound Interest formula
    const compoundFrequency = parseInt(document.getElementById("compound-frequency").value);
    const n = compoundFrequency; // compounding periods per year
    interest = principal * Math.pow(1 + rate / (100 * n), n * time) - principal;
    totalAmount = principal + interest;
    
    // Show comparison with simple interest
    showComparison(principal, rate, time, interest, totalAmount);
  }

  // Format numbers with commas
  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update result display
  document.getElementById("interest").textContent = formatCurrency(interest);
  document.getElementById("total-amount").textContent = formatCurrency(totalAmount);
  
  // Show result with animation
  resultDiv.classList.add('show');
}

function showComparison(principal, rate, time, compoundInterest, compoundTotal) {
  const comparisonChart = document.getElementById("comparison-chart");
  const simpleInterest = (principal * rate * time) / 100;
  const simpleTotal = principal + simpleInterest;
  
  // Format values
  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Update comparison values
  document.getElementById("simple-value").textContent = formatCurrency(simpleTotal);
  document.getElementById("compound-value").textContent = formatCurrency(compoundTotal);
  
  // Calculate chart percentages
  const maxValue = Math.max(simpleTotal, compoundTotal);
  const simplePercent = (simpleTotal / maxValue) * 100;
  const compoundPercent = (compoundTotal / maxValue) * 100;
  
  // Animate chart bars
  setTimeout(() => {
    document.getElementById("simple-chart").style.width = simplePercent + '%';
    document.getElementById("compound-chart").style.width = compoundPercent + '%';
  }, 100);
  
  // Show comparison chart
  comparisonChart.style.display = "block";
}

function showError(message) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<p style='color: #ff5252; text-align: center; font-weight: bold;'>${message}</p>`;
  resultDiv.classList.add('show');
  
  // Hide comparison chart on error
  document.getElementById("comparison-chart").style.display = "none";
  
  // Shake animation for error
  resultDiv.style.animation = 'shake 0.5s';
  setTimeout(() => {
    resultDiv.style.animation = '';
  }, 500);
}

function resetInterest() {
  document.getElementById("principal").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("time").value = "";
  document.getElementById("interest-type").value = "simple";
  document.getElementById("compound-frequency-group").style.display = "none";
  document.getElementById("result").classList.remove("show");
  document.getElementById("comparison-chart").style.display = "none";
}

// Add keypress event to calculate when Enter is pressed
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    calculateInterest();
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