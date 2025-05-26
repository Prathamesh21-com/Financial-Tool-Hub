function calculateLoan() {
  const amount = parseFloat(document.getElementById("amount").value);
  const rate = parseFloat(document.getElementById("rate").value);
  const months = parseFloat(document.getElementById("months").value);
  const currency = document.getElementById("currency").value;
  const resultDiv = document.getElementById("result");

  // Validation: Empty or non-numeric
  if (isNaN(amount) || isNaN(rate) || isNaN(months)) {
    alert("❗ Please fill all fields correctly.");
    return;
  }

  // Validation: Must be positive numbers
  if (amount <= 0 || rate <= 0 || months <= 0) {
    alert("❗ All values must be greater than zero.");
    return;
  }

  const monthlyRate = rate / 100;
  const emi = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const formattedEMI = emi.toFixed(2);

  const totalPayment = emi * months;
  const totalInterest = totalPayment - amount;

  // Inject results with selected currency symbol
  document.getElementById("monthly").innerText = `${currency} ${formattedEMI}`;
  document.getElementById("total-payment").innerText = `${currency} ${totalPayment.toFixed(2)}`;
  document.getElementById("total-interest").innerText = `${currency} ${totalInterest.toFixed(2)}`;

  // Show the result card
  resultDiv.classList.add("show");
}

function resetForm() {
  document.getElementById("amount").value = "";
  document.getElementById("rate").value = "";
  document.getElementById("months").value = "";

  document.getElementById("monthly").innerText = "₹ 0.00";
  document.getElementById("total-payment").innerText = "₹ 0.00";
  document.getElementById("total-interest").innerText = "₹ 0.00";

  document.getElementById("result").classList.remove("show");
  document.getElementById("currency").value = "₹";
  document.getElementById("currency-label").innerText = "₹";
}

// Update currency label next to Loan Amount dynamically
document.getElementById("currency").addEventListener("change", function () {
  document.getElementById("currency-label").innerText = this.value;

  // Also update result amounts if visible
  const resultDiv = document.getElementById("result");
  if (resultDiv.classList.contains("show")) {
    calculateLoan();
  }
});

// 🌙 Dark Mode Toggle
document.querySelector('.toggle-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
