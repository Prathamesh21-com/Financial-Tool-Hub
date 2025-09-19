window.addEventListener('DOMContentLoaded', () => {
  // -------------------------
  // Welcome Screen Logic (Show only once)
  // -------------------------
  const welcomeScreen = document.getElementById('welcome-screen');
  const mainContent = document.getElementById('home-content');
  const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

  if (welcomeScreen && mainContent) {
    if (!hasSeenWelcome) {
      // First time visit - show welcome animation
      localStorage.setItem('hasSeenWelcome', 'true');
      welcomeScreen.style.display = 'flex';
      mainContent.style.display = 'none';

      setTimeout(() => {
        welcomeScreen.classList.add('hide');
        setTimeout(() => {
          welcomeScreen.style.display = 'none';
          mainContent.style.display = 'block';
        }, 500);
      }, 2500);
    } else {
      // Returning visitor - skip animation
      welcomeScreen.style.display = 'none';
      mainContent.style.display = 'block';
    }
  }

  // -------------------------
  // Dark Mode Logic
  // -------------------------
  const darkToggle = document.getElementById('dark-mode-toggle');
  if (darkToggle) {
    // Load saved preference
    if (localStorage.getItem('dark-mode') === 'enabled') {
      document.body.classList.add('dark-mode');
      darkToggle.checked = true;
    }

    // Listen for toggle change
    darkToggle.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
      }
    });
  }

  // -------------------------
  // Navigation Enhancement
  // -------------------------
  // Update navigation to prevent unwanted page reloads
  updateNavigation();
});

// Function to update navigation behavior
function updateNavigation() {
  const homeLinks = document.querySelectorAll('a[href="#"], a[href="index.html"], a[onclick*="scrollToTop"]');
  
  homeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // If we're already on the homepage, just scroll to top
      if (isOnHomePage()) {
        e.preventDefault();
        scrollToTop();
      }
      // Otherwise, let the default navigation happen
    });
  });
}

// Check if we're on the homepage
function isOnHomePage() {
  return window.location.pathname.endsWith('index.html') || 
         window.location.pathname === '/' || 
         window.location.pathname.endsWith('/');
}

// Smooth scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Function to manually reset the welcome animation (for testing if needed)
function resetWelcomeAnimation() {
  localStorage.removeItem('hasSeenWelcome');
  localStorage.removeItem('dark-mode');
  alert('Welcome animation and preferences have been reset. Refresh the page to see the animation again.');
}

// Enhanced function to handle calculator form submissions with Enter key
function setupCalculatorForms() {
  const calculatorForms = document.querySelectorAll('.calculator-container');
  
  calculatorForms.forEach(form => {
    const inputs = form.querySelectorAll('input');
    const calculateButton = form.querySelector('button.calculate');
    
    inputs.forEach(input => {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && calculateButton) {
          e.preventDefault();
          calculateButton.click();
        }
      });
    });
  });
}

// Initialize calculator forms when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Small delay to ensure all elements are rendered
  setTimeout(setupCalculatorForms, 100);
});

// Enhanced input validation for number inputs
function setupInputValidation() {
  const numberInputs = document.querySelectorAll('input[type="number"]');
  
  numberInputs.forEach(input => {
    // Prevent negative values
    input.addEventListener('input', function() {
      if (this.value < 0) this.value = Math.abs(this.value);
    });
    
    // Improve mobile experience
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      input.addEventListener('focus', function() {
        setTimeout(() => {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    }
  });
}

// Initialize input validation
document.addEventListener('DOMContentLoaded', setupInputValidation);