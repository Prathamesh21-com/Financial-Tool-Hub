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

function calculatePV() {
  const fv = parseFloat(document.getElementById("futureValue").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const years = parseFloat(document.getElementById("years").value);
  const resultDiv = document.getElementById("result");
  const pvElement = document.getElementById("present-value");
  const explanationElement = document.getElementById("explanation");

  // Validation
  if (isNaN(fv) || isNaN(rate) || isNaN(years) || fv <= 0 || rate <= 0 || years <= 0) {
    showError("⚠️ Please enter valid positive numbers.");
    return;
  }

  if (years > 100) {
    showError("⚠️ Maximum time period is 100 years.");
    return;
  }

  if (rate > 50) {
    showError("⚠️ Maximum discount rate is 50%.");
    return;
  }

  // Calculate Present Value
  const pv = fv / Math.pow(1 + rate / 100, years);

  // Format numbers with commas
  const formatCurrency = (amount) => {
    return '₹' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Update result display
  pvElement.textContent = formatCurrency(pv);
  
  // Add explanation based on the result
  if (pv < fv * 0.1) {
    explanationElement.textContent = "The future amount is heavily discounted due to the high rate or long time period.";
  } else if (pv < fv * 0.5) {
    explanationElement.textContent = "The future amount is significantly discounted due to the rate and time period.";
  } else {
    explanationElement.textContent = "This is the current worth of a future sum of money given a specified rate of return.";
  }
  
  // Show result with animation
  resultDiv.classList.add('show');
}

function showError(message) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `<p style='color: #ff5252; text-align: center; font-weight: bold;'>${message}</p>`;
  resultDiv.classList.add('show');
  
  // Shake animation for error
  resultDiv.style.animation = 'shake 0.5s';
  setTimeout(() => {
    resultDiv.style.animation = '';
  }, 500);
}

function resetPV() {
  document.getElementById("futureValue").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("years").value = "";
  document.getElementById("result").classList.remove("show");
}

// Add keypress event to calculate when Enter is pressed
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    calculatePV();
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