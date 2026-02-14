document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const logoutBtn = document.getElementById("logoutBtn");
  const upgradeBtn = document.getElementById("upgradeBtn");

  // Show user info
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      location.href = "login.html";
      return;
    }

    emailEl.innerText = user.email;

    try {
      const docSnap = await db.collection("users").doc(user.uid).get();
      nameEl.innerText = docSnap.exists ? (docSnap.data().name || "Unknown User") : "Unknown User";
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
    window.location.href = data.url;
  } catch (err) {
    console.error("Upgrade failed:", err);
    alert("Upgrade failed. Check console for details.");
  }
});
});




/*const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const logoutBtn = document.getElementById("logoutBtn");
const upgrade = document.getElementById("upgrade");


// Show profile info
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const docRef = db.collection("users").doc(user.uid);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    nameEl.innerText = docSnap.data().name;
  } else {
    nameEl.innerText = "Unknown User";
  }

  emailEl.innerText = user.email;
});

// Logout button
logoutBtn.addEventListener("click", () => {
  auth.signOut();
  location.href = "login.html";
});






//FOR THE UPGRADE FUNCTION IN ORDER TO GET PAYMENTS USING STRIPE!!

async function upgrade() {
  const token = await auth.currentUser.getIdToken();

  const res = await fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  window.location.href = data.url;
}
*/






/*
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const logoutBtn = document.getElementById("logoutBtn");
const upgradeBtn = document.querySelector("button[onclick='upgrade()']"); // Select the upgrade button

// Show profile info
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const docRef = db.collection("users").doc(user.uid);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    const userData = docSnap.data();
    nameEl.innerText = userData.name || "Unknown User";
    emailEl.innerText = user.email;

    // 🔹 Show upgrade button only if user is NOT pro
    if (userData.plan !== "pro") {
      upgradeBtn.style.display = "block";
    } else {
      upgradeBtn.style.display = "none"; // hide button for Pro users
    }
  } else {
    nameEl.innerText = "Unknown User";
    emailEl.innerText = user.email;
    upgradeBtn.style.display = "block"; // default show if no data
  }
});

// Logout button
logoutBtn.addEventListener("click", () => {
  auth.signOut();
  location.href = "login.html";
});

// FOR THE UPGRADE FUNCTION IN ORDER TO GET PAYMENTS USING STRIPE!!
import { auth } from "./firebase.js";

async function upgrade() {
  const token = await auth.currentUser.getIdToken();

  const res = await fetch("http://localhost:3000/create-checkout-session", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  window.location.href = data.url;
}
*/

