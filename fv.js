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

function calculateFV() {
  const pv = parseFloat(document.getElementById("presentValue").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const years = parseFloat(document.getElementById("years").value);
  const compoundFrequency = parseInt(document.getElementById("compound-frequency").value);
  const resultDiv = document.getElementById("result");
  const growthVisualization = document.getElementById("growth-visualization");

  // Validation
  if (isNaN(pv) || isNaN(rate) || isNaN(years) || pv <= 0 || rate <= 0 || years <= 0) {
    showError("⚠️ Please enter valid positive numbers.");
    return;
  }

  if (pv < 100) {
    showError("⚠️ Minimum investment amount is ₹100.");
    return;
  }

  if (years > 50) {
    showError("⚠️ Maximum time period is 50 years.");
    return;
  }

  if (rate > 30) {
    showError("⚠️ Maximum interest rate is 30%.");
    return;
  }

  // Calculate Future Value
  const n = compoundFrequency; // compounding periods per year
  const fv = pv * Math.pow(1 + rate / (100 * n), n * years);
  const interestEarned = fv - pv;

  // Format numbers with commas
  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update result display
  document.getElementById("future-value").textContent = formatCurrency(fv);
  document.getElementById("interest-earned").textContent = formatCurrency(interestEarned);
  
  // Update growth visualization
  updateGrowthVisualization(pv, fv, interestEarned);
  
  // Show result with animation
  resultDiv.classList.add('show');
  growthVisualization.style.display = 'block';
}

function updateGrowthVisualization(pv, fv, interestEarned) {
  const growthBar = document.getElementById("growth-bar");
  const growthMarker = document.getElementById("growth-marker");
  const pvDisplay = document.getElementById("pv-display");
  const fvDisplay = document.getElementById("fv-display");
  
  // Format numbers for display
  const formatCompact = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toFixed(0);
  };
  
  pvDisplay.textContent = formatCompact(pv);
  fvDisplay.textContent = formatCompact(fv);
  
  // Calculate growth percentage for visualization
  const growthPercentage = Math.min(100, (interestEarned / pv) * 100);
  
  // Animate growth bar
  setTimeout(() => {
    growthBar.style.width = growthPercentage + '%';
    growthMarker.textContent = Math.round(growthPercentage) + '% Growth';
    growthMarker.style.right = (100 - growthPercentage) + '%';
  }, 100);
}

function showError(message) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<p style='color: #ff5252; text-align: center; font-weight: bold;'>${message}</p>`;
  resultDiv.classList.add('show');
  
  // Hide growth visualization on error
  document.getElementById("growth-visualization").style.display = "none";
  
  // Shake animation for error
  resultDiv.style.animation = 'shake 0.5s';
  setTimeout(() => {
    resultDiv.style.animation = '';
  }, 500);
}

function resetFV() {
  document.getElementById("presentValue").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("years").value = "";
  document.getElementById("compound-frequency").value = "12";
  document.getElementById("result").classList.remove("show");
  document.getElementById("growth-visualization").style.display = "none";
  
  // Reset growth bar
  document.getElementById("growth-bar").style.width = "0%";
}

// Add keypress event to calculate when Enter is pressed
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    calculateFV();
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