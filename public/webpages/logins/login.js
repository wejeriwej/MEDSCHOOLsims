const loginBtn = document.getElementById("loginBtn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");

// Login button click
loginBtn.addEventListener("click", async () => {
  msg.innerText = "";
  try {
    msg.innerText = "Logging in...";
    const userCred = await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
    msg.innerText = "Login successful!";
    setTimeout(() => location.href = "profile.html", 800);
  } catch (err) {
    console.error(err);
    msg.innerText = err.message;
  }
});

// Redirect if already logged in
auth.onAuthStateChanged(user => {
  if (user) {
    location.href = "profile.html";
  }
});
