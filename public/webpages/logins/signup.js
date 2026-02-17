const signupBtn = document.getElementById("signupBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");
const passwordHelp = document.getElementById("passwordHelp");

// Trigger signup when "Enter" key is pressed in any input field
function handleEnterKey(event) {
  if (event.key === "Enter") {
    signupBtn.click();
  }
}

// Add event listeners for all input fields
nameInput.addEventListener("keydown", handleEnterKey);
emailInput.addEventListener("keydown", handleEnterKey);
passwordInput.addEventListener("keydown", handleEnterKey);


signupBtn.addEventListener("click", async () => {
  msg.innerText = "";  // clear previous message
  try {
    msg.innerText = "Creating account...";

    const userCred = await auth.createUserWithEmailAndPassword(
      emailInput.value,
      passwordInput.value
    );

    await db.collection("users").doc(userCred.user.uid).set({
      name: nameInput.value,
      email: emailInput.value,
      createdAt: new Date()
    });

    msg.innerText = "Signup successful! You are now logged in";
    // Redirect after a short delay so user can see message
    setTimeout(() => {
      location.href = "login.html";
    }, 2000);

  } catch (err) {
    console.error(err);

    // Extract the middle part of the error message
    const cleanMessage = err.message.replace(/^Firebase: /, '').split('(')[0].trim();

    msg.innerText = cleanMessage || "An error occurred. Please try again.";
  }
});





// Password strength feedback and enable/disable signup button
passwordInput.addEventListener("input", () => {
  const pwd = passwordInput.value;
  const isStrong = pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[!@#$%^&*]/.test(pwd);

  signupBtn.disabled = !isStrong;

  if (!isStrong) {
    passwordHelp.style.color = "darkred";
    if (pwd.length < 8) {
      passwordHelp.innerText = "Password too short (min 8 characters)";
    } else if (!/[A-Z]/.test(pwd)) {
      passwordHelp.innerText = "Add at least one uppercase letter";
    } else if (!/[a-z]/.test(pwd)) {
      passwordHelp.innerText = "Add at least one lowercase letter";
    } else if (!/[0-9]/.test(pwd)) {
      passwordHelp.innerText = "Add at least one number";
    } else if (!/[!@#$%^&*]/.test(pwd)) {
      passwordHelp.innerText = "Add at least one special character (!@#$%^&*)";
    }
  } else {
    passwordHelp.innerText = "Password looks good!";
    passwordHelp.style.color = "green";
  }
});