const emailInput = document.getElementById("email");
const resetBtn = document.getElementById("resetBtn");
const msg = document.getElementById("msg");

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Enable/disable reset button
emailInput.addEventListener("input", () => {
  if (isValidEmail(emailInput.value)) {
    resetBtn.disabled = false;
    emailInput.style.borderColor = "green";
    msg.innerText = "";
  } else {
    resetBtn.disabled = true;
    emailInput.style.borderColor = "darkred";
    msg.innerText = "Enter a valid email address";
    msg.style.color = "darkred";
  }
});

// Trigger reset when "Enter" key is pressed
emailInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    resetBtn.click();
  }
});

// Send reset email
resetBtn.addEventListener("click", async () => {
  msg.innerText = "";
  try {
    msg.innerText = "Sending reset email...";
    await auth.sendPasswordResetEmail(emailInput.value);
    msg.innerText = "Reset email sent! Check your inbox. (If not found check SPAM) ";
    msg.style.color = "green";
  } catch (err) {
    console.error(err);
    msg.innerText = err.message;
    msg.style.color = "darkred";
  }
});
