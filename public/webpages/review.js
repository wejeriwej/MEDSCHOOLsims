

auth.onAuthStateChanged(user => {
  if (user) {
    loadDashboard();
  } else {
    console.error("❌ Not logged in");
  }
});



















function displayDashboard(data) {
  const container = document.getElementById("dashboard");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No previous feedback found.</p>";
    return;
  }

  container.scrollIntoView({ behavior: "smooth" });

  data.forEach(item => {
    console.log("Processing item:", item);
    console.log("Item ID:", item.id);
    console.log("Item keys:", Object.keys(item));
    
    // Ensure we have the document ID
    const feedbackId = item.id;
    if (!feedbackId) {
      console.error("No ID found for item:", item);
      return;
    }
    
    const evaluation = item.evaluation;

    const scoreMatch = evaluation.match(/Score:\s*(\d+)/i);
    const overallMatch = evaluation.match(/Overall:\s*([\s\S]*?)(?=\n\s*Strengths:|$)/i);
    const strengthsMatch = evaluation.match(/Strengths:\s*([\s\S]*?)(?=\n\s*Improvements:|$)/i);
    const improvementsMatch = evaluation.match(/Improvements:\s*([\s\S]*)/i);

    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    const overall = overallMatch ? overallMatch[1].trim() : "";
    const strengths = strengthsMatch ? strengthsMatch[1].trim().split(/\n|-/).filter(s => s.trim()) : [];

 const formatBullet = (text) => {
  return text
    .replace(/\*\*(.*?):\*\*/g, "<strong>$1:</strong>")
    .replace(/\*\*/g, "")
    .replace(/^:\s*/, "") // Remove leading colon and space
    .replace(/^\s+/, "") // Remove leading spaces
    .trim();
};

const improvements = improvementsMatch
  ? improvementsMatch[1]
      .trim()
      .split(/\n|-|\*\s*|\d+\.\s*/)
      .map(s => formatBullet(s))
      .filter(s => s && s.trim().length > 0)
  : [];





// 🔹 Helper to safely format Firestore timestamps
function formatFirestoreDate(ts) {
  if (!ts) return "Unknown";
  const seconds = ts.seconds ?? ts._seconds ?? null;
  if (seconds) return new Date(seconds * 1000).toLocaleString();
  const d = new Date(ts);
  return isNaN(d) ? "Unknown" : d.toLocaleString();
}

// 🔹 Use readable timestamp if available as fallback
let date = formatFirestoreDate(item.createdAt ?? item.createdAtReadable);

console.log("CreatedAt:", item.createdAt, "Readable:", date);






// 🔹 Badge & progress color based on score
let badge = "";
let progressColor = "#0077cc";

if (score >= 8) {
  badge = `<span style="padding:4px 8px;border-radius:6px;background:#22c55e;color:white;font-weight:bold;">Excellent</span>`;
  progressColor = "#22c55e";
} else if (score >= 5) {
  badge = `<span style="padding:4px 8px;border-radius:6px;background:#f59e0b;color:black;font-weight:bold;">Needs Improvement</span>`;
  progressColor = "#f59e0b";
} else {
  badge = `<span style="padding:4px 8px;border-radius:6px;background:#ef4444;color:white;font-weight:bold;">Poor</span>`;
  progressColor = "#ef4444";
}
    const progressWidth = score !== null ? (score / 10) * 100 : 0;

    const highlightKeywords = text => {
      return text
        .replace(/\b(critical|must improve|highly recommended)\b/gi,
          '<strong style="color:#ef4444;">$1</strong>')
        .replace(/\b(excellent|outstanding|good|well done|strength|positive)\b/gi,
          '<strong style="color:#22c55e;">$1</strong>');
    };

    const div = document.createElement("div");
    div.className = "feedback-item";

    div.style = `
      padding: 28px;
      background: white;
      transition: all 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;
      cursor: pointer;
      position: relative;
    `;

    div.onmouseover = () => {
      div.style.transform = "translateY(-4px)";
      div.style.boxShadow = "0 8px 22px rgba(0,0,0,0.1)";
    };

    div.onmouseout = () => {
      div.style.transform = "translateY(0)";
      div.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)";
    };

    const contentId = "content-" + Math.random();



    div.innerHTML = `
    <!-- Small corner delete button -->
    <button class="small-delete-btn"
      data-id="${feedbackId}"
      style="
        position: absolute;
        top: -0px;
        right: 18px;
        border: none;
        background: transparent;
        color: #6b7280;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.2s ease;
        z-index: 10;
        padding: 4px;
        border-radius: 4px;
      "
      title="Delete feedback">
      🗑️
    </button>
    <!-- Tooltip -->
    <div class="delete-tooltip" style="
      position: absolute;
      top: 40px;
      right: 12px;
      background: #1f2937;
      color: white;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      z-index: 11;
      pointer-events: none;
    ">
      Delete feedback
    </div>
    
    <div style="
  margin-bottom:20px;
  padding-bottom:16px;
  border-bottom:2px solid #f1f5f9;
  border-radius: 0 0 8px 8px;
">
  <h1 style="
    margin:0;
    font-size:1.4em;
    font-weight:700;
    color:#1e293b;
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;
    letter-spacing:0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  ">
    <span style="font-size: 1.2em;">🩺</span>
    Motivation for Medicine
  </h1>
</div>

<div style="display:flex;justify-content:space-between;align-items:center;gap:16px;">
  <div>
    <h2 style="
      margin:0;
      color:#1e293b;
      font-size:1.6em;
      font-weight:600;
      font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;
    ">
      Score: <span style="color:#3b82f6;font-weight:700;">${score ?? "N/A"}/10</span>
    </h2>
  </div>
  ${badge}
</div>

<div style="text-align:right; margin-top:5px;">
  <span id="arrow-${contentId}" style="
    font-size:1.2em;
    color:#888;
    transition: transform 0.2s ease;
    display:inline-block;
  ">
    ▶
  </span>
</div>

<p style="
  font-size:0.75em;
  color:#888;
  margin-top:4px;
  font-style: italic;
  display:flex;
  justify-content:space-between;
  align-items:center;
">
  <span>Submitted on: ${date}</span>
  <span class="expand-hint" style="font-size:0.7em; color:#aaa;">Click to expand</span>
</p>



      <div style="background:#f1f5f9;border-radius:8px;width:100%;height:8px;margin:16px 0;overflow:hidden;">
        <div style="
          width:${progressWidth}%;
          background:${progressColor};
          height:100%;
          border-radius:8px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        "></div>
      </div>

<div id="${contentId}" class="hidden" style="margin-top:35px;">

        <div style="margin:40px 0;">
          <div style="background:#f8fafc; padding:24px; border-radius:12px; border-left:4px solid #3b82f6; margin-bottom:32px;">
            <h3 style="margin:0 0 16px 0; color:#1e293b; font-size:1.3em; font-weight:700; display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.1em;">🌟</span> Overall Assessment
            </h3>
            <div style="line-height:1.7; font-size:1.05em;">
              ${highlightKeywords(overall).replace(/\n/g, "<br>")}
            </div>
          </div>
        </div>

        <div style="margin-bottom:40px;">
          <div style="background:#f0fdf4; padding:24px; border-radius:12px; border-left:4px solid #10b981; margin-bottom:32px;">
            <h3 style="margin:0 0 16px 0; color:#1e293b; font-size:1.3em; font-weight:700; display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.1em;">✅</span> Strengths
            </h3>
            <ul style="line-height:1.7; margin:0; padding-left:0; list-style:none;">
              ${strengths.map(s => `<li style="margin-bottom:16px; padding-left:40px; position:relative; color:#059669; font-size:1.05em;">
                <span style="position:absolute; left:16px; top:2px; font-weight:bold;">•</span> ${highlightKeywords(s)}
              </li>`).join("")}
            </ul>
          </div>
        </div>

        <div>
          <div style="background:#fef2f2; padding:24px; border-radius:12px; border-left:4px solid #f59e0b; margin-bottom:32px;">
            <h3 style="margin:0 0 16px 0; color:#1e293b; font-size:1.3em; font-weight:700; display:flex; align-items:center; gap:8px;">
              <span style="font-size:1.1em;">🎯</span> Areas for Improvement
            </h3>
            <ul style="line-height:1.7; margin:0; padding-left:0; list-style:none;">
              ${improvements.map(s => `<li style="margin-bottom:16px; padding-left:40px; position:relative; color:#dc2626; font-size:1.05em;">
                <span style="position:absolute; left:16px; top:2px; font-weight:bold;">•</span> ${highlightKeywords(s)}
              </li>`).join("")}
            </ul>
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-top: 25px;">
  <button class="copy-btn"
    style="
      padding:12px 20px;
      border:none;
      border-radius:10px;
      background:#3b82f6;
      color:white;
      cursor:pointer;
      font-weight:600;
      font-size:0.95em;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      min-width:140px;
      height:44px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    ">
    <span class="btn-icon">📋</span>
    <span class="btn-text">Copy Feedback</span>
  </button>
  
  <button class="delete-btn"
    data-id="${feedbackId}"
    style="
      padding:12px 20px;
      border:none;
      border-radius:10px;
      background:#ef4444;
      color:white;
      cursor:pointer;
      font-weight:600;
      font-size:0.95em;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      min-width:140px;
      height:44px;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
    ">
    <span class="btn-icon">🗑️</span>
    <span class="btn-text">Delete</span>
  </button>
</div>

      </div>
    `;




// Hide hint initially
const hint = div.querySelector(".expand-hint");

    // Toggle whole card
    div.onclick = (e) => {
  if (e.target.tagName === "BUTTON") return;

  const content = document.getElementById(contentId);
  const arrow = document.getElementById(`arrow-${contentId}`);
  const smallDeleteBtn = div.querySelector(".small-delete-btn");

  const isHidden = content.classList.toggle("hidden");
  
  // Add/remove expanded class for grid layout
  if (isHidden) {
    div.classList.remove("expanded");
    // Show small delete button when collapsed
    if (smallDeleteBtn) smallDeleteBtn.style.display = "flex";
  } else {
    div.classList.add("expanded");
    // Hide small delete button when expanded
    if (smallDeleteBtn) smallDeleteBtn.style.display = "none";
  }

  // Rotate arrow instead of changing layout
  arrow.style.transform = isHidden ? "rotate(0deg)" : "rotate(90deg)";
arrow.style.transition = "transform 0.25s ease";
arrow.style.color = "#999";
  if (hint) hint.style.display = isHidden ? "inline" : "none";

};






    container.appendChild(div);

    // FIXED COPY BUTTON
    const btn = div.querySelector(".copy-btn");
const btnText = btn.querySelector(".btn-text");
const btnIcon = btn.querySelector(".btn-icon");

btn.addEventListener("click", async (e) => {
  e.stopPropagation();

  try {
    await navigator.clipboard.writeText(evaluation);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = evaluation;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  // Change content WITHOUT resizing
  btnText.innerText = "Copied!";
  btnIcon.innerText = "✅";
  btn.style.background = "#22c55e";

  setTimeout(() => {
    btnText.innerText = "Copy Feedback";
    btnIcon.innerText = "📋";
    btn.style.background = "#0077cc";
  }, 1500);
});

// Hover effect
btn.onmouseover = () => btn.style.background = "#2563eb";
btn.onmouseout = () => btn.style.background = "#3b82f6";

    // Delete button functionality
    const deleteBtn = div.querySelector(".delete-btn");
    const deleteBtnText = deleteBtn.querySelector(".btn-text");
    const deleteBtnIcon = deleteBtn.querySelector(".btn-icon");

    deleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      
      const feedbackId = deleteBtn.getAttribute("data-id");
      console.log("Attempting to delete feedback with ID:", feedbackId);
      
      if (!feedbackId) {
        alert("Unable to delete: Missing feedback ID");
        return;
      }

      // Confirm deletion
      if (!confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
        return;
      }

      try {
        const token = await auth.currentUser.getIdToken();
        
        // Use the same base URL as other API calls
        const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
          ? "http://localhost:3000" 
          : "https://medschoolsims-1.onrender.com";
          
        const response = await fetch(`${baseUrl}/api/history/${feedbackId}`, {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        console.log("Delete response status:", response.status);
        console.log("Delete response ok:", response.ok);

        if (response.ok) {
          // Update button to show success
          deleteBtnText.innerText = "Deleted";
          deleteBtnIcon.innerText = "✅";
          deleteBtn.style.background = "#22c55e";
          
          // Remove the card after a short delay
          setTimeout(() => {
            div.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            div.style.opacity = "0";
            div.style.transform = "scale(0.95)";
            
            setTimeout(() => {
              div.remove();
              // Reload dashboard to refresh the list
              loadDashboard();
            }, 300);
          }, 1000);
        } else {
          const responseText = await response.text();
          console.error("Delete failed response:", responseText);
          alert(`Failed to delete: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete feedback. Please try again.");
      }
    });

    // Delete button hover effects
    deleteBtn.onmouseover = () => deleteBtn.style.background = "#dc2626";
    deleteBtn.onmouseout = () => deleteBtn.style.background = "#ef4444";

    // Small delete button functionality
    const smallDeleteBtn = div.querySelector(".small-delete-btn");

    smallDeleteBtn.addEventListener("click", async (e) => {
      e.stopPropagation();
      
      const feedbackId = smallDeleteBtn.getAttribute("data-id");
      console.log("Attempting to delete feedback with ID (small btn):", feedbackId);
      
      if (!feedbackId) {
        alert("Unable to delete: Missing feedback ID");
        return;
      }

      // Confirm deletion
      if (!confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
        return;
      }

      try {
        const token = await auth.currentUser.getIdToken();
        
        // Use the same base URL as other API calls
        const baseUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
          ? "http://localhost:3000" 
          : "https://medschoolsims-1.onrender.com";
          
        const response = await fetch(`${baseUrl}/api/history/${feedbackId}`, {
          method: "DELETE",
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        console.log("Delete response status (small btn):", response.status);
        console.log("Delete response ok (small btn):", response.ok);

        if (response.ok) {
          // Update button to show success
          smallDeleteBtn.innerHTML = "✅";
          smallDeleteBtn.style.background = "#22c55e";
          
          // Remove card after a short delay
          setTimeout(() => {
            div.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            div.style.opacity = "0";
            div.style.transform = "scale(0.95)";
            
            setTimeout(() => {
              div.remove();
              // Reload dashboard to refresh list
              loadDashboard();
            }, 300);
          }, 1000);
        } else {
          const responseText = await response.text();
          console.error("Delete failed response (small btn):", responseText);
          alert(`Failed to delete: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error("Delete error (small btn):", error);
        alert("Failed to delete feedback. Please try again.");
      }
    });

    // Small delete button hover effects
    smallDeleteBtn.onmouseover = () => {
      smallDeleteBtn.style.color = "#ef4444";
      smallDeleteBtn.style.background = "#fee2e2";
      // Show tooltip
      const tooltip = smallDeleteBtn.parentElement.querySelector(".delete-tooltip");
      if (tooltip) {
        tooltip.style.opacity = "1";
        tooltip.style.visibility = "visible";
      }
    };
    smallDeleteBtn.onmouseout = () => {
      smallDeleteBtn.style.color = "#6b7280";
      smallDeleteBtn.style.background = "transparent";
      // Hide tooltip
      const tooltip = smallDeleteBtn.parentElement.querySelector(".delete-tooltip");
      if (tooltip) {
        tooltip.style.opacity = "0";
        tooltip.style.visibility = "hidden";
      }
    };
  });
}
















// Show loading indicator
function showLoading() {
  const container = document.getElementById("dashboard");
  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading your feedback...</div>
      <div class="loading-subtext">Please wait while we retrieve your cases</div>
    </div>
  `;
}

async function loadDashboard() {
  if (!auth.currentUser) {
    console.error("❌ User not logged in");
    return;
  }

  // Show loading indicator immediately
  showLoading();

  const token = await auth.currentUser.getIdToken();

  try {
    const res = await fetch("https://medschoolsims-1.onrender.com/api/history", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    console.log("📦 Dashboard data:", data);

    if (!Array.isArray(data)) {
      console.error("❌ Not an array:", data);
      const container = document.getElementById("dashboard");
      container.innerHTML = "<p>No previous feedback found.</p>";
      return;
    }

    displayDashboard(data);
  } catch (error) {
    console.error("❌ Error loading dashboard:", error);
    const container = document.getElementById("dashboard");
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #6b7280;">
        <div style="font-size: 1.1em; margin-bottom: 8px;">Unable to load feedback</div>
        <div style="font-size: 0.9em; color: #9ca3af;">Please check your connection and try again</div>
      </div>
    `;
  }
}
