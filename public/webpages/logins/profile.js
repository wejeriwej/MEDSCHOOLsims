document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const logoutBtn = document.getElementById("logoutBtn");
  const upgradeBtn = document.getElementById("upgradeBtn");
  const upgradeMsgEl = document.getElementById("upgradeMessage");
  const manageBtn = document.getElementById("manageSubBtn");

  // Show user info
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "login.html";
      return;
    }

    emailEl.innerText = user.email;

    try {
      const docSnap = await db.collection("users").doc(user.uid).get();
      const userData = docSnap.exists ? docSnap.data() : {};

      nameEl.innerText = docSnap.exists ? (docSnap.data().name || "Unknown User") : "Unknown User";

      // Show the message if the user is upgraded or needs upgrade
      if (userData.subscriptionStatus === "active") {
        upgradeMsgEl.innerText = "You are in the upgraded version!";
        upgradeMsgEl.style.color = "green";
        upgradeMsgEl.style.fontWeight = "bold";
        upgradeBtn.style.display = "none";
        manageBtn.style.display = "block";
      } else {
        upgradeMsgEl.innerText = "You must be upgraded to access all the cases.";
        upgradeMsgEl.style.color = "red";
        upgradeMsgEl.style.fontWeight = "bold";
        upgradeBtn.style.display = "block";
        manageBtn.style.display = "none";
      }

      upgradeMsgEl.style.display = "block"; // Ensure the message is visible

      // Manage Subscription Button
      manageBtn.addEventListener("click", async () => {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch("https://oscesimstrial1.onrender.com/api/create-portal-session", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();
        window.location.href = data.url;
      });

    } catch (err) {
      console.error("Error fetching user data:", err);
      nameEl.innerText = "Unknown User";
    }
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    auth.signOut();
    location.href = "login.html";
  });

  // Upgrade
  upgradeBtn.addEventListener("click", async () => {
    try {
      const token = await auth.currentUser.getIdToken();

      const res = await fetch("https://oscesimstrial1.onrender.com/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      console.log("Stripe response:", data);

      if (!data.url) {
        alert("Stripe failed: " + JSON.stringify(data));
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      console.error("Upgrade failed:", err);
      alert("Upgrade failed. Check console for details.");
    }
  });
});
