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

function calculateSIP() {
  const P = parseFloat(document.getElementById('monthlyInvestment').value);
  const annualRate = parseFloat(document.getElementById('annualRate').value);
  const years = parseInt(document.getElementById('years').value);
  const resultDiv = document.getElementById('result');

  // Validation
  if (isNaN(P) || isNaN(annualRate) || isNaN(years) || P <= 0 || annualRate <= 0 || years <= 0) {
    showError("⚠️ Please enter valid positive numbers.");
    return;
  }

  if (P < 500) {
    showError("⚠️ Minimum monthly investment should be ₹500.");
    return;
  }

  if (years > 40) {
    showError("⚠️ Maximum investment period is 40 years.");
    return;
  }

  if (annualRate > 30) {
    showError("⚠️ Maximum expected return rate is 30%.");
    return;
  }

  // Calculate SIP
  const r = annualRate / 12 / 100; // Monthly interest rate
  const n = years * 12; // Total number of payments (months)

  const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const totalInvestment = P * n;
  const wealthGained = futureValue - totalInvestment;

  // Format numbers with commas
  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update result display
  document.getElementById('total-investment').textContent = formatCurrency(totalInvestment);
  document.getElementById('wealth-gained').textContent = formatCurrency(wealthGained);
  document.getElementById('future-value').textContent = formatCurrency(futureValue);
  
  // Show result with animation
  resultDiv.classList.add('show');
  
  // Add celebration effect for large returns
  if (wealthGained > totalInvestment) {
    celebrate();
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

function resetSIP() {
  document.getElementById("monthlyInvestment").value = "";
  document.getElementById("annualRate").value = "";
  document.getElementById("years").value = "";
  document.getElementById("result").classList.remove("show");
}

function celebrate() {
  // Create celebration effect
  const celebration = document.createElement('div');
  celebration.style.position = 'fixed';
  celebration.style.top = '0';
  celebration.style.left = '0';
  celebration.style.width = '100%';
  celebration.style.height = '100%';
  celebration.style.pointerEvents = 'none';
  celebration.style.zIndex = '9999';
  document.body.appendChild(celebration);
  
  // Add confetti effect
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = getRandomColor();
    confetti.style.borderRadius = '50%';
    confetti.style.top = '0';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animation = `confetti-fall ${Math.random() * 2 + 1}s linear forwards`;
    celebration.appendChild(confetti);
  }
  
  // Remove celebration after animation
  setTimeout(() => {
    document.body.removeChild(celebration);
  }, 3000);
}

function getRandomColor() {
  const colors = ['#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#536dfe', '#448aff', '#40c4ff', '#18ffff', '#64ffda', '#69f0ae'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Add keypress event to calculate when Enter is pressed
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    calculateSIP();
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
  
  @keyframes confetti-fall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
`;
document.head.appendChild(style);