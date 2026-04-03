

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
    const evaluation = item.evaluation;

    const scoreMatch = evaluation.match(/Score[^0-9]*(\d+)/i);
    const overallMatch = evaluation.match(/Overall:\s*([\s\S]*?)\n(\*\*Strengths:\*\*|$)/i);
    const strengthsMatch = evaluation.match(/\*\*Strengths:\*\*\s*([\s\S]*?)\n(\*\*Improvements:\*\*|$)/i);
    const improvementsMatch = evaluation.match(/\*\*Improvements:\*\*\s*([\s\S]*)/i);

    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    const overall = overallMatch ? overallMatch[1].trim() : "";
    const strengths = strengthsMatch ? strengthsMatch[1].trim().split(/\n|-/).filter(s => s.trim()) : [];

 const formatBullet = (text) => {
  return text
    .replace(/\*\*(.*?):\*\*/g, "<strong>$1:</strong>")
    .replace(/\*\*/g, "")
    .trim();
};

const improvements = improvementsMatch
  ? improvementsMatch[1]
      .trim()
      .split(/\n|-/)
      .map(s => formatBullet(s))
      .filter(s => s)
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
      border: 1px solid #e5e5e5;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 25px;
      background: white;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      font-family: Arial, sans-serif;
      cursor: pointer;
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
    <div style="
  margin-bottom:18px;
  padding-bottom:10px;
  border-bottom:1px solid #e5e5e5;
">
  <h1 style="
    margin:0;
    font-size:1.35em;
    font-weight:700;
    color:#0f172a;
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;
    letter-spacing:0.3px;
  ">
    🩺 Motivation for Medicine
  </h1>
</div>

<div style="display:flex;justify-content:space-between;align-items:center;">
  <h2 style="
    margin-top:0;
    color:#222;
    font-size:1.8em;
    border-bottom:2px solid #0077cc;
    padding-bottom:5px;
    font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, sans-serif;
  ">
    Score: <span style="color:#0077cc;">${score ?? "N/A"}/10</span>
  </h2>
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



      <div style="background:#eee;border-radius:10px;width:100%;height:14px;margin:12px 0;">
        <div style="
          width:${progressWidth}%;
          background:${progressColor};
          height:100%;
          border-radius:10px;
          transition: width 0.6s ease;
        "></div>
      </div>

<div id="${contentId}" class="hidden" style="margin-top:35px;">

        <div style="margin:45px 0;">
          <h3 style="margin-bottom:10px; color:#555;">🌟 Overall Assessment</h3>
          <p style="line-height:1.65; margin-top:20px;">
            ${highlightKeywords(overall).replace(/\n/g, "<br>")}
          </p>
        </div>

        <div style="margin-bottom:45px;">
          <h3 style="margin-bottom:10px; color:#555;">✅ Strengths</h3>
          <ul style="line-height:1.65; margin-top:23px; padding-left:70px; color:#155724; font-weight:500;">
            ${strengths.map(s => `<li style="margin-bottom:14px;">${highlightKeywords(s)}</li>`).join("")}
          </ul>
        </div>

        <div>
          <h3 style="margin-bottom:10px; color:#555;">❌ Improvements</h3>
          <ul style="line-height:1.65; margin-top:23px; padding-left:70px; color:#721c24; font-weight:500;">
            ${improvements.map(s => `<li style="margin-bottom:14px;">${highlightKeywords(s)}</li>`).join("")}
          </ul>
        </div>

        <button class="copy-btn"
  style="
    margin-top:25px;
    padding:10px 16px;
    border:none;
    border-radius:8px;
    background:#0077cc;
    color:white;
    cursor:pointer;
    font-weight:600;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    min-width:160px;
    height:40px;
    transition: all 0.2s ease;
  ">
  <span class="btn-icon">📋</span>
  <span class="btn-text">Copy Feedback</span>
</button>

      </div>
    `;




// Hide hint initially
const hint = div.querySelector(".expand-hint");

    // Toggle whole card
    div.onclick = (e) => {
  if (e.target.tagName === "BUTTON") return;

  const content = document.getElementById(contentId);
  const arrow = document.getElementById(`arrow-${contentId}`);

  const isHidden = content.classList.toggle("hidden");

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
btn.onmouseover = () => btn.style.background = "#005fa3";
btn.onmouseout = () => btn.style.background = "#0077cc";
  });
}
















async function loadDashboard() {
  if (!auth.currentUser) {
    console.error("❌ User not logged in");
    return;
  }

  const token = await auth.currentUser.getIdToken();

  const res = await fetch("https://medschoolsims-1.onrender.com/api/history", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const data = await res.json();

  console.log("📦 Dashboard data:", data);

  if (!Array.isArray(data)) {
    console.error("❌ Not an array:", data);
    return;
  }

  displayDashboard(data);
}
