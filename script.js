function calculate() {
  const principal = parseFloat(document.getElementById('principal').value);
  const interest = parseFloat(document.getElementById('interest').value) / 100;
  const months = parseFloat(document.getElementById('months').value);

  if (!principal || !interest || !months) {
    alert("Please fill in all fields correctly!");
    return;
  }

  const monthlyPayment = (principal * interest) / (1 - Math.pow(1 + interest, -months));
  document.getElementById('payment').textContent = monthlyPayment.toFixed(2);
}
