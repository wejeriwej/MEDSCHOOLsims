const questionArea = document.getElementById("questionArea");
const answerArea = document.getElementById("answerArea");
function loadQuestion(curr) {
  if (!questionArea) {
    console.error("❌ questionArea not found");
    return;
  }

  var question = Object.keys(allQuestions)[curr];

  questionArea.innerHTML = question;
}




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











/*  try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }*/


// mimic the SpeechRecognition API
let recognition = null;

async function initRecognition() {
  // Get a temporary Deepgram token from your backend
  const res = await fetch("http://localhost:3000/api/deepgram-token");
  const data = await res.json();
  const token = data.token;

  if (!token) {
    console.error("❌ No token received from backend!");
    return;
  }

  console.log("✅ Token received:", token);

  // Setup WebSocket to Deepgram
  const sampleRate = 48000;
  const socket = new WebSocket(
    `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=${sampleRate}&token=${token}`
  );

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(4096, 1, 1);
  source.connect(processor);
  processor.connect(audioContext.destination);

  processor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(floatTo16BitPCM(input));
    }
  };

  socket.onmessage = (msg) => {
    const msgData = JSON.parse(msg.data);
    if (msgData.channel?.alternatives?.[0]?.transcript) {
      const transcript = msgData.channel.alternatives[0].transcript;
      if (recognition.onresult) {
        recognition.onresult({
          results: [
            {
              0: { transcript },
              isFinal: msgData.is_final,
            },
          ],
          length: 1,
        });
      }
    }
  };

  socket.onopen = () => {
    console.log("✅ Deepgram connected");
    if (recognition.onstart) recognition.onstart();
  };

  socket.onclose = () => {
    if (recognition.onend) recognition.onend();
  };

  socket.onerror = (err) => console.error("❌ WebSocket error:", err);

  recognition = {
    start: () => {
      console.log("Recognition started");
      // Audio streaming automatically starts with getUserMedia
    },
    stop: () => {
      processor.disconnect();
      stream.getTracks().forEach((t) => t.stop());
      socket.close();
      if (recognition.onend) recognition.onend();
      console.log("Recognition stopped");
    },
    onstart: null,
    onend: null,
    onresult: null,
  };
}

// helper
function floatTo16BitPCM(float32Array) {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

// Initialize recognition on page load
window.addEventListener("load", () => {
  initRecognition();
});


console.log("Deepgram Key:", process.env.DEEPGRAM_API_KEY);

if (recognition) {
  recognition.start();
} else {
  console.error("Recognition not initialized yet");
}




  
  //THIS IS ACTIONED FOR THOSE THAT ARE LOGGED IN!!!!
document.addEventListener("DOMContentLoaded", () => {
  const authStatus = document.getElementById("authStatus");

  if (!authStatus) return; // page doesn't need it

  auth.onAuthStateChanged(user => {
    if (user) {
      authStatus.innerText = `Hello, ${user.email}`;
      console.log("✅ User ready:", user.uid);

    } else {
      authStatus.innerText = "Not logged in";
      console.log("❌ No user");
    }
  });
});
  
  
  var noteTextarea = $('#note-textarea');
  var instructions = $('#recording-instructions');
  var notesList = $('ul#notes');
  var whatforgottosay = $('#whatforgottosay');
   
  var noteContent = '';
  
  let messagebeforeacceptingmic = document.getElementById('messagebeforeacceptingmic');
  let initialpromptforpresssubmit = document.getElementById('initialpromptforpresssubmit');
  let emptyif = document.getElementById('emptyif');
  
  

// Fire-and-forget warmup request to render to prevent cold starts
fetch("https://oscesimstrial1.onrender.com/health", {
  method: "GET",
  mode: "no-cors"
}).catch(() => {});


/*------
THIS PART IS FOR THE 11LABS AUDIO AS IT NEEDS TO BE OUTSIDE ALL OF THE BRACKETS IN THE IF STATEMENTS!!
  --------*/

let audio = null; // global audio instance

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  document.addEventListener(
    "touchstart",
    () => {
      if (!audio) {
        audio = new Audio();
        audio.setAttribute("playsinline", "");
        audio.setAttribute("webkit-playsinline", "");

        audio.muted = true;
        audio.play().catch(() => {});
        audio.pause();
        audio.muted = false;

        console.log("🔓 Mobile audio unlocked");
      }
    },
    { once: true }
  );
}





  
  
  // Get all notes from previous sessions and display them.
  
  
  //var notes = getAllNotes();
  //renderNotes(notes);
  
  
  
  //For the replay video Button!!
  document.getElementById('replayButton').addEventListener('click', function() {
    replayVideo();
    document.getElementById('replayButton').style.display = 'none'; recognition.stop();      document.getElementById('stop-consultation-btn').style.display = 'none';  document.getElementById('home').style.display = 'none'; document.getElementById('executeButton').style.display = 'none'; document.getElementById('messagebeforeacceptingmic').style.display = 'none';
      
  });
  
  function replayVideo() {
    var videoElement = document.getElementById('myVideo'); actionTriggered = true;
    videoElement.pause(); // Pause the video
    videoElement.currentTime = 0; // Set the current time of the video to the beginning
    videoElement.play(); // Start playing the video
    document.getElementById('myVideo').onended = function(e) {
      recognition.start();      document.getElementById('stop-consultation-btn').style.display = 'unset';    document.getElementById('home').style.display = 'unset';
      document.getElementById('replayButton').style.display = 'unset';  document.getElementById('executeButton').style.display = 'unset';  document.getElementById('messagebeforeacceptingmic').style.display = 'unset';
    }}
  
  
  
  
  
  
  
  
  
  function startFunction() { 
    timeLeft = slider.value * 60;//this and the next one is to start the timer
    timer = setInterval(updateTimeLeft, 1000);
  
  
    document.getElementById('myVideo').style.display = 'unset';
    document.getElementById("mp4_src").src = "videos/openinghiya.mp4"; document.getElementById("myVideo").load();
    document.getElementById('tutorial').style.display = 'none'; document.querySelector('other-cases').style.display = 'none'; document.querySelector('special-footer').style.display = 'none'; document.getElementById('difficultycolor').style.display = 'none'; document.getElementById('backgroundofstartbtn').style.display = 'none';document.getElementById('executeButton').style.display = 'none';
  
    
  
    document.getElementById('myVideo').onended = function(e) {
      //readOutLoud("Go");
      messagebeforeacceptingmic.style.display = 'unset';
  
    //readOutLoud("Enable the microphone and then start speaking, and once you've asked your question double press the ENTER key");
    recognition.start();   
    document.getElementById('stop-consultation-btn').style.display = 'unset'; document.getElementById('executeButton').style.display = 'unset';
    document.getElementById('replayButton').style.display = 'unset';  document.getElementById('home').style.display = 'unset';
    
  
    
  
    }
    
    
    
  
    //document.getElementById('recording-instructions').style.visibility = 'visible';
    //document.getElementById('start-record-btn').style.visibility = 'visible';
    //document.getElementById('save-note-btn').style.visibility = 'visible';
    //document.getElementById('note-textarea').style.visibility = 'visible';
    document.getElementById('introstatement').style.display = 'none';
    document.getElementById('fullscreenvideobackground').style.display = 'none';
    document.body.style.backgroundColor = 'black';
    document.body.style.backgroundImage = 'none';
    document.getElementById('toptipmain').style.display = 'none';
  
    
    document.getElementById('logoduringconsultation').style.display = 'unset';
    document.getElementById('fakeVideo').style.display = 'none';
    document.getElementById('page-description').style.display = 'none';document.getElementById('casename').style.display = 'none';
  
    //document.getElementById('casename').style.visibility = 'hidden';document.getElementById('page-description').style.visibility = 'hidden';
  
  
    
    //document.getElementById('end-consultation-btn').style.visibility = 'visible';
    //document.getElementById('move-onto-questions-btn').style.visibility = 'visible';
    
  
    document.getElementById('countdown-value').style.display = 'unset';//these bottom 5 are for the countdown
    document.getElementById('countdown-updated').style.display = 'none';
    document.getElementById('slider-value').style.display = 'none';
    document.getElementById('slider').style.display = 'none';
    document.getElementById('pause-countdown').style.display = 'unset';
    
  
    
  
  } 
  /*
  function initialstopConsultation(){
    document.getElementById('move-onto-questions-btn').style.display = 'unset';//this button goes to the first question
    document.getElementById('end-consultation-btn').style.display = 'unset';
  
    recognition.stop();    document.getElementById('replayButton').style.display = 'none';   document.getElementById('stop-consultation-btn').style.display = 'none';  document.getElementById('home').style.display = 'none'; document.getElementById('executeButton').style.display = 'none';
    document.getElementById('pause-countdown').style.display = 'none';
    document.getElementById('countdown-value').style.display = 'none';
    silentmsg = true;
    messagebeforeacceptingmic.style.display = 'none';
  
  }*/
  
  let sessionId = localStorage.getItem("sessionId");

if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("sessionId", sessionId);
}


async function initialstopConsultation() {
//This part is just to go to the ext part of the 'examinations' + questions
  
  document.getElementById('move-onto-questions-btn').style.display = 'unset';
  document.getElementById('end-consultation-btn').style.display = 'unset';
  recognition.stop();
  document.getElementById('replayButton').style.display = 'none';
  document.getElementById('stop-consultation-btn').style.display = 'none';
  document.getElementById('home').style.display = 'none';
  document.getElementById('executeButton').style.display = 'none';
  document.getElementById('pause-countdown').style.display = 'none';
  document.getElementById('countdown-value').style.display = 'none';
  document.getElementById('inbetweenVideo').style.display = 'none';//ssssssssss
  silentmsg = true;
  messagebeforeacceptingmic.style.display = 'none';
//

  try {
    const token = await auth.currentUser.getIdToken(); // ✅ ADD THIS

    const response = await fetch("https://medschoolsims-1.onrender.com/api/TUTOR2ndcase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token // ✅ ADD THIS
      },
      body: JSON.stringify({
        sessionId: sessionId,
        endSession: true
      })
    });

    const data = await response.json();

    console.log("📊 Evaluation:", data.evaluation);

    document.getElementById("evaluationBox").innerText = data.evaluation;

  } catch (err) {
    console.error("❌ Error ending session:", err);
  }

  console.log("🛑 Ending session with ID:", sessionId);
}










  
  //this one is to go straight to the 'review section'
  function endConsultation(){
    document.getElementById('review-section').style.display = 'unset';
    document.getElementById('taking-history-section').style.display = 'none';
    document.getElementById('taking-history-section-part2').style.display = 'none';
    document.getElementById('move-onto-questions-btn').style.display = 'none';
  
    document.getElementById('myVideo').pause();
    recognition.stop();    document.getElementById('replayButton').style.display = 'none';   document.getElementById('stop-consultation-btn').style.display = 'none'; document.getElementById('executeButton').style.display = 'none';
    recognition1.stop(); recognition1.stop(); recognition_differentials.stop(); recognition_investigations.stop(); recognition_riskfactors.stop(); recognition_treatments.stop();
  
    document.getElementById('examinations').style.display = 'none';
    document.getElementById('summary').style.display = 'none';
    document.getElementById('differentials').style.display = 'none';
    document.getElementById('investigations').style.display = 'none';
    document.getElementById('riskfactors').style.display = 'none';
    document.getElementById('treatments').style.display = 'none';
  
  
    document.getElementById('fullscreenvideobackground').style.display = 'unset';
    document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    document.getElementById('logoduringconsultation').style.display = 'none';
    document.getElementById('myVideo').style.display = 'none';
  
  //FOR THE YELLOW WARNING FADE IN AND OUT:
  const message = document.getElementById('audio-warning');
  message.style.display = 'block';

  // Trigger fade-in (1 second)
  setTimeout(() => {
    message.style.opacity = 1;
  }, 10); // small timeout to ensure CSS is applied

  // After 1s fade-in + 3s visible = 4s, start fade-out (2 seconds)
  setTimeout(() => {
    message.style.transition = 'opacity 2s ease'; // change fade-out duration
    message.style.opacity = 0;
  }, 6000);

  // After total duration (1+3+2=6s), hide the element
  setTimeout(() => {
    message.style.display = 'none';
  }, 10000);
  









  /*------
  THIS NEXT PART IS JUST TO MAKE THE ENDCONSULTATION BUTTON STILL SUBMIT THE ANSWER
  --------*/
  
    //examinations - save the response if press the end consultation button
      recognition_examinations.stop();    
          setTimeout(function() {
          var recordinginstructionsforexaminations = $('#recording-instructions-for-examinations');
          recognition_examinations.onspeechend = function() {
          recordinginstructionsforexaminations.text(noteexaminations);//IMPORTANT DO NOT DELETE!!!!
      }
      saveNote(new Date().toLocaleString(), noteexaminations);
      var examinationsfinal = $('#examinationsfinal');
      examinationsfinal.text(noteexaminations);
    }, 2000);
    
    
    //Summary - save the response if press the end consultation button
      recognition1.stop();    
          setTimeout(function() {
          var recordinginstructionsforsummary = $('#recording-instructions-for-summary');
          recognition1.onspeechend = function() {
          recordinginstructionsforsummary.text(noteSummary);//IMPORTANT DO NOT DELETE!!!!
     }
      saveNote(new Date().toLocaleString(), noteSummary);
      var summaryfinal = $('#summaryfinal');
      summaryfinal.text(noteSummary.toLowerCase());
      summaryreview = noteSummary.toLowerCase();
  
  /*
      var summaryage =  $('#summaryage'); var summaryage1 = $('#summaryage1');
          if (summaryreview.includes("3")||summaryreview.includes("thirty")){
          summaryage.css('background-color', 'rgb(249, 221, 221)').css('color', 'rgb(249, 221, 221)'); 
          summaryage1.css('color', 'rgb(0, 0, 0)'); }  
  
      var summarygender =  $('#summarygender'); var summarygender1 = $('#summarygender1');
          if (summaryreview.includes("male")||summaryreview.includes("man")||summaryreview.includes("bloke")){
          summarygender.text(""); summarygender1.text("● sGender");
          summarygender1.css('color', 'rgb(0, 0, 0)');
    }*/
    }, 2000);
     
    
    //Differentials - save the response if press the end consultation button
      recognition_differentials.stop();   
            setTimeout(function() {
            var recordinginstructionsfordifferentials = $('#recording-instructions-for-differentials');
            recognition_differentials.onspeechend = function() {
            recordinginstructionsfordifferentials.text(noteDifferentials);//IMPORTANT DO NOT DELETE!!!!
      }
        saveNote(new Date().toLocaleString(), noteDifferentials);
        var differentialsfinal = $('#differentialsfinal');
        differentialsfinal.text(noteDifferentials);
    }, 2000);
  
  
    //Investigations - save the response if press the end consultation button
      recognition_investigations.stop();    
          setTimeout(function() {
          var recordinginstructionsforinvestigations = $('#recording-instructions-for-investigations');
          recognition_investigations.onspeechend = function() {
          recordinginstructionsforinvestigations.text(noteinvestigations);//IMPORTANT DO NOT DELETE!!!!
      }
        saveNote(new Date().toLocaleString(), noteinvestigations);
        var investigationsfinal = $('#investigationsfinal');
        investigationsfinal.text(noteinvestigations);
    }, 2000);
    
  
    //riskfactors - save the response if press the end consultation button
      recognition_riskfactors.stop();    
          setTimeout(function() {
          var recordinginstructionsforriskfactors = $('#recording-instructions-for-riskfactors');
          recognition_riskfactors.onspeechend = function() {
          recordinginstructionsforriskfactors.text(noteriskfactors);//IMPORTANT DO NOT DELETE!!!!
      }
        saveNote(new Date().toLocaleString(), noteriskfactors);          
        var riskfactorsfinal = $('#riskfactorsfinal');
        riskfactorsfinal.text(noteriskfactors);
    }, 2000);
  
  
    //Treatments - save the response if press the end consultation button
      recognition_treatments.stop();    
          setTimeout(function() {
          var recordinginstructionsfortreatments = $('#recording-instructions-for-treatments');
          recognition_treatments.onspeechend = function() {
          recordinginstructionsfortreatments.text(notetreatments);//IMPORTANT DO NOT DELETE!!!!
      }
        saveNote(new Date().toLocaleString(), notetreatments);
        var treatmentsfinal = $('#treatmentsfinal');
        treatmentsfinal.text(notetreatments);
    }, 2000);
    
  
  
  
  
  
  
  }//end of the 'endConsultation' section.
  
  
  //this one moves it to the first question (i.e.examination)
  function movetoQuestions(){
    document.getElementById('taking-history-section').style.display = 'none';
    document.getElementById('taking-history-section-part2').style.display = 'none';
    document.getElementById('examinations').style.display = 'unset';
    document.getElementById('end-consultation-btn').style.display = 'none';
  
  
    
      document.getElementById('myVideo').style.display = 'unset'; document.getElementById("mp4_src").src = "videos/examinations.mp4"; document.getElementById("myVideo").load();


    document.getElementById('myVideo').onended = function(e) {
      //messagebeforeacceptingmic.style.display = 'unset'; micisworking.style.display = 'unset';
    recognition_examinations.start();     document.getElementById('messagebeforeacceptingmic_examinations').style.display = 'unset';
    document.getElementById('save-note-btn-for-examinations').style.display = 'unset';    
  
    }
  }
  
  
  
  
  
  
  
  
  
  function movetoQuestions_examinations(){
    document.getElementById('examinations').style.display = 'none';
    document.getElementById('summary').style.display = 'unset';
  
    recognition_examinations.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/summary.mp4"; document.getElementById("myVideo").load();
    document.getElementById('myVideo').onended = function(e) {
    recognition1.start();     // document.getElementById('stop-consultation-btn').style.display = 'unset';
    document.getElementById('save-note-btn-for-summary').style.display = 'unset';
    }
  }
  
  
  function movetoQuestions_summary(){
    document.getElementById('summary').style.display = 'none';
    document.getElementById('differentials').style.display = 'unset';
  
    recognition1.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/differential.mp4"; document.getElementById("myVideo").load();
    document.getElementById('myVideo').onended = function(e) {
    recognition_differentials.start();     // document.getElementById('stop-consultation-btn').style.display = 'unset';
    document.getElementById('save-note-btn-for-differentials').style.display = 'unset';
    }
  }
  
  function movetoQuestions_differentials(){
    document.getElementById('differentials').style.display = 'none';
    document.getElementById('investigations').style.display = 'unset';
  
    recognition_differentials.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/investigations.mp4"; document.getElementById("myVideo").load();
    document.getElementById('myVideo').onended = function(e) {
    recognition_investigations.start();     // document.getElementById('stop-consultation-btn').style.display = 'unset';
    document.getElementById('save-note-btn-for-investigations').style.display = 'unset';
    }
  }
  
  function movetoQuestions_investigations(){
    document.getElementById('investigations').style.display = 'none';
    document.getElementById('riskfactors').style.display = 'unset';
  
    recognition_investigations.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/riskfactors.mp4"; document.getElementById("myVideo").load();
    document.getElementById('myVideo').onended = function(e) {//!!
    recognition_riskfactors.start();     // document.getElementById('stop-consultation-btn').style.display = 'unset';
    document.getElementById('save-note-btn-for-riskfactors').style.display = 'unset';
    }
  }
  
  function movetoQuestions_riskfactors(){
    document.getElementById('riskfactors').style.display = 'none';
    document.getElementById('treatments').style.display = 'unset';
  
    recognition_riskfactors.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/management.mp4"; document.getElementById("myVideo").load();
    document.getElementById('myVideo').onended = function(e) {
    recognition_treatments.start();     // document.getElementById('stop-consultation-btn').style.display = 'unset';
    document.getElementById('save-note-btn-for-treatments').style.display = 'unset';
    }
  }
  
  function movetoQuestions_treatments(){
    document.getElementById('treatments').style.display = 'none';
    //document.getElementById('').style.display = 'unset';
  
    recognition_treatments.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    //document.getElementById("mp4_src").src = "WIN_20230328_13_59_37_Pro.mp4"; document.getElementById("myVideo").load();
    //document.getElementById('myVideo').onended = function(e) {
    //recognition_.start();     // document.getElementById('stop-consultation-btn').style.display = 'unset';
    //document.getElementById('save-note-btn-for-').style.display = 'unset';
    }
  //}
  
  
  
  
  window.addEventListener("load", function() {
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 100); // 100 ms delay
  });
  
  
  
  const slider = document.getElementById("slider");
  const sliderValue = document.getElementById("slider-value");
  const countdownupdated = document.getElementById("countdown-updated");
  
  const countdownValue = document.getElementById("countdown-value");
  //const startBtn = document.getElementById("start");
  const pauseBtn = document.getElementById("pause-countdown");
  
  let timeLeft, timer;
  
  function updateTimeLeft() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    countdownValue.innerHTML = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    timeLeft--;
    if (timeLeft === 59) {
      countdownValue.style.color = "orange";
    }
    if (timeLeft === 9) {
      countdownValue.style.color = "red";
    }
    if (timeLeft === -1) {
      clearInterval(timer);
      countdownValue.innerHTML = "0:00";
      setTimeout(() => {
        countdownValue.innerHTML = "Time's up!";
        //readOutLoud("Your time is up!")
      }, 2000);
    }
  }
  slider.addEventListener("input", function() {
    sliderValue.innerHTML = `${this.value} min`;
    countdownupdated.innerHTML = `${this.value}:00`;
  });
  
  //startBtn.addEventListener("click", function() {
  //  timeLeft = slider.value * 60;
  //  timer = setInterval(updateTimeLeft, 1000);
  //});
  
  
  let silentmsg = false;
  
  
  pauseBtn.addEventListener("click", function() {
    if (pauseBtn.innerHTML === "") {
      clearInterval(timer);
      pauseBtn.innerHTML = "1"; pauseBtn.style.fontWeight = "bold"; pauseBtn.style.height = '85px'; pauseBtn.style.padding = '300px 280px'; pauseBtn.style.color = 'transparent';
      pauseBtn.style.top = '50%'; pauseBtn.style.left = '50%'; pauseBtn.style.transform = 'translate(-50%, -50%)';
      pauseBtn.style.backgroundImage = "url('../../art/play-button-black-and-white.png')";
  
      myVideo.pause(); recognition.stop();    document.getElementById('replayButton').style.display = 'none';   document.getElementById('stop-consultation-btn').style.display = 'none';   document.getElementById('home').style.display = 'none'; document.getElementById('executeButton').style.display = 'none'; initialpromptforpresssubmit.style.display = 'none';
      pauseBtn.style.display = "unset"; //actionTriggered = true;
      silentmsg = true; document.getElementById('emptyif').style.display = 'none';
  
    } else {
      timer = setInterval(updateTimeLeft, 1000);
      pauseBtn.innerHTML = ""; pauseBtn.style.fontWeight = "normal"; pauseBtn.style.fontSize = "15px"; pauseBtn.style.height = '35px'; pauseBtn.style.padding = '10px 17px'; 
      recognition.start();  document.getElementById('stop-consultation-btn').style.display = 'unset'; document.getElementById('executeButton').style.display = 'unset'; document.getElementById('replayButton').style.display = 'unset';document.getElementById('home').style.display = 'unset';
      pauseBtn.style.backgroundImage = "url('../../art/pause_button_black_and_white-removebg-preview.png')";  document.getElementById('silencemessage').style.display = 'none';
  
      pauseBtn.style.top = ''; pauseBtn.style.left = ''; pauseBtn.style.transform = ''; // Reset the position property to its default value
      pauseBtn.style.display = "unset"; //actionTriggered = true;
      silentmsg = false;
      document.getElementById('messagebeforeacceptingmic').style.display = 'unset';
  
    }
  });
  
  
  
  
  
  
  
  function homeButton() {
    document.getElementById('taking-history-section').style.display = 'unset';
    document.getElementById('taking-history-section-part2').style.display = 'unset'; actionTriggered = true;
    recognition.stop();      document.getElementById('replayButton').style.display = 'none';   
    document.getElementById('stop-consultation-btn').style.display = 'none'; 
    document.getElementById('executeButton').style.display = 'none';
    document.getElementById('messagebeforeacceptingmic').style.display = 'none';
    document.getElementById('start-consultation-btn').style.display = 'unset';
    document.getElementById('tutorial').style.display = 'unset';
    
    document.getElementById('fullscreenvideobackground').style.display = 'unset';
    document.body.style.backgroundColor = 'rgb(255, 255, 255)';//BACKGROUND OF REVIEW SECTION!!!!!!
    document.getElementById('logoduringconsultation').style.display = 'none';
    document.getElementById('myVideo').style.display = 'none';
  
    document.getElementById('home').style.display = 'none';
    document.getElementById('pause-countdown').style.display = 'none';
    document.getElementById('countdown-value').style.display = 'none';
    document.getElementById('countdown-updated').style.display = 'unset';
    document.getElementById('slider-value').style.display = 'unset';
    document.getElementById('slider').style.display = 'unset';
    document.getElementById('initialpromptforpresssubmit').style.display = 'none';
  
  
    document.getElementById('fakeVideo').style.display = 'unset';
    document.getElementById('introstatement').style.display = 'unset';
    document.getElementById('page-description').style.display = 'unset';document.getElementById('casename').style.display = 'unset';
    document.getElementById('start-consultation-btn').style.display = 'unset';
    document.getElementById('backgroundofstartbtn').style.display = 'unset';
    document.getElementById('difficultycolor').style.visibility = 'hidden';
    document.getElementById('formatstartbtn').style.display = 'unset';
    document.getElementById('backgroundofstartbtn').style.backgroundImage = 'none';
  
  
  
  
  
    
  }
  
  
  
  
  
  
  
  
  /*
  pauseBtn.addEventListener("click", function() {
    if (pauseBtn.innerHTML === "Pause consultation") {
      clearInterval(timer);
      pauseBtn.innerHTML = "Unpause consultation"; pauseBtn.style.fontWeight = "bold"; pauseBtn.style.fontSize = "45px"; pauseBtn.style.height = '85px'; pauseBtn.style.padding = '1px 50px';
      myVideo.pause(); readOutLoud.pause();
      recognition.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
  
    } else {
      timer = setInterval(updateTimeLeft, 1000);
      pauseBtn.innerHTML = "Pause consultation"; pauseBtn.style.fontWeight = "normal"; pauseBtn.style.fontSize = "15px"; pauseBtn.style.height = '35px'; pauseBtn.style.padding = '1px 5px';
      recognition.start();      document.getElementById('stop-consultation-btn').style.display = 'unset';
  
    }
  });
  */
  
  
  
  
  
  
     /*-----------------------------
          The While loops
    ------------------------------
    var jobx = 0;
    var radiatex = 0;
    var ratepainx = 0;
    var makeitbetterx = 0;
    var makeitworsex = 0;
    var walkdistancex = 0;
    var ideasx = 0;
    var concernsx = 0;
    var expectationsx = 0;
    var smokingx = 0;
    var alcoholx = 0;
    var familyhistoryx = 0;
    
    var counter = 0;
  //  while (counter < 1) {
  
  */
  
  
  
  /*General information gathering*/
  painlocationx = false;
  onsetx = false;
  characterx = false;
  radiatex = false;
  associatedsymptomsx = false;
  timecoursex = false;
  makeitbetterx = false;
  makeitworsex = false;
  ratepainx = false;
  happenbeforex = false;
  
  ideasx = false;
  concernsx = false;
  expectationsx = false;
  familyhistoryx = false;
  
  pmhx = false;
  surgicalx = false;
  medsx = false;
  allergiesx = false;
  
  jobx = false;
  walkdistancex = false;
  homesituationx = false;
  smokingx = false;
  alcoholx = false;
  
  /*Important not to miss*/
  dizzinessx = false;
  feverx = false;
  weightx = false;
  appetitex = false;
  jaundicex = false;
  darkurinex = false;
  nauseax = false;
  backpainx = false;
  shouldertipx = false;
  steatorrhoeax = false;
  bloatingx = false;
  itchingx = false;
  prevgallx = false;
  
  let generatedText = "";
  let dyspnoeax = "";


  /*Examinations*/
  cardioexamx = false;
  
  var dob_repeat = 0;
  var work_repeat = 0;
  var painlocationrepeat = 0;
  var onsetrepeat = 0;
  
  
  var nameage_repeat = 0;
  var age_repeat = 0;
  var oktospeak_repeat = 0;
  var name_repeat = 0;
  var call_repeat = 0;
  var dob_repeat = 0;
  var bornlocation_repeat = 0;
  var work_repeat = 0;//is a repeat from above
  var stress_repeat = 0;
  var enjoy_repeat = 0;
  var howareyou_repeat = 0;
      
  var alwayspain_repeat = 0;
      var constant_repeat = 0;
      var painconstant_repeat = 0;
      var intermittent_repeat = 0;
      var alwaysthere_repeat = 0;
      var comeandgo_repeat = 0;
      var painlocationrepeat = 0;//is a repeat from above - change the underscore
  
      var arm_repeat = 0;
      var warmarm_repeat = 0;
      var neck_repeat = 0;
      var leftshoulder_repeat = 0;
      var onset_repeat = 0;
      var onsetrepeat = 0;//is a repeat from above - change the underscore
      var whathappened_repeat = 0;
      var wherepainexactly_repeat = 0;
      var burn_repeat = 0;
      var sharp_repeat = 0;
      var describepain_repeat = 0;
  
      var radiate_repeat = 0;
      var ratethepain_repeat = 0;
      var makeitbetter_repeat = 0;
      var makeitworse_repeat = 0;
      var worsewhen_repeat = 0;
      var betterwhen_repeat = 0;
      var whenstarted_repeat = 0;
      var gottenworsethroughtime_repeat = 0;
      var tender_repeat = 0;
      var pastheart_repeat = 0;
      var firstheartattack_repeat = 0;
      var happenbefore_repeat = 0;
      var painin_repeat = 0;
      var othersymptoms_repeat = 0;
      var fever_repeat = 0;
      var tired_repeat = 0;
      var nausea_repeat = 0;
      var dizzy_repeat = 0;
      var palpitations_repeat = 0;
      var sweat_repeat = 0;
      var cough_repeat = 0;
      var sputum_repeat = 0;
      var colour_repeat = 0;
      var volume_repeat = 0;
      var breathlessness_repeat = 0;
      var walkdistance_repeat = 0;
      var sleeppillows_repeat = 0;
      var wakeup_repeat = 0;
      var howwakeup_repeat = 0;
      var bloating_repeat = 0;
      var yellow_repeat = 0;
  
      var oedema_repeat = 0;
      var lumps_repeat = 0;
      var confusion_repeat = 0;
      var cholesterol_repeat = 0;
      var muscle_repeat = 0;
      var howmuscle_repeat = 0;
      var headaches_repeat = 0;
      var vision_repeat = 0;
      var skin_repeat = 0;
      var bowels_repeat = 0;
      var urine_repeat = 0;
      var weight_repeat = 0;
      var blood_repeat = 0;
      var appetite_repeat = 0;
      var idea_repeat = 0;
      var concerns_repeat = 0;
      var expectations_repeat = 0;
  
      
      var FH_repeat = 0;
      var familydiabetes_repeat = 0;
      var familyheart_repeat = 0;
      var pmhx_repeat = 0;
      var strokepast_repeat = 0;
      var otherhistory_repeat = 0;
      var bpfamily_repeat = 0;
      var legpain_repeat = 0;
      var sleepapnoea_repeat = 0;
      var surgery_repeat = 0;
      var allergy_repeat = 0;
      var takeforpain_repeat = 0;
      var illicitdrugs_repeat = 0;
      var howlongsmoke_repeat = 0;
      var startsmoke_repeat = 0;
      var howmuchsmoke_repeat = 0;
      var usedtosmoke_repeat = 0;
      var drinking_repeat = 0;
      var startdrinking_repeat = 0;
      var drinkingalcohol_repeat = 0;
      var usedtodrink_repeat = 0;
      var illegaldrugs_repeat = 0;
      var overthecounter_repeat = 0;
      var exercise_repeat = 0;
      var diet_repeat = 0;
      var livewithathome_repeat = 0;
      var bungalo_repeat = 0;
      var howiswife_repeat = 0;
      var havewife_repeat = 0;
      var children_repeat = 0;
      var hithere_repeat = 0;
      var isthatcorrect_repeat = 0;
      var missedanything_repeat = 0;
      var canrepeat_repeat = 0;
      var sorryfor_repeat = 0;
      var hardforyou_repeat = 0;
  
  
  
  
  
  
  
  
  
  let counterforpresssubmitprompt = 0;
  
  var previousquestion = "";
  var response_question = "";
  
  
  
  
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
   $(function() {
    $('#note-textarea').focus();
  
    $(document).on('keydown', function() {
      $('#note-textarea').focus();
    });
  });
   
  /*-----------------------------
        Voice Recognition
  ------------------------------*/
   
  // If false, the recording will stop after a few seconds of silence.
  // When true, the silence period is longer (about 15 seconds),
  // allowing us to keep recording even when the user pauses.
  
  recognition.continuous = true;
  
  
  var silenceTimeout = null;
  
  // Function to reset the silence timeout
  
    
    
  
  
  
  
  
  
  // This block is called every time the Speech APi captures a line.
  recognition.onresult = function(event) {
  
    
    
  
    if(silenceTimeout){
    clearTimeout(silenceTimeout);
    silenceTimeout = null;
    }
  
    
    // event is a SpeechRecognitionEvent object.
    // It holds all the lines we have captured so far.
    // We only need the current one.
    var current = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript = event.results[current][0].transcript;
   
    
   
    // Add the current transcript to the contents of our Note.
    // There is a weird bug on mobile, where everything is repeated twice.
    // There is no official solution so far so we have to handle an edge case.
    var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
    noteContent = '';

    if(!mobileRepeatBug) {
      noteContent += transcript;
      noteContent = noteContent.toLowerCase();
      noteTextarea.val(noteContent);
    }
  
  /*
    silenceTimeout = setTimeout(function() {
      // Trigger pause action after 4 seconds of continuous silence
      pauseBtn.click();
    }, 5000);//change this to 12-15 seconds in the future
  */
  };//end of recognition.onresult
  
  
  
  
  
  
  
  
  
  
  
  //the button for submitting the question and if press enter then submits the question
  let actionTriggered = false;
  
  
    document.getElementById("executeButton").addEventListener("click", function() {
          onesecdelaybeforestoprecog();
          actionTriggered = true; clearTimeout(silenceTimeout);
              document.getElementById('stop-consultation-btn').style.display = 'none';   document.getElementById('replayButton').style.display = 'none';   document.getElementById('home').style.display = 'none'; document.getElementById('executeButton').style.display = 'none'; document.getElementById('loadingcircle').style.display = 'unset';  micisworking.style.display = 'none'; initialpromptforpresssubmit.style.display = 'none'; 
          });
  
  
    document.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && micisworking.style.display !== 'none') {// && !actionTriggered  
         onesecdelaybeforestoprecog();
         actionTriggered = true; clearTimeout(silenceTimeout);
             document.getElementById('stop-consultation-btn').style.display = 'none';   document.getElementById('replayButton').style.display = 'none';   document.getElementById('home').style.display = 'none'; document.getElementById('executeButton').style.display = 'none'; document.getElementById('loadingcircle').style.display = 'unset';  micisworking.style.display = 'none'; initialpromptforpresssubmit.style.display = 'none';    
         document.getElementById("executeButton").removeEventListener("click", arguments.callee);    //document.removeEventListener("keydown", handleKeyDown);
         
        }   });
  
  
  
  ///////check if i acc need this part
  var onesecdelay = null;
    function onesecdelaybeforestoprecog() {
      onesecdelay = setTimeout(function () {
        recognition.stop();executeActionAfterDelay(); clearTimeout(silenceTimeout);
      }, 1000);
    }
  //////
  
  
  var timerforsubmitting = null;
  
  
      function executeActionAfterDelay() {
      timerforsubmitting = setTimeout(function () {
        clearTimeout(silenceTimeout); document.getElementById('loadingcircle').style.display = 'none';submitquestion();
        document.getElementById('executeButton').style.display = 'none';      
      }, 1500);
    }
  
  
  
                                      /*-----------------------------///////////////////////// Set a new timer after 2 seconds of silence //""""""""
                                      var silenceTimer = null; //""""""""
  
                                      // Clear the timer if it's running //""""""""
                                      if (silenceTimer) {
                                        clearTimeout(silenceTimer);
                                        silenceTimer = null;
                                      }
  
                                      silenceTimer = setTimeout(function() {
                                        pauseBtn.click();
                                        }, 8000);
  
                                      ///////////////////////////////////////////////////////////////////////////////////////////////////////--*/
                                     /* document.getElementById('loadingcircle').style.display = 'none';
                                      navigator.permissions.query({ name: 'microphone' })
                                      .then(function(permissionStatus) {
                                        if (permissionStatus.state === 'granted') {
                                          document.getElementById('loadingcircle').style.display = 'unset';
  
                                        } else {
                                          startButton.addEventListener('click', function() {
                                            // Request microphone permission when the button is clicked
                                            navigator.mediaDevices.getUserMedia({ audio: true })//this gets the message asking for permission on the user interface to come back
                                              .then(function(stream) {
                                                //resultDisplay.style.display = 'block';
                                                document.getElementById('loadingcircle').style.display = 'unset';                                            })
  
                                            });
                                          }
                                        })*/
  
  
  
  
                                        //let executeButton = document.getElementById('executeButton');
  
                                        
  
  
  
  
  
                            /*        
                                        recognition.onend = function() {
                                          //console.log('Microphone is inactive');
                                          loadingcircle.style.display = 'none';
                                        };*/
                                    
                                        /*executeButton.addEventListener('click', function() {
                                          recognition.start();
                                        });*/
                                    
                                        // Check for microphone permission on page load
                                    /*    navigator.permissions.query({ name: 'microphone' })
                                      .then(function(permissionStatus) {
                                        if (permissionStatus.state === 'granted') {
                                          loadingcircle.style.display = 'unset';
                                        }
                                      });*/
  
  
  
  
  
  
  
  
  
  
                                                                                  
  
  
  
  
  
    function submitquestion(){
  
    
  
    recognition.stop();
       document.getElementById('replayButton').style.display = 'none';   document.getElementById('stop-consultation-btn').style.display = 'none';  document.getElementById('home').style.display = 'none'; document.getElementById('executeButton').style.display = 'none';
  
       

       //if (noteContent.includes("dark")||noteContent.includes("pale")){darkurinex = true;}
       //if (noteContent.includes("back")){backpainx = true;}
       //if (noteContent.includes("shoulder")||noteContent.includes("tip")){shouldertipx = true;}
       //if (noteContent.includes("greasy")||noteContent.includes("flush")||noteContent.includes("smell")||noteContent.includes("adour")||noteContent.includes("steato")||noteContent.includes("fatty")){steatorrhoeax = true;}
       //if (noteContent.includes("bloat")){bloatingx = true;}
       //if (noteContent.includes("itch")||noteContent.includes("prutitis")){itchingx = true;}
       //if (noteContent.includes("gall")||noteContent.includes("stone")){prevgallx = true;}
       //if (noteContent.includes("worse when")){makeitworsex = true;}
       //if (noteContent.includes("better when")){makeitbetterx = true;}    
      

       var darkurinereal1 = $('#darkurinereal1'); var darkurinereal2 = $('#darkurinereal2'); if (noteContent.includes("dark")||noteContent.includes("pale")){redstyles(darkurinereal1); greenstyles(darkurinereal2);}
       var backpainreal1 = $('#backpainreal1'); var backpainreal2 = $('#backpainreal2'); if (noteContent.includes("back")){redstyles(backpainreal1); greenstyles(backpainreal2);}
       var shouldertipreal1 = $('#shouldertipreal1'); var shouldertipreal2 = $('#shouldertipreal2'); if (noteContent.includes("shoulder")||noteContent.includes("tip")){redstyles(shouldertipreal1); greenstyles(shouldertipreal2);}
       var steatorrhoeareal1 = $('#steatorrhoeareal1'); var steatorrhoeareal2 = $('#steatorrhoeareal2'); if (noteContent.includes("greasy")||noteContent.includes("flush")||noteContent.includes("smell")||noteContent.includes("adour")||noteContent.includes("steato")||noteContent.includes("fatty")){redstyles(steatorrhoeareal1); greenstyles(steatorrhoeareal2);}
       var bloatingreal1 = $('#bloatingreal1'); var bloatingreal2 = $('#bloatingreal2'); if (noteContent.includes("bloat")){redstyles(bloatingreal1); greenstyles(bloatingreal2);}
       var itchingreal1 = $('#itchingreal1'); var itchingreal2 = $('#itchingreal2'); if (noteContent.includes("itch")||noteContent.includes("prutitis")){redstyles(itchingreal1); greenstyles(itchingreal2);}
       var prevgallreal1 = $('#prevgallreal1'); var prevgallreal2 = $('#prevgallreal2'); if (noteContent.includes("gall")||noteContent.includes("stone")){redstyles(prevgallreal1); greenstyles(prevgallreal2);}
       var makeitworsereal1 = $('#makeitworsereal1'); var makeitworsereal2 = $('#makeitworsereal2'); if (noteContent.includes("worse when")){redstyles_aboveline(makeitworsereal1); greenstyles_aboveline(makeitworsereal2);}
       var makeitbetterreal1 = $('#makeitbetterreal1'); var makeitbetterreal2 = $('#makeitbetterreal2'); if (noteContent.includes("better when")){redstyles(makeitbetterreal1); greenstyles(makeitbetterreal2);}     




  
      if(nameage_repeat == 0 && (noteContent.includes("name") && noteContent.includes("age"))) {
        //readOutLoud("My name is Jason Miller and I am 40")
        previousquestion = noteContent; nameage_repeat++;   response_question = "I'm Jason and am 40";
        document.getElementById("mp4_src").src = "videos/name+age.mp4"; allifsaction();}
      
      else if(age_repeat == 0 && (noteContent.includes("age")||noteContent.includes("old"))){
        //readOutLoud("I'm 40 years old")
        previousquestion = noteContent; age_repeat++;   response_question = "I'm 40";
        document.getElementById("mp4_src").src = "videos/age.mp4"; allifsaction();}
  
      else if (oktospeak_repeat == 0 && (noteContent.includes("is it ok")||noteContent.includes("would it be ok")||noteContent.includes("talk to you")
        ||noteContent.includes("chat")||noteContent.includes("speak to you")||noteContent.includes("ask you")||noteContent.includes("may i"))) {
        //readOutLoud("yes that's fine");
        previousquestion = noteContent; oktospeak_repeat++;  response_question = "yes that's fine";
        document.getElementById("mp4_src").src = "videos/yesthatsfine.mp4"; allifsaction();}//consent for consultation (can i ask you a few questions)
  
      else if (name_repeat == 0 && (noteContent.includes("your name")||noteContent.includes("full name"))) {
        /////////////////////////////////////////////////////////////////////////////////////////////
        //My name is Jason Miller
        previousquestion = noteContent; name_repeat++;  response_question = "I'm Jason";
        document.getElementById("mp4_src").src = "videos/name.mp4"; allifsaction();}//name
  
      else if (call_repeat == 0 && (noteContent.includes("call")||noteContent.includes("address"))) {
        //readOutLoud("Jason is fine");
        previousquestion = noteContent; call_repeat++;  response_question = "Jason is fine";
        document.getElementById("mp4_src").src = "videos/jasonisfine.mp4"; allifsaction();}//how would you like to be addressed as
  
    /*  else if (noteContent.includes("age")||noteContent.includes("old")) {
        //readOutLoud("I'm 31");
        previousquestion = noteContent;   response_question = "I'm 31";
        document.getElementById("mp4_src").src = "videos/age.mp4"; allifsaction();}//age
      */
      else if (dob_repeat == 0 && (noteContent.includes("date of birth")||noteContent.includes("when")&&noteContent.includes("born"))) {
        //readOutLoud("the 4th of June 1984");
        previousquestion = noteContent; dob_repeat++;  response_question = "4th of June 1984";
        document.getElementById("mp4_src").src = "videos/dob.mp4"; allifsaction();}//DOB
  
      else if (work_repeat == 0 &&(noteContent.includes("occupation")||noteContent.includes("job")||noteContent.includes("work"))) {
        //readOutLoud("I work as a lawyer");
        previousquestion = noteContent;   response_question = "I'm a lawyer";
        jobx = true; work_repeat ++; 
        document.getElementById("mp4_src").src = "videos/job.mp4"; allifsaction();}//job
      
      else if (stress_repeat == 0 && (noteContent.includes("stress"))) {
        //readOutLoud("I don't feel like I have any stresses in my life at the moment");
        previousquestion = noteContent; stress_repeat++;  response_question = "I've not been stressed recently";
        document.getElementById("mp4_src").src = "videos/stress.mp4"; allifsaction();}//Are you stressed at work
      
      else if (howareyou_repeat == 0 && (noteContent.includes("how are you")||noteContent.includes("how are things")||noteContent.includes("what about you"))) {
        //readOutLoud("I'm not feeling the best but I am ok");
        previousquestion = noteContent; howareyou_repeat++;  response_question = "I'm not feeling the best but I am ok";
        document.getElementById("mp4_src").src = "videos/imnotfeelingthebest.mp4"; allifsaction();}//how are you?
  
  
  
      
  
      else if (alwayspain_repeat == 0 && (noteContent.includes("always there")&&noteContent.includes("come"))) {
        //readOutLoud("The pain is not constantly always there, but instead I would say it comes and goes");
        previousquestion = noteContent; alwayspain_repeat++;  response_question = "The pain comes and goes";
        timecoursex = true;
        document.getElementById("mp4_src").src = "videos/painconstantlyalwaysthere.mp4"; allifsaction();}//is the pain always there OR constant (there's another one later too)
  
      else if (constant_repeat == 0 && (noteContent.includes("constant")&&noteContent.includes("come"))) {
        //readOutLoud("The pain is not constantly always there");
        previousquestion = noteContent; constant_repeat++;  response_question = "The pain's not constant";
        timecoursex = true;
        document.getElementById("mp4_src").src = "videos/painconstantlyalwaysthere.mp4"; allifsaction();}//is the pain always there OR constant (there's another one later too)
  
      else if (painconstant_repeat == 0 && (noteContent.includes("always there")&&noteContent.includes("intermittent"))) {
        //readOutLoud("The pain is not constantly always there");
        previousquestion = noteContent; painconstant_repeat++;  response_question = "The pain's not constant";
        timecoursex = true;
        document.getElementById("mp4_src").src = "videos/painconstantlyalwaysthere.mp4"; allifsaction();}//is the pain always there OR constant (there's another one later too)
  
      else if (intermittent_repeat == 0 && (noteContent.includes("constant")&&noteContent.includes("intermittent"))) {
        //readOutLoud("The pain is not constantly always there");
        previousquestion = noteContent; intermittent_repeat++;  response_question = "The pain's not constant";
        timecoursex = true;
        document.getElementById("mp4_src").src = "videos/painconstantlyalwaysthere.mp4"; allifsaction();}//is the pain always there OR constant (there's another one later too)
  
  
  
      else if (alwaysthere_repeat == 0 && (noteContent.includes("constant")||noteContent.includes("always there"))) {
        //readOutLoud("The pain is not constantly always there");
        previousquestion = noteContent; alwaysthere_repeat++;  response_question = "The pain's not constant";
        timecoursex = true;
        document.getElementById("mp4_src").src = "videos/painconstantlyalwaysthere.mp4"; allifsaction();}//is the pain constant
  
      else if (comeandgo_repeat == 0 && (noteContent.includes("intermittent")||noteContent.includes("come and go")||noteContent.includes("comes and go"))) {
        //readOutLoud("The pain come and goes all the time");
        previousquestion = noteContent; comeandgo_repeat++;  response_question = "The pain come and goes";
        timecoursex = true;
        document.getElementById("mp4_src").src = "videos/painconstantlyalwaysthere.mp4"; allifsaction();}//is the pain intermittent
  
  
  
      //Opening question    
      else if (painlocationrepeat == 0 &&!noteContent.includes("family")&&!noteContent.includes("other")&&!noteContent.includes("medical")
      &&(noteContent.includes("brought")||noteContent.includes("bring")||noteContent.includes("what can")||noteContent.includes("why")
          ||noteContent.includes("come")||noteContent.includes("how do you feel")
          ||noteContent.includes("I help")||(noteContent.includes("you have any pain")&&!noteContent.includes("else"))
          ||noteContent.includes("i can do for you")||noteContent.includes("can i do for you")
          ||noteContent.includes("problem"))) {
        //readOutLoud("This morning I felt this pain in my tummy a few hours after eating breakfast, but now this is becoming quite regular and it's starting to really affect my life");
        previousquestion = noteContent;   response_question = "I've got abdominal pain this morning and now this has been going on for quite a long time, I'd say about 2 months and affecting my life";
        painlocationrepeat ++;  
        painlocationx = true;
        onsetx = true;
        document.getElementById("mp4_src").src = "videos/vid-whatsbroughtyouin.mp4"; allifsaction();}//HOPC/whats made you come to the hospital/ why did you come to the hospital
      
  
  
  
  
  
  
  
  ///////////////////////////////////////////////////////////////////////
  
  
  
  
  
  
  
  
  
  
      else if (onsetrepeat == 0 &&(noteContent.includes("bit more")||noteContent.includes("tell me more")||noteContent.includes("tell me about"))&&(noteContent.includes("pain")||noteContent.includes("it"))) {
        //readOutLoud("The pain is quite debilitating for me I feel, and it just keeps coming back so I thought I would come get it checked out.");
        previousquestion = noteContent; onsetrepeat++;  response_question = "The pain is quite debilitating for me, and it keeps coming back so came to get it checked out";
        onsetx = true;
        
      document.getElementById("mp4_src").src = "videos/bitmore.mp4"; allifsaction();}//tell me a bit more
  
      else if (whathappened_repeat == 0 && (noteContent.includes("how")&&(noteContent.includes("pain")||noteContent.includes("it"))&&(noteContent.includes("develop")||noteContent.includes("start")||noteContent.includes("begin")||noteContent.includes("come")||noteContent.includes("brought"))
      ||noteContent.includes("what happen"))) {
        //readOutLoud("The pain started around half an hour after I ate breakfast. I did eat a lot as I had a full english breakfast and so I thought it could've been related to the food");
        previousquestion = noteContent; whathappened_repeat++;  response_question = "The pain started 30 mins after full english breakfast"; onsetx = true;
        document.getElementById("mp4_src").src = "videos/howhappen.mp4"; allifsaction();}//how did you get the pain/how did it start
        
      //pain
      
      else if (wherepainexactly_repeat == 0 && (noteContent.includes("where")&&(noteContent.includes("pain")||noteContent.includes("discomfort")||noteContent.includes("hurt"))&&!noteContent.includes("else")&&!noteContent.includes("somewhere")&&!noteContent.includes("anywhere")&&!noteContent.includes("everywhere")
      )) {
        //readOutLoud("The pain is in the upper right region of my tummy"); - DON'T REMOVE THE SPACE BEFORE 'WHERE' AS CAN BE 'ANYWHERE (ELSE)'FOR RADIATION OF PAIN
        previousquestion = noteContent; wherepainexactly_repeat++;  response_question = "The pain's in the upper right region of my tummy";
        painlocationx = true;
  
        document.getElementById("mp4_src").src = "videos/wherepain.mp4"; allifsaction();}//where is the pain
      
  
  
  
  
  
          
     
      else if (describepain_repeat == 0 && (noteContent.includes("describe")||noteContent.includes("it feel like")
          ||noteContent.includes("pain feel like"))) {
        //readOutLoud("The pain feels like a sharp pain");
        previousquestion = noteContent; describepain_repeat++;  response_question = "The pain feels like a sharp pain";
        characterx = true;
      document.getElementById("mp4_src").src = "videos/feelslikehorsekickedme.mp4"; allifsaction();}//describe the pain
      
    
      
  
  ////
      
      
  
  
      else if (radiate_repeat == 0 && (noteContent.includes("radiate")||noteContent.includes("other pain")
      ||(noteContent.includes("anywhere")||noteContent.includes("other"))&&(noteContent.includes("move")||noteContent.includes("go")))) {
        //readOutLoud("now you mention it, I have also noticed that the pain goes to the middle of my tummy as well, and also a bit in the middle of my back too");
        previousquestion = noteContent; radiate_repeat++;  response_question = "I have pain that goes to the middle of my tummy, and also a bit in the middle of my back";
        radiatex = true;
  
        document.getElementById("mp4_src").src = "videos/mainlyinchestbutalsoinneckandchestandarm.mp4"; allifsaction();}//does the pain radiate/move anywhere/does the pain move to other parts of the body
      
      else if (ratethepain_repeat == 0 && (noteContent.includes("rate")&&(noteContent.includes("pain")||noteContent.includes("it")||noteContent.includes("sever"))
      ||noteContent.includes("severe")&&(noteContent.includes("pain")||noteContent.includes("it"))
      ||noteContent.includes("1-10")||noteContent.includes("1 to 10")||noteContent.includes("one to ten")||noteContent.includes("-10")
          ||noteContent.includes("out of 10")||noteContent.includes("out of ten"))) {
        //readOutLoud("Honesty I would say the pain is probably around 7/10, and I normally have quite a high pain threshold");
        previousquestion = noteContent; ratethepain_repeat++;  response_question = "The pain is 7/10 in severity";
        ratepainx = true;
        document.getElementById("mp4_src").src = "videos/painis9outof10.mp4"; allifsaction();}//rate the pain
      
      else if (makeitbetter_repeat == 0 && (noteContent.includes("make it better")||noteContent.includes("make the pain better")
          ||noteContent.includes("makes it better")||noteContent.includes("makes the pain better")
          ||noteContent.includes("relieve")||noteContent.includes("ease"))) {
        //readOutLoud("Honestly, nothing makes the pain better, it just seems to ease off by itself after 30 minutes");
        previousquestion = noteContent; makeitbetter_repeat++;  response_question = "nothing makes the pain better, it just eases off by itself after 30 mins";
        makeitbetterx = true;
        document.getElementById("mp4_src").src = "videos/nothingmakesitbetter.mp4"; allifsaction();}//anything make it better/anything ease the pain
      
      else if (makeitworse_repeat == 0 && (noteContent.includes("make it worse")||noteContent.includes("exacerbate")
          ||noteContent.includes("make the pain worse")||noteContent.includes("makes the pain worse")
          ||noteContent.includes("makes it worse"))) {
        //readOutLoud("Eating fatty meals like burgers or fish and chips makes the pain worse.");
        previousquestion = noteContent; makeitworse_repeat++;  response_question = "Eating fatty meals, burgers, fish + chips makes the pain worse";
        makeitworsex = true;
      
        document.getElementById("mp4_src").src = "videos/anymovementmakesitworse.mp4"; allifsaction();}//anything make it worse
      
     
      else if (whenstarted_repeat == 0 && ((noteContent.includes("how long")||noteContent.includes("start"))&&!noteContent.includes("smok")&&!noteContent.includes("alcohol")&&!noteContent.includes("drink"))) {
        //readOutLoud("This pain started this morning after breakfast but stopped after 30 minutes");
        previousquestion = noteContent; whenstarted_repeat++;  response_question = "This pain started this morning after breakfast but stopped after 30 mins";
        document.getElementById("mp4_src").src = "videos/startedthismorning.mp4"; allifsaction();}//How long have you had the pain for/when did the pain start
      
      else if (gottenworsethroughtime_repeat == 0 && (noteContent.includes("got worse")||noteContent.includes("gotten worse")
          ||noteContent.includes("gotten better")||noteContent.includes("got better")||noteContent.includes("sudden"))) {
        //readOutLoud("The pain has not gotten worse since this morning, and actually is not too bad now");
        previousquestion = noteContent; gottenworsethroughtime_repeat++;  response_question = "The pain has not gotten worse since this morning, and actually is not too bad now";
        document.getElementById("mp4_src").src = "videos/painisgottenworseovertheday.mp4"; allifsaction();}//Has the pain gradually gotten worse/better
      
      
      
      
      else if(happenbefore_repeat == 0 && ((noteContent.includes("happen")||noteContent.includes("felt"))&& noteContent.includes("before"))){
        //readOutLoud("This has now happened quite a few times actually and is happening more often recently");
        previousquestion = noteContent; happenbefore_repeat++;  response_question = "This has now happened quite a few times actually and is happening more often recently";
        happenbeforex = true;
        document.getElementById("mp4_src").src = "videos/nothatsneverhappenedbefore.mp4"; allifsaction();}
  
  
  
  
  
  
      //rule out pain anywhere else
      else if (painin_repeat == 0 && ((noteContent.includes("have")||noteContent.includes("notice")||noteContent.includes("any"))&&(noteContent.includes("pain in")||noteContent.includes("pains in")))) {
        //readOutLoud("I've mainly got pain in the upper right side of my abdomen, but also noticed in the middle of my abdomen and my back");
        previousquestion = noteContent; painin_repeat++;  response_question = "I've mainly got pain in my upper right abdomen but also noticed in my back and upper abdomen";
        radiatex = true;
        backpainx = true;
      document.getElementById("mp4_src").src = "videos/mainlyinchestbutalsoinneckandchestandarm.mp4"; allifsaction();}//any pain in X (eg in the shoulders, in the side etc)
      
      //other symptoms    
      else if (othersymptoms_repeat == 0 && (noteContent.includes("symptoms")||noteContent.includes("come along with")
          ||noteContent.includes("anything else")||noteContent.includes("come with"))) {
        //readOutLoud("I've also vomited once earlier today, but I've been feeling sick for the whole day");
        previousquestion = noteContent; othersymptoms_repeat++;  response_question = "I've also vomited once earlier today, but I've been feeling sick for the whole day";
        associatedsymptomsx = true;
        document.getElementById("mp4_src").src = "videos/sobbutcozofthepain.mp4"; allifsaction();}//any other Sx/does anything else come along with the pain
      
      else if (fever_repeat == 0 && (noteContent.includes("fever")||noteContent.includes("felt off")||noteContent.includes("felt yourself")
          ||noteContent.includes("feel")&&noteContent.includes("off")||noteContent.includes("a cold")||noteContent.includes("under the weather")
          ||noteContent.includes("temperature")&&noteContent.includes("high"))) {
        //readOutLoud("Yes, I have been feeling a bit under the weather recently to be honest, and I feel quite tired and feverish recently");
        previousquestion = noteContent; fever_repeat++;  response_question = "Yes, I have been feeling a bit under the weather recently to be honest, and I feel quite tired and feverish recently";
        associatedsymptomsx = true;
        feverx = true;
        document.getElementById("mp4_src").src = "videos/fever.mp4"; allifsaction();}//fever
      
      else if (tired_repeat == 0 && ((noteContent.includes("tired")&&!noteContent.includes("of"))
      ||noteContent.includes("sore throat")||noteContent.includes("soar throat")||noteContent.includes("chills"))) {
    //readOutLoud("No");
    previousquestion = noteContent; tired_repeat++;  response_question = "No";
    associatedsymptomsx = true;
    document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//do you feel tired all the time/any chills (it eliminates if you say 'do you feel tired of X')
  
      else if (nausea_repeat == 0 && (noteContent.includes("naus")||noteContent.includes("vomit"))) {
        //readOutLoud("Yes, I vomited earlier on today");
        previousquestion = noteContent; nausea_repeat++;  response_question = "Yes, I vomited earlier on today";
        associatedsymptomsx = true;
        nauseax = true;
        document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//any vomiting/nausea/nauseous
      
      else if (dizzy_repeat == 0 && (noteContent.includes("dizz")||noteContent.includes("faint")||(noteContent.includes("light")&&noteContent.includes("head")))) {
        //readOutLoud("No");
        previousquestion = noteContent; dizzy_repeat++;  response_question = "No";
        associatedsymptomsx = true;
        dizzinessx = true;
        document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//any dizziness/fainting/lightheadedness
  
      else if (palpitations_repeat == 0 && (noteContent.includes("palpitation")||(noteContent.includes("beat")||noteContent.includes("pound")||noteContent.includes("rac"))&&(noteContent.includes("chest")||noteContent.includes("heart")))) {
        //readOutLoud("No");
        previousquestion = noteContent; palpitations_repeat++;  response_question = "No";
        associatedsymptomsx = true;
        palpitationsx = true;
        document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//palpitations/heart beating/racing/pounding
  
      else if (sweat_repeat == 0 && (noteContent.includes("clam")||noteContent.includes("sweat"))) {
        //readOutLoud("No");
        previousquestion = noteContent; sweat_repeat++;  response_question = "No";
        associatedsymptomsx = true;
        document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//any sweating/clammy
  
      else if (cough_repeat == 0 && (noteContent.includes("cough")&&!noteContent.includes("colour")&&!noteContent.includes("texture")&&!noteContent.includes("consistency"))) {
        //readOutLoud("No");
        previousquestion = noteContent; cough_repeat++;  response_question = "No";
        associatedsymptomsx = true;
        coughx = true;
        document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//cough
      
      else if (sputum_repeat == 0 && (noteContent.includes("bring up any")||noteContent.includes("sputum")||noteContent.includes("phlegm")
      ||noteContent.includes("cough")&&(noteContent.includes("bring up")||noteContent.includes("come")))) {
        //readOutLoud("No");
        previousquestion = noteContent; sputum_repeat++;  response_question = "No";
        associatedsymptomsx = true;
        coughx = true;
        document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//do you bring up anything when you cough/vomit/ anything come out?
      
      
      //SOB   
      else if (breathlessness_repeat == 0 && (noteContent.includes("short")||noteContent.includes("breathless")||noteContent.includes("breath")||noteContent.includes("dysp"))) {
        //readOutLoud("No");
        previousquestion = noteContent; breathlessness_repeat++;  response_question = "No";
        dyspnoeax = true;
        document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//SOB/dyspnoea
      
  
  
  
      else if (walkdistance_repeat == 0 && (noteContent.includes("whilst walk")||noteContent.includes("when you walk")
          ||noteContent.includes("whilst you walk")||noteContent.includes("when walk")||noteContent.includes("during walk")
          ||noteContent.includes("walk")&&(noteContent.includes("far")||noteContent.includes("how much")||noteContent.includes("stop")||noteContent.includes("until")))) {
        //readOutLoud("I can walk about 200 metres no problem, but after that I get a bit short of breath");
        previousquestion = noteContent; walkdistance_repeat++;  response_question = "I can walk about 200 metres no problem, but after that I get a bit short of breath";
        walkdistancex = true;
        document.getElementById("mp4_src").src = "videos/icanwalk.mp4"; allifsaction();}//how far can you walk/when do you feel short of breath/ dyu get SOB whilst walking/when walking
      
        
      
      //Gastro
      else if (bloating_repeat == 0 && (noteContent.includes("bloat"))) {
        //readOutLoud("I haven't noticed any bloating");
        previousquestion = noteContent; bloating_repeat++;  response_question = "I haven't noticed any bloating";
        associatedsymptomsx = true;
        document.getElementById("mp4_src").src = "videos/bloating.mp4"; allifsaction();}//bloating
      
      else if (yellow_repeat == 0 && (noteContent.includes("yellow")||noteContent.includes("jaundice"))) {
        //readOutLoud("I've not noticed any yellowing of the skin or of my eyes");
        previousquestion = noteContent; yellow_repeat++;  response_question = "I've not noticed any yellowing of the skin or of my eyes'";
        associatedsymptomsx = true;
        jaundicex = true;
        document.getElementById("mp4_src").src = "videos/yellowingofskin.mp4"; allifsaction();}//jaundice
  
  
  
  
  
  
  
    //bowels+urine    
    else if (bowels_repeat == 0 && (noteContent.includes("bowels")||noteContent.includes("poo")
      ||noteContent.includes("stool")||noteContent.includes("back side")
      ||noteContent.includes("constipation")||noteContent.includes("diarrhoea")||noteContent.includes("runny"))) {
    //readOutLoud("I've not noticed any changes in my bowels");
    previousquestion = noteContent; bowels_repeat++;  response_question = "I've not noticed any changes";
    document.getElementById("mp4_src").src = "videos/changesinstools.mp4"; allifsaction();}//bowels
  
  else if (urine_repeat == 0 && (noteContent.includes("urin")||noteContent.includes("pee")
      ||noteContent.includes("piss")||noteContent.includes("toilet")
      ||noteContent.includes("bladder")||noteContent.includes("void"))) {
    //readOutLoud("I've not noticed any changes in my urine");
    previousquestion = noteContent; urine_repeat++;  response_question = "I've not noticed any changes in my urine";
    
    if (noteContent.includes("dark")||noteContent.includes("pale")){darkurinex = true;}
    
    document.getElementById("mp4_src").src = "videos/changesinurine.mp4"; allifsaction();}//urine/voiding
  
  //red flags   
  else if (weight_repeat == 0 && (noteContent.includes("weigh"))) {
    //readOutLoud("I've not noticed any weight loss to be honest");
    previousquestion = noteContent; weight_repeat++;  response_question = "I've not noticed any weight loss";
    weightx = true;
    document.getElementById("mp4_src").src = "videos/wtlossgain.mp4"; allifsaction();}//weight loss
  
  else if (blood_repeat == 0 && (noteContent.includes("blood"))) {
    //readOutLoud("I've not noticed any blood loss from anywhere");
    previousquestion = noteContent; blood_repeat++;  response_question = "I've not noticed any blood loss from anywhere";
    document.getElementById("mp4_src").src = "videos/bloodloss.mp4"; allifsaction();}//blood loss
  
  else if (appetite_repeat == 0 && (noteContent.includes("appetite")||noteContent.includes("eating"))) {
    //readOutLoud("I've not noticed any changes in my appetite");
    previousquestion = noteContent; appetite_repeat++;  response_question = "I've not noticed any changes in my appetite";
    appetitex = true;
    document.getElementById("mp4_src").src = "videos/changesinappetite.mp4"; allifsaction();}//changes in appetite
  
  
    //ICE
    else if (idea_repeat == 0 && (noteContent.includes("idea")||noteContent.includes("do you think")||noteContent.includes("do you think")&&((noteContent.includes("going on")
      ||noteContent.includes("reckon")||noteContent.includes("happening"))))) {
    //readOutLoud("I think I might be having a bit of reflux, but I'm not too sure");
    previousquestion = noteContent; idea_repeat++;  response_question = "I think I might be having a bit of reflux, but I'm not too sure";
    ideasx = true;
    document.getElementById("mp4_src").src = "videos/ideas.mp4"; allifsaction();}//Ideas/what's your ideas of what's happening/what dyu think's happening/do you think it's cancer
  
  else if (concerns_repeat == 0 && (noteContent.includes("concern")||noteContent.includes("worr")||noteContent.includes("worry")||noteContent.includes("scar"))) {
    //readOutLoud("I'm really worried that the pain keeps coming back all the time");
    previousquestion = noteContent; concerns_repeat++;  response_question = "I'm really worried that the pain keeps coming back all the time";
    concernsx = true;
    document.getElementById("mp4_src").src = "videos/concerns.mp4"; allifsaction();}//Concerns/anything scaring you
  
  else if (expectations_repeat == 0 && (noteContent.includes("expect")||noteContent.includes("get out of")||noteContent.includes("like from us")||noteContent.includes("hoping")||noteContent.includes("hope")
  ||noteContent.includes("can we help")||noteContent.includes("what can we do for you")||noteContent.includes("what can i do for you"))) {
    //readOutLoud("I would like to figure out what is going on with me if that's possible");
    previousquestion = noteContent; expectations_repeat++;  response_question = "I want to figure out what's going on with me";
    expectationsx = true;
    document.getElementById("mp4_src").src = "videos/expectations.mp4"; allifsaction();}//Expectations/what would you like from us
  
  
  
  
  //PMHx+FHx+allergies+meds   
 
///  
  else if (familyheart_repeat == 0 && (noteContent.includes("family")||noteContent.includes("run in the"))) {
    //readOutLoud("My dad and my uncle both have high blood pressure");
    previousquestion = noteContent; familyheart_repeat++;  response_question = "My dad and my uncle both have high blood pressure";
    familyhistoryx = true;
    document.getElementById("mp4_src").src = "videos/familyhistory.mp4"; allifsaction();}//FHx
  
  
  
  else if (pmhx_repeat == 0 && (!noteContent.includes("famil")&&!noteContent.includes("ask")&&(noteContent.includes("anything else")||noteContent.includes("other problem")||noteContent.includes("other condition"))
  ||(noteContent.includes("medical")&&(noteContent.includes("problem")||noteContent.includes("condition")||noteContent.includes("issue"))))) {
    //readOutLoud("I have high cholesterol and my blood pressure is on the high side. I'm also prediabetic as well.");
    previousquestion = noteContent; pmhx_repeat++;  response_question = "I have high cholesterol and my blood pressure is on the high side. I'm also prediabetic as well";
    pmhx = true;
    document.getElementById("mp4_src").src = "videos/pmhx.mp4"; allifsaction();}//PMHx / suffere from anything else (you also want to rule out is there anything else you want to ask me)
  
      
 
  
  
      

  
  else if (surgery_repeat == 0 && (noteContent.includes("surger")||noteContent.includes("operat"))) {
    //readOutLoud("I've not had any surgeries in the past");
    previousquestion = noteContent; surgery_repeat++;  response_question = "I've not had any surgeries";
    surgeriesx = true;
    document.getElementById("mp4_src").src = "videos/surgeries.mp4"; allifsaction();}//Any surgeries
  
  
  else if (allergy_repeat == 0 && (noteContent.includes("allerg"))) {
    //readOutLoud("no");
    previousquestion = noteContent; allergy_repeat++;  response_question = "no";
    allergiesx = true;
    document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//FHx
  
  else if (takeforpain_repeat == 0 && (noteContent.includes("do you take anything for")||noteContent.includes("paracetamol")||noteContent.includes("pain relief")||noteContent.includes("relie")&&noteContent.includes("pain"))) {
    //readOutLoud("I take paracetamol, but it doesn't work");
    previousquestion = noteContent; takeforpain_repeat++;  response_question = "I take paracetomol but it doesn't work";
    medstestx = true;
    document.getElementById("mp4_src").src = "videos/itakeparacetamolbutdoesntwork.mp4"; allifsaction();}//Do you take anything for the pain? + does it work
  
  else if (illicitdrugs_repeat == 0 && (noteContent.includes("meds")||noteContent.includes("medication")||noteContent.includes("drugs")&&!noteContent.includes("illicit")&&!noteContent.includes("illegal"))) {
    //readOutLoud("I only take Ramipril 1.25 milligrams once a day for my blood pressure");
    previousquestion = noteContent; illicitdrugs_repeat++;  response_question = "I take ramipril for high BP";
    medstestx = true;
    document.getElementById("mp4_src").src = "videos/medicationsaspirin.mp4"; allifsaction();}//meds
  
  
  //social Hx
  
  
  else if (howmuchsmoke_repeat == 0 && (noteContent.includes("smok")||noteContent.includes("how much do you smoke"))) {
    //readOutLoud("I smoke around 15 cigarettes every day and i started when i was 15");
    previousquestion = noteContent; howmuchsmoke_repeat++;  response_question = "i smoke 15 cigarettes a day + started when i was 15";
    smokingx = true;
    document.getElementById("mp4_src").src = "videos/smoke.mp4"; allifsaction();}//smoking
  
  
  else if(drinkingalcohol_repeat == 0 && (noteContent.includes("drink")||noteContent.includes("alcohol")||noteContent.includes("how much do you drink"))){
    //readOutLoud("I drink about half a bottle of wine every day + started as a teenager");
    previousquestion = noteContent; drinkingalcohol_repeat++;  response_question = "i drink about half a bottle of wine per day";
    alcoholx = true;
    document.getElementById("mp4_src").src = "videos/alcohol.mp4"; allifsaction();}//alcohol
  
  else if (illegaldrugs_repeat == 0 && (noteContent.includes("illicit")||noteContent.includes("illegal drug"))){
    //readOutLoud("No");
    previousquestion = noteContent; illegaldrugs_repeat++;  response_question = "no i don't";
    document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//illicit drugs
  
  else if (overthecounter_repeat == 0 && (noteContent.includes("over the counter")||noteContent.includes("not prescribed")||noteContent.includes("not given"))){
    //readOutLoud("No");
    previousquestion = noteContent; overthecounter_repeat++;  response_question = "no";
    document.getElementById("mp4_src").src = "videos/no.mp4"; allifsaction();}//OTC drugs/have you been taking any drugs not given by the Dr
  
  else if (exercise_repeat == 0 && (noteContent.includes("exercise")||noteContent.includes("go on walk")||noteContent.includes("active")
  ||noteContent.includes("sport")||noteContent.includes("physical"))){
    //readOutLoud("I try and do exercise from time to time like going on walks with my dog and sometimes play badminton with my friends");
    previousquestion = noteContent; exercise_repeat++;  response_question = "I try do exercise like going on walks with my dog and play badminton";
    physicalactivityx = true;
    document.getElementById("mp4_src").src = "videos/exercise.mp4"; allifsaction();}//exercise/do you keep active
  
  ////
  
  else if (diet_repeat == 0 && (noteContent.includes("diet")||noteContent.includes("do you eat")||noteContent.includes("what you eat"))){
    //readOutLoud("I eat quite a lot of fatty products, a lot of cheese, eggs, meat, things like that.");
    previousquestion = noteContent; diet_repeat++;  response_question = "I eat quite a lot of fatty products, a lot of cheese, eggs, meat, things like that";
    appetitex = true;
    document.getElementById("mp4_src").src = "videos/ieattoomuch.mp4"; allifsaction();}//how's your diet/what sorts of things do you eat/describe what you eat
  
  
  
  
  //home situation    
  else if (livewithathome_repeat == 0 && (noteContent.includes("at home")||noteContent.includes("live with"))){
    //readOutLoud("I live alone in a flat in the city");
    previousquestion = noteContent; livewithathome_repeat++;  response_question = "i live alone in a flat";
    homesituationx = true;
    document.getElementById("mp4_src").src = "videos/livingsituation.mp4"; allifsaction();}//who's at home/who lives at home/who dyu live with
  
  else if (bungalo_repeat == 0 && (noteContent.includes("bungalo")||noteContent.includes("house")||noteContent.includes("appartment")
      ||noteContent.includes("live in")||noteContent.includes("you live")||noteContent.includes("living situation")||noteContent.includes("housing situation"))){
    //readOutLoud("I live in a little flat in the city");
    previousquestion = noteContent; bungalo_repeat++;  response_question = "i live in little flat in the city";
    homesituationx = true;
    document.getElementById("mp4_src").src = "videos/livingsituation.mp4"; allifsaction();}//where dyu live/dyu live in a flat etc
  
  
  /*
      else if ((noteContent.includes("good")||noteContent.includes("ok")||noteContent.includes("alright"))&&(noteContent.includes("i'm")||noteContent.includes("i am"))) {
        //readOutLoud("good");
        previousquestion = noteContent;   response_question = "good";
        document.getElementById("mp4_src").src = "videos/good.mp4"; document.getElementById("myVideo").load(); document.getElementById('myVideo').onended = function(e) {
          recognition.start();      document.getElementById('stop-consultation-btn').style.display = 'unset';
          }}//I'm good thank you (in response to how are you)
  */
  
          else if (hithere_repeat == 0 && ((noteContent.includes("hello")||noteContent.toLowerCase() === "hi."||noteContent.toLowerCase() === "hi"||noteContent.toLowerCase() === "hey"
          ||noteContent.toLowerCase() === "hey."||noteContent.includes("greeting")
          ||noteContent.includes("hey there")||noteContent.includes("hi there")||noteContent.includes("hiya"))&&!noteContent.includes("children"))){
            //readOutLoud("Hiya there");
            previousquestion = noteContent; hithere_repeat++;  response_question = "hiya there";
            document.getElementById("mp4_src").src = "videos/hiyathere.mp4"; allifsaction();}
          
  
  
  
  
  
  else if (noteContent === ""){
    
    pauseBtn.click(); pauseBtn.style.display = "none";
    emptyif.style.display = 'unset';
    
  }
  
      else {
        
        if (noteContent.includes("dark")||noteContent.includes("pale")){darkurinex = true;}

  








const generateResponse = async (input) => {
  // 🧠 Get or create session ID
  //let sessionId = localStorage.getItem("sessionId");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("sessionId", sessionId);
  }

  const token = await auth.currentUser.getIdToken();

const response = await fetch("https://medschoolsims-1.onrender.com/api/TUTOR2ndcase", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    Authorization: "Bearer " + token
  },
    body: JSON.stringify({ 
      input: input,
      sessionId: sessionId
    })
  });

  const data = await response.json();
  return data.content;
};






















/*      THE OFFICIAL VERSION THAT WORKS WITHOUT RENDER SERVER AND JUST LOALLY!!!!!!!!!

        
      //const prompt = "You are Jill, a 50 year old female with pain. The pain started yesterday at 3pm and is located on the upper right side of your tummy region. It is worse when bending down. You smoke 20 cigarettes per day, have 2 children, and do not take drugs. You are currently taking paracetamol for the pain. Imagine you are in a consultation room and the doctor is asking you questions, and you are Jill for all of the next questions that we ask in this thread. Do not give any more information than what the doctor asked for. Make it seem like Jill is not very smart and occasionally asks questions to the doctor. Question: What is your name?, Answer: My name is Jill";
      //const prompt = "you are jill, a 50 year old female. with pain. started yesterday at 3pm. located on the upper right side of your tummy region. that is worse when bending down. You smoke 20 cigarettes per day. you have 2 children. and don't take drugs. You take paracetamol for the pain. Imagine you are in a consultation room and the doctor is asking you questions and you are jill for all of the next questions Do not give any more information than what the doctor asked for. Input:"
      const prompt = "you're Jason, a 40 year old male. with right upper quadrant sharp pain that comes + goes for last 2 months + happened this morning. You're in a consultation room & the Dr is asking you questions. Answer as Jason"
  
      //require('dotenv').config();
  
      const generateResponse = async (input) => {
        const response = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', { //babbage davinci-3
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${process.env['API_KEY']}`
            'Authorization': `Bearer XX`
    
          },
          body: JSON.stringify({
            prompt: prompt + '\n' + 'Previous question: ' + previousquestion + '\n' + 'Response to previous question:' + response_question + '\n' + 'question: ' + input + '\n' + 'answer: ', //'\n' + 'output: '
            temperature: 0.1,
            max_tokens: 5,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          })
        });
      
        const { choices } = await response.json();
        //return choices[0].text.trim();
      //};
  
  //you can delete from this point till the 'return generatedText' and instead uncomment the 2 comments above 
  
  
      let generatedText = choices[0].text.trim();
  
    // Check if generatedText ends with sentence-ending punctuation
    while (!(generatedText.endsWith('.') || generatedText.endsWith('!') || generatedText.endsWith('?'))) {
      // Generate additional tokens to complete the sentence
      const additionalResponse = await fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer XX`
        },
        body: JSON.stringify({
          prompt: prompt + '\n' + 'Previous question: ' + previousquestion + '\n' + 'Response to previous question:' + response_question + '\n' + 'question: ' + input + '\n' + 'answer: ' + generatedText,
          temperature: 0.1,
          max_tokens: 5,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });
  
      const { choices: additionalChoices } = await additionalResponse.json();
      const additionalToken = additionalChoices[0].text.trim();
      generatedText += ' ' + additionalToken;
    }
  
    return generatedText;
    
  };
      
  */



 












  /*
  const handleUserInput = async (noteContent) => {
            const response = await generateResponse(noteContent);
            readOutLoud(response);
  
  
            document.getElementById("mp4_src").src = "WIN_20230328_13_59_49_Pro.mp4"; document.getElementById("myVideo").load(); document.getElementById('myVideo').onended = function(e) {
              recognition.start();      document.getElementById('stop-consultation-btn').style.display = 'unset';
            }      
      }
  */
  
  /*
  const handleUserInput = async (noteContent) => {
    const responsePromise = generateResponse(noteContent);
    const videoPromise = new Promise((resolve) => {
      gptvideo.onloadedmetadata = () => {
        gptvideo.muted = true;
  
        gptvideo.play();
        resolve();
      };
      document.getElementById("mp4_src").src = "vid-whatsbroughtyouin.mp4";
      gptvideo.load();
    });
    await Promise.all([responsePromise, videoPromise]);
    const response = await responsePromise;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(response);
  
    utterance.onend = () => {
      const gptvideo = document.getElementById('myVideo');
      gptvideo.pause();
      setTimeout(() => {
        gptvideo.muted = false; // Unmute the video after 2 seconds
      }, 2000);
  
      recognition.start();
      
      document.getElementById('stop-consultation-btn').style.display = 'unset';
    };
    synth.speak(utterance);
  };
  */
  
  document.getElementById('myVideo').style.display = 'none';









//for the video without speaking
document.getElementById('inbetweenVideo').style.display = 'unset'; 
const inbetweenVideo = document.getElementById('inbetweenVideo');
inbetweenVideo.load();
inbetweenVideo.onloadedmetadata = () => {
  inbetweenVideo.muted = true;
  inbetweenVideo.play();
}
document.getElementById("inbetweenmp4_src").src = "videos/silentvideo.mp4";



document.getElementById('mutedVideo').style.display = 'unset';  
const gptvideo = document.getElementById('mutedVideo');















const handleUserInput = async (noteContent) => {
  const responsePromise = generateResponse(noteContent);
  const videoPromise = new Promise((resolve) => {
    inbetweenVideo.onloadedmetadata = () => {
      inbetweenVideo.muted = true;

      inbetweenVideo.play();
      resolve();

    };
    ////////////////////is for playing the muted video///////////////////
    document.getElementById('loadingcircle').style.display = 'unset';
    document.getElementById('errormsg').style.display = 'unset';

    document.getElementById("mutedmp4_src").src = "videos/bitmore.mp4";
    
    
   


    setTimeout(() => {
      inbetweenVideo.load(); inbetweenVideo.loop = true;
      
  }, 1);




    gptvideo.onended =  function(e) {
      recognition.start();      document.getElementById('stop-consultation-btn').style.display = 'unset';   document.getElementById('replayButton').style.display = 'unset';   document.getElementById('home').style.display = 'unset'; document.getElementById('executeButton').style.display = 'unset'; actionTriggered = false;
      
      document.getElementById('myVideo').style.display = 'unset';
      document.getElementById('mutedVideo').style.display = 'none';
      document.getElementById('errormsg').style.display = 'none';
      document.getElementById('messagebeforeacceptingmic').style.display = 'unset';

    };
  

  });
  await Promise.all([responsePromise, videoPromise]);
  const response = await responsePromise;
  document.getElementById('chatgpt-response').innerText = 'Your previous question' + previousquestion  + '\n' + 'The response of the candidate to the previous question:' + response_question  + '\n' + 'Candidate response: ' + response + '\n' + '\n' + noteContent ; // Update the content of the element with ID 'chatgpt-response' REMOVE THIS!!!!

  /*
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(response);
*/







  const text11L = response;

// Call the Eleven Labs API for text-to-speech
fetch('https://oscesimstrial1.onrender.com/api/voicezak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        text: text11L,
        voiceId: 'lqMuuvylPBO6NGJ3N3d4'
    })
})
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to synthesize speech');
    }
    return response.blob();
})

.then(blob => {
    
  if (!audio) {
  audio = new Audio();
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "");
}

const url = URL.createObjectURL(blob);
audio.src = url;
audio.load();


  
  audio.onended = () => {
    const gptvideo = document.getElementById('mutedVideo');
    gptvideo.pause();

    recognition.start();
    document.getElementById('stop-consultation-btn').style.display = 'unset';
    document.getElementById('executeButton').style.display = 'unset';
    document.getElementById('myVideo').style.display = 'unset';
    document.getElementById('mutedVideo').style.display = 'none';
    messagebeforeacceptingmic.style.display = 'unset';
    document.getElementById('errormsg').style.display = 'none';

    actionTriggered = false;
  };

          const gptvideo = document.getElementById('mutedVideo');//get the muted talking video loaded
          gptvideo.muted = true;gptvideo.load();

  // Attach events BEFORE play
  audio.onplay = () => {
    document.getElementById('loadingcircle').style.display = 'none';
    document.getElementById('errormsg').style.display = 'none';

    // Stop silent video
    document.getElementById('inbetweenVideo').style.display = 'none';
    silentVideo.pause();
    silentVideo.style.display = 'none';

    // Start muted talking video
    gptvideo.style.display = 'unset';
    gptvideo.play();
  };

  

  // Now play (safe for desktop + mobile)
  audio.play().catch(err => {
    console.error("Audio play blocked:", err);
  });
});





/*
  utterance.onend = () => {

    const gptvideo = document.getElementById('mutedVideo');
    gptvideo.pause(); // Pause the video after the speech synthesis finishes
    //gptvideo.volume = 1;
    recognition.start();   document.getElementById('stop-consultation-btn').style.display = 'unset'; document.getElementById('executeButton').style.display = 'unset';
    document.getElementById('myVideo').style.display = 'unset';
    document.getElementById('mutedVideo').style.display = 'none';
    
    //not too sure about this below - (added this in BEFORE testing it with chat gpt)
    actionTriggered = false;

  };
  synth.speak(utterance);
*/



  previousquestion = noteContent; response_question = response;//is to put what the previous question was into chatgpt
};  
  
  
  
  
  
  
  
  const userInput = noteContent;
  handleUserInput(userInput);
  
  
  response_question = generatedText;
  };//end of the else statement
  
  function allifsaction(){
    document.getElementById("myVideo").load();      document.getElementById('inbetweenVideo').style.display = 'none';//ssssssssss
 document.getElementById('myVideo').onended = function(e) {
      recognition.start();      
      document.getElementById('stop-consultation-btn').style.display = 'unset';   
      document.getElementById('replayButton').style.display = 'unset';   document.getElementById('home').style.display = 'unset'; 
      document.getElementById('executeButton').style.display = 'unset';   
      actionTriggered = false;
      messagebeforeacceptingmic.style.display = 'unset';
    }
  }
  
  
     /*-----------------------------------------------------
      trial = false;
      var test = $('#test');
       if (noteContent.includes("job")){
         //test.text('all of this works');
         trial = true;
       }
       
       if (trial === true){
         test.text('YES he asked about job');
       }
  ----------------------------------------------------/*----
  
  /*----
  const save_note_btn = document.getElementById('save-note-btn');
     if (noteContent=== '') {
       save_note_btn.disabled = true;
     } else {
       save_note_btn.disabled = false;
     }
  
  /*----
  
  
  /*-----------------------------------------------
  Things we forgot to ask about in the consultation for EBI
  --------------------------------------------------*/
  
  /*var jobtest = $('#jobtest'); var jobtest1 = $('#jobtest1');
       if (jobx === true){
        jobtest.text('') 
        jobtest1.text("● The patient's job")
        generalhistorycounter++
        
       }*/
  
  
  let generalhistorycounter = 0;
  
  
  
  
  var painlocationreal1 = $('#painlocationreal1'); var painlocationreal2 = $('#painlocationreal2');
  if (painlocationx === true){
  redstyles(painlocationreal1); greenstyles(painlocationreal2);
  }
  
  var onsetreal1 = $('#onsetreal1'); var onsetreal2 = $('#onsetreal2');
  if (onsetx === true){
  redstyles(onsetreal1); greenstyles(onsetreal2);
  }
  
  var characterreal1 = $('#characterreal1'); var characterreal2 = $('#characterreal2');
  if (characterx === true){
  redstyles(characterreal1); greenstyles(characterreal2);
  }
  
  var radiatereal1 = $('#radiatereal1'); var radiatereal2 = $('#radiatereal2');
  if (radiatex === true){
  redstyles(radiatereal1); greenstyles(radiatereal2);
  }
  
  var associatedsymptomsreal1 = $('#associatedsymptomsreal1'); var associatedsymptomsreal2 = $('#associatedsymptomsreal2');
  if (associatedsymptomsx === true){
  redstyles(associatedsymptomsreal1); greenstyles(associatedsymptomsreal2);
  }
  
  var timecoursereal1 = $('#timecoursereal1'); var timecoursereal2 = $('#timecoursereal2');
  if (timecoursex === true){
  redstyles(timecoursereal1); greenstyles(timecoursereal2);
  }
  
  var makeitbetterreal1 = $('#makeitbetterreal1'); var makeitbetterreal2 = $('#makeitbetterreal2');
  if (makeitbetterx === true){
  redstyles(makeitbetterreal1); greenstyles(makeitbetterreal2);
  }
  
  var ratepainreal1 = $('#ratepainreal1'); var ratepainreal2 = $('#ratepainreal2');
  if (ratepainx === true){
  redstyles(ratepainreal1); greenstyles(ratepainreal2);
  }
  
  var makeitworsereal1 = $('#makeitworsereal1'); var makeitworsereal2 = $('#makeitworsereal2');
  if (makeitworsex === true){
  redstyles_aboveline(makeitworsereal1); greenstyles_aboveline(makeitworsereal2);
  }//aboveline
  
  var happenbeforereal1 = $('#happenbeforereal1'); var happenbeforereal2 = $('#happenbeforereal2');
  if (happenbeforex === true){
  redstyles(happenbeforereal1); greenstyles(happenbeforereal2);
  }
  
  
  
  
  
  var ideasreal1 = $('#ideasreal1'); var ideasreal2 = $('#ideasreal2');
  if (ideasx === true){
  redstyles(ideasreal1); greenstyles(ideasreal2);
  }
  
  var concernsreal1 = $('#concernsreal1'); var concernsreal2 = $('#concernsreal2');
  if (concernsx === true){
  redstyles(concernsreal1); greenstyles(concernsreal2);
  }
  
  var expectationsreal1 = $('#expectationsreal1'); var expectationsreal2 = $('#expectationsreal2');
  if (expectationsx === true){
  redstyles(expectationsreal1); greenstyles(expectationsreal2);
  }
  
  var familyhistoryreal1 = $('#familyhistoryreal1'); var familyhistoryreal2 = $('#familyhistoryreal2');
  if (familyhistoryx === true){
  redstyles(familyhistoryreal1); greenstyles(familyhistoryreal2);
  }
  
  var pmhreal1 = $('#pmhreal1'); var pmhreal2 = $('#pmhreal2');
  if (pmhx === true){
  redstyles(pmhreal1); greenstyles(pmhreal2);
  }
  
  var surgicalreal1 = $('#surgicalreal1'); var surgicalreal2 = $('#surgicalreal2');
  if (surgicalx === true){
  redstyles(surgicalreal1); greenstyles(surgicalreal2);
  }
  
  var medsreal1 = $('#medsreal1'); var medsreal2 = $('#medsreal2');
  if (medsx === true){
  redstyles(medsreal1); greenstyles(medsreal2);
  }
  
  var allergiesreal1 = $('#allergiesreal1'); var allergiesreal2 = $('#allergiesreal2');
  if (allergiesx === true){
  redstyles_aboveline(allergiesreal1); greenstyles_aboveline(allergiesreal2);
  }//aboveline
  
  var jobreal1 = $('#jobreal1'); var jobreal2 = $('#jobreal2');
  if (jobx === true){
  redstyles(jobreal1); greenstyles(jobreal2);
  }
  
  var walkdistancereal1 = $('#walkdistancereal1'); var walkdistancereal2 = $('#walkdistancereal2');
  if (walkdistancex === true){
  redstyles(walkdistancereal1); greenstyles(walkdistancereal2);
  }
  
  var homesituationreal1 = $('#homesituationreal1'); var homesituationreal2 = $('#homesituationreal2');
  if (homesituationx === true){
  redstyles(homesituationreal1); greenstyles(homesituationreal2);
  }
  
  var smokingreal1 = $('#smokingreal1'); var smokingreal2 = $('#smokingreal2');
  if (smokingx === true){
  redstyles(smokingreal1); greenstyles(smokingreal2);
  }
  
  var alcoholreal1 = $('#alcoholreal1'); var alcoholreal2 = $('#alcoholreal2');
  if (alcoholx === true){
  redstyles_aboveline(alcoholreal1); greenstyles_aboveline(alcoholreal2);
  }//aboveline
  
  
  /*Final year questions:*/
  
  var dizzinessreal1 = $('#dizzinessreal1'); var dizzinessreal2 = $('#dizzinessreal2');
  if (dizzinessx === true){
  redstyles(dizzinessreal1); greenstyles(dizzinessreal2);
  }

  var feverreal1 = $('#feverreal1'); var feverreal2 = $('#feverreal2');
  if (feverx === true){
  redstyles(feverreal1); greenstyles(feverreal2);
  }

  var weightreal1 = $('#weightreal1'); var weightreal2 = $('#weightreal2');
  if (weightx === true){
  redstyles(weightreal1); greenstyles(weightreal2);
  }

  var appetitereal1 = $('#appetitereal1'); var appetitereal2 = $('#appetitereal2');
  if (appetitex === true){
  redstyles(appetitereal1); greenstyles(appetitereal2);
  }
  
  var jaundicereal1 = $('#jaundicereal1'); var jaundicereal2 = $('#jaundicereal2');
  if (jaundicex === true){
  redstyles(jaundicereal1); greenstyles(jaundicereal2);
  }
  
  var darkurinereal1 = $('#darkurinereal1'); var darkurinereal2 = $('#darkurinereal2');
  if (darkurinex === true){
  redstyles(darkurinereal1); greenstyles(darkurinereal2);
  }
  
  var nauseareal1 = $('#nauseareal1'); var nauseareal2 = $('#nauseareal2');
  if (nauseax === true){
  redstyles(nauseareal1); greenstyles(nauseareal2);
  }
  
  var backpainreal1 = $('#backpainreal1'); var backpainreal2 = $('#backpainreal2');
  if (backpainx === true){
  redstyles(backpainreal1); greenstyles(backpainreal2);
  }
  
  var shouldertipreal1 = $('#shouldertipreal1'); var shouldertipreal2 = $('#shouldertipreal2');
  if (shouldertipx === true){
  redstyles(shouldertipreal1); greenstyles(shouldertipreal2);
  }
  
  var steatorrhoeareal1 = $('#steatorrhoeareal1'); var steatorrhoeareal2 = $('#steatorrhoeareal2');
  if (steatorrhoeax === true){
  redstyles(steatorrhoeareal1); greenstyles(steatorrhoeareal2);
  }
  
  var bloatingreal1 = $('#bloatingreal1'); var bloatingreal2 = $('#bloatingreal2');
  if (bloatingx === true){
  redstyles(bloatingreal1); greenstyles(bloatingreal2);
  }
    
  var itchingreal1 = $('#itchingreal1'); var itchingreal2 = $('#itchingreal2');
  if (itchingx === true){
  redstyles(itchingreal1); greenstyles(itchingreal2);
  }
  
  var prevgallreal1 = $('#prevgallreal1'); var prevgallreal2 = $('#prevgallreal2');
  if (prevgallx === true){
  redstyles(prevgallreal1); greenstyles(prevgallreal2);
  }
   
  
  

  
  
  function redstyles(element){
    element.css({'visibility': 'hidden','border-bottom':'none','border-top':'none'});}
  
  function greenstyles(element){
    element.css({'visibility': 'visible','border-bottom':'1px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
  
  function redstyles_aboveline(element){
    element.css({'visibility': 'hidden','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'none'});}
    
  function greenstyles_aboveline(element){
    element.css({'visibility': 'visible','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  //var painlocationreal1 = document.querySelectorAll('#customers #painlocationreal td:nth-child(2)');
  //var painlocationreal2 = document.querySelectorAll('#customers #painlocationreal td:nth-child(3)');
  //painlocationreal1.css('display: none');
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
         
  
  
  
       /*
  var painlocationtest = $('#painlocationtest'); var painlocationtest1 = $('#painlocationtest1');
          if (painlocationx === true){
          painlocationtest.css('color', 'rgb(209, 228, 236)');
          painlocationtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('painlocationtest-comment').style.display = 'none';
          //document.getElementById('painlocationtest-comment2').style.display = 'none';
          $('#painlocationtest-comment').css('color', 'rgb(209, 228, 236)');
          $('#painlocationtest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxpainlocation = $('#colorbox-painlocation');  colorboxpainlocation.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-painlocation-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxpainlocation = $('#correct-colorbox-painlocation');  correctcolorboxpainlocation.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-painlocation-before').css('background-color', 'rgb(197, 244, 197)');
        }
  */
        var onsettest = $('#onsettest'); var onsettest1 = $('#onsettest1');
          if (onsetx === true){
          onsettest.css('color', 'rgb(209, 228, 236)');
          onsettest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('onsettest-comment').style.display = 'none';
          //document.getElementById('onsettest-comment2').style.display = 'none';
          $('#onsettest-comment').css('color', 'rgb(209, 228, 236)');
          $('#onsettest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxonset = $('#colorbox-onset');  colorboxonset.css('background-color', 'rgb(209, 228, 236)');
                      $('#colorbox-onset-before').css('background-color', 'rgb(209, 228, 236)');
                        var correctcolorboxonset = $('#correct-colorbox-onset');  correctcolorboxonset.css('background-color', 'rgb(197, 244, 197)');
                      $('#correct-colorbox-onset-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var charactertest = $('#charactertest'); var charactertest1 = $('#charactertest1');
          if (characterx === true){
          charactertest.css('color', 'rgb(209, 228, 236)');
          charactertest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('charactertest-comment').style.display = 'none';
          //document.getElementById('charactertest-comment2').style.display = 'none';
          $('#charactertest-comment').css('color', 'rgb(209, 228, 236)');
          $('#charactertest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxcharacter = $('#colorbox-character');  colorboxcharacter.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-character-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxcharacter = $('#correct-colorbox-character');  correctcolorboxcharacter.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-character-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var timecoursetest = $('#timecoursetest'); var timecoursetest1 = $('#timecoursetest1');
          if (timecoursex === true){
          timecoursetest.css('color', 'rgb(209, 228, 236)');
          timecoursetest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('timecoursetest-comment').style.display = 'none';
          //document.getElementById('timecoursetest-comment2').style.display = 'none';
          $('#timecoursetest-comment').css('color', 'rgb(209, 228, 236)');
          $('#timecoursetest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxtimecourse = $('#colorbox-timecourse');  colorboxtimecourse.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-timecourse-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxtimecourse = $('#correct-colorbox-timecourse');  correctcolorboxtimecourse.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-timecourse-before').css('background-color', 'rgb(197, 244, 197)');
        }
       
        var radiatetest = $('#radiatetest'); var radiatetest1 = $('#radiatetest1');
        if (radiatex === true){
          radiatetest.css('color', 'rgb(209, 228, 236)');
          radiatetest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('radiatetest-comment').style.display = 'none';
          //document.getElementById('radiatetest-comment2').style.display = 'none';
          $('#radiatetest-comment').css('color', 'rgb(209, 228, 236)');
          $('#radiatetest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxradiate = $('#colorbox-radiate');  colorboxradiate.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-radiate-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxradiate = $('#correct-colorbox-radiate');  correctcolorboxradiate.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-radiate-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var associatedsymptomstest = $('#associatedsymptomstest'); var associatedsymptomstest1 = $('#associatedsymptomstest1');
        if (associatedsymptomsx === true){
          associatedsymptomstest.css('color', 'rgb(209, 228, 236)');
          associatedsymptomstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('associatedsymptomstest-comment').style.display = 'none';
          //document.getElementById('associatedsymptomstest-comment2').style.display = 'none';
          $('#associatedsymptomstest-comment').css('color', 'rgb(209, 228, 236)');
          $('#associatedsymptomstest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxassociatedsymptoms = $('#colorbox-associatedsymptoms');  colorboxassociatedsymptoms.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-associatedsymptoms-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxassociatedsymptoms = $('#correct-colorbox-associatedsymptoms');  correctcolorboxassociatedsymptoms.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-associatedsymptoms-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var makeitworsetest = $('#makeitworsetest'); var makeitworsetest1 = $('#makeitworsetest1');
        if (makeitworsex === true){
          makeitworsetest.css('color', 'rgb(209, 228, 236)');
          makeitworsetest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('makeitworsetest-comment').style.display = 'none';
          //document.getElementById('makeitworsetest-comment2').style.display = 'none';
          $('#makeitworsetest-comment').css('color', 'rgb(209, 228, 236)');
          $('#makeitworsetest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxmakeitworse = $('#colorbox-makeitworse');  colorboxmakeitworse.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-makeitworse-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxmakeitworse = $('#correct-colorbox-makeitworse');  correctcolorboxmakeitworse.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-makeitworse-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var makeitbettertest = $('#makeitbettertest'); var makeitbettertest1 = $('#makeitbettertest1');
        if (makeitbetterx === true){
          makeitbettertest.css('color', 'rgb(209, 228, 236)');
          makeitbettertest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('makeitbettertest-comment').style.display = 'none';
          //document.getElementById('makeitbettertest-comment2').style.display = 'none';
          $('#makeitbettertest-comment').css('color', 'rgb(209, 228, 236)');
          $('#makeitbettertest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxmakeitbetter = $('#colorbox-makeitbetter');  colorboxmakeitbetter.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-makeitbetter-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxmakeitbetter = $('#correct-colorbox-makeitbetter');  correctcolorboxmakeitbetter.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-makeitbetter-before').css('background-color', 'rgb(197, 244, 197)');
        }
        
        var ratepaintest = $('#ratepaintest'); var ratepaintest1 = $('#ratepaintest1');
        if (ratepainx === true){
          ratepaintest.css('color', 'rgb(209, 228, 236)');
          ratepaintest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('ratepaintest-comment').style.display = 'none';
          //document.getElementById('ratepaintest-comment2').style.display = 'none';
          $('#ratepaintest-comment').css('color', 'rgb(209, 228, 236)');
          $('#ratepaintest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxratepain = $('#colorbox-ratepain');  colorboxratepain.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-ratepain-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxratepain = $('#correct-colorbox-ratepain');  correctcolorboxratepain.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-ratepain-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var happenbeforetest = $('#happenbeforetest'); var happenbeforetest1 = $('#happenbeforetest1');
        if (happenbeforex === true){
          happenbeforetest.css('color', 'rgb(209, 228, 236)');
          happenbeforetest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('happenbeforetest-comment').style.display = 'none';
          //document.getElementById('happenbeforetest-comment2').style.display = 'none';
          $('#happenbeforetest-comment').css('color', 'rgb(209, 228, 236)');
          $('#happenbeforetest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxhappenbefore = $('#colorbox-happenbefore');  colorboxhappenbefore.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-happenbefore-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxhappenbefore = $('#correct-colorbox-happenbefore');  correctcolorboxhappenbefore.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-happenbefore-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
  
  
  
  
  
  
  /**/
       
       
        var ideastest = $('#ideastest');  var ideastest1 = $('#ideastest1');
        if (ideasx === true){
          ideastest.css('color', 'rgb(209, 228, 236)');
          ideastest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('ideastest-comment').style.display = 'none';
          //document.getElementById('ideastest-comment2').style.display = 'none';
          $('#ideastest-comment').css('color', 'rgb(209, 228, 236)');
          $('#ideastest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxideas = $('#colorbox-ideas');  colorboxideas.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-ideas-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxideas = $('#correct-colorbox-ideas');  correctcolorboxideas.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-ideas-before').css('background-color', 'rgb(197, 244, 197)');
                    }
  
   
        var concernstest = $('#concernstest'); var concernstest1 = $('#concernstest1');
        if (concernsx === true){
          concernstest.css('color', 'rgb(209, 228, 236)');
          concernstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxconcerns = $('#colorbox-concerns');  colorboxconcerns.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-concerns-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxconcerns = $('#correct-colorbox-concerns');  correctcolorboxconcerns.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-concerns-before').css('background-color', 'rgb(197, 244, 197)');
                    }
  
  
        var expectationstest = $('#expectationstest'); var expectationstest1 = $('#expectationstest1');
        if (expectationsx === true){
          expectationstest.css('color', 'rgb(209, 228, 236)');
          expectationstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('expectationstest-comment').style.display = 'none';
          //document.getElementById('expectationstest-comment2').style.display = 'none';
          $('#expectationstest-comment').css('color', 'rgb(209, 228, 236)');
          $('#expectationstest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxexpectations = $('#colorbox-expectations');  colorboxexpectations.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-expectations-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxexpectations = $('#correct-colorbox-expectations');  correctcolorboxexpectations.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-expectations-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var familyhistorytest = $('#familyhistorytest'); var familyhistorytest1 = $('#familyhistorytest1');
        if (familyhistoryx === true){
          familyhistorytest.css('color', 'rgb(209, 228, 236)');
          familyhistorytest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxfamilyhistory = $('#colorbox-familyhistory');  colorboxfamilyhistory.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-familyhistory-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxfamilyhistory = $('#correct-colorbox-familyhistory');  correctcolorboxfamilyhistory.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-familyhistory-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var pmhtest = $('#pmhtest'); var pmhtest1 = $('#pmhtest1');
        if (pmhx === true){
          pmhtest.css('color', 'rgb(209, 228, 236)');
          pmhtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxpmh = $('#colorbox-pmh');  colorboxpmh.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-pmh-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxpmh = $('#correct-colorbox-pmh');  correctcolorboxpmh.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-pmh-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var surgicaltest = $('#surgicaltest'); var surgicaltest1 = $('#surgicaltest1');
        if (surgicalx === true){
          surgicaltest.css('color', 'rgb(209, 228, 236)');
          surgicaltest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxsurgical = $('#colorbox-surgical');  colorboxsurgical.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-surgical-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxsurgical = $('#correct-colorbox-surgical');  correctcolorboxsurgical.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-surgical-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var medstest = $('#medstest'); var medstest1 = $('#medstest1');
        if (medsx === true){
          medstest.css('color', 'rgb(209, 228, 236)');
          medstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxmeds = $('#colorbox-meds');  colorboxmeds.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-meds-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxmeds = $('#correct-colorbox-meds');  correctcolorboxmeds.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-meds-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var allergiestest = $('#allergiestest'); var allergiestest1 = $('#allergiestest1');
        if (allergiesx === true){
          allergiestest.css('color', 'rgb(209, 228, 236)');
          allergiestest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxallergies = $('#colorbox-allergies');  colorboxallergies.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-allergies-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxallergies = $('#correct-colorbox-allergies');  correctcolorboxallergies.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-allergies-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
  /**/
  
        var jobtest = $('#jobtest'); var jobtest1 = $('#jobtest1');
        if (jobx === true){
          jobtest.css('color', 'rgb(209, 228, 236)');
          jobtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                        var colorboxjob = $('#colorbox-job');  colorboxjob.css('background-color', 'rgb(209, 228, 236)');
                      $('#colorbox-job-before').css('background-color', 'rgb(209, 228, 236)');
                        var correctcolorboxjob = $('#correct-colorbox-job');  correctcolorboxjob.css('background-color', 'rgb(197, 244, 197)');
                      $('#correct-colorbox-job-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var walkdistancetest = $('#walkdistancetest'); var walkdistancetest1 = $('#walkdistancetest1');
        if (walkdistancex === true){
          walkdistancetest.css('color', 'rgb(209, 228, 236)');
          walkdistancetest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxwalkdistance = $('#colorbox-walkdistance');  colorboxwalkdistance.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-walkdistance-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxwalkdistance = $('#correct-colorbox-walkdistance');  correctcolorboxwalkdistance.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-walkdistance-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var homesituationtest = $('#homesituationtest'); var homesituationtest1 = $('#homesituationtest1');
        if (homesituationx === true){
          homesituationtest.css('color', 'rgb(209, 228, 236)');
          homesituationtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          //document.getElementById('homesituationtest-comment').style.display = 'none';
          //document.getElementById('homesituationtest-comment2').style.display = 'none';
          $('#homesituationtest-comment').css('color', 'rgb(209, 228, 236)');
          $('#homesituationtest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxhomesituation = $('#colorbox-homesituation');  colorboxhomesituation.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-homesituation-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxhomesituation = $('#correct-colorbox-homesituation');  correctcolorboxhomesituation.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-homesituation-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var smokingtest = $('#smokingtest'); var smokingtest1 = $('#smokingtest1');
        if (smokingx === true){
          smokingtest.css('color', 'rgb(209, 228, 236)');
          smokingtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxsmoking = $('#colorbox-smoking');  colorboxsmoking.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-smoking-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxsmoking = $('#correct-colorbox-smoking');  correctcolorboxsmoking.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-smoking-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var alcoholtest = $('#alcoholtest'); var alcoholtest1 = $('#alcoholtest1');
        if (alcoholx === true){
          alcoholtest.css('color', 'rgb(209, 228, 236)');
          alcoholtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
                      var colorboxalcohol = $('#colorbox-alcohol');  colorboxalcohol.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-alcohol-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxalcohol = $('#correct-colorbox-alcohol');  correctcolorboxalcohol.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-alcohol-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
  
  
  /*important not to miss*/
  
  
        var dyspnoeatest = $('#dyspnoeatest'); var dyspnoeatest1 = $('#dyspnoeatest1');
        if (dyspnoeax === true){
          dyspnoeatest.css('color', 'rgb(209, 228, 236)');
          dyspnoeatest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#dyspnoeatest-comment').css('color', 'rgb(209, 228, 236)');
          $('#dyspnoeatest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxdyspnoea = $('#colorbox-dyspnoea');  colorboxdyspnoea.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-dyspnoea-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxdyspnoea = $('#correct-colorbox-dyspnoea');  correctcolorboxdyspnoea.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-dyspnoea-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var orthopnoeatest = $('#orthopnoeatest'); var orthopnoeatest1 = $('#orthopnoeatest1');
        if (orthopnoeax === true){
          orthopnoeatest.css('color', 'rgb(209, 228, 236)');
          orthopnoeatest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#orthopnoeatest-comment').css('color', 'rgb(209, 228, 236)');
          $('#orthopnoeatest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxorthopnoea = $('#colorbox-orthopnoea');  colorboxorthopnoea.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-orthopnoea-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxorthopnoea = $('#correct-colorbox-orthopnoea');  correctcolorboxorthopnoea.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-orthopnoea-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var pndtest = $('#pndtest'); var pndtest1 = $('#pndtest1');
        if (pndx === true){
          pndtest.css('color', 'rgb(209, 228, 236)');
          pndtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#pndtest-comment').css('color', 'rgb(209, 228, 236)');
          $('#pndtest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxpnd = $('#colorbox-pnd');  colorboxpnd.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-pnd-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxpnd = $('#correct-colorbox-pnd');  correctcolorboxpnd.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-pnd-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var coughtest = $('#coughtest'); var coughtest1 = $('#coughtest1');
        if (coughx === true){
          coughtest.css('color', 'rgb(209, 228, 236)');
          coughtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#coughtest-comment').css('color', 'rgb(209, 228, 236)');
          $('#coughtest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxcough = $('#colorbox-cough');  colorboxcough.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-cough-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxcough = $('#correct-colorbox-cough');  correctcolorboxcough.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-cough-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var FHheartconditionstest = $('#FHheartconditionstest'); var FHheartconditionstest1 = $('#FHheartconditionstest1');
        if (FHheartconditionsx === true){
          FHheartconditionstest.css('color', 'rgb(209, 228, 236)');
          FHheartconditionstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#FHheartconditionstest-comment').css('color', 'rgb(209, 228, 236)');
          $('#FHheartconditionstest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxFHheartconditions = $('#colorbox-FHheartconditions');  colorboxFHheartconditions.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-FHheartconditions-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxFHheartconditions = $('#correct-colorbox-FHheartconditions');  correctcolorboxFHheartconditions.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-FHheartconditions-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var diabetestest = $('#diabetestest'); var diabetestest1 = $('#diabetestest1');
        if (diabetesx === true){
          diabetestest.css('color', 'rgb(209, 228, 236)');
          diabetestest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#diabetestest-comment').css('color', 'rgb(209, 228, 236)');
          $('#diabetestest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxdiabetes = $('#colorbox-diabetes');  colorboxdiabetes.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-diabetes-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxdiabetes = $('#correct-colorbox-diabetes');  correctcolorboxdiabetes.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-diabetes-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var hypertensiontest = $('#hypertensiontest'); var hypertensiontest1 = $('#hypertensiontest1');
        if (hypertensionx === true){
          hypertensiontest.css('color', 'rgb(209, 228, 236)');
          hypertensiontest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#hypertensiontest-comment').css('color', 'rgb(209, 228, 236)');
          $('#hypertensiontest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxhypertension = $('#colorbox-hypertension');  colorboxhypertension.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-hypertension-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxhypertension = $('#correct-colorbox-hypertension');  correctcolorboxhypertension.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-hypertension-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var heartattackstest = $('#heartattackstest'); var heartattackstest1 = $('#heartattackstest1');
        if (heartattacksx === true){
          heartattackstest.css('color', 'rgb(209, 228, 236)');
          heartattackstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#heartattackstest-comment').css('color', 'rgb(209, 228, 236)');
          $('#heartattackstest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxheartattacks = $('#colorbox-heartattacks');  colorboxheartattacks.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-heartattacks-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxheartattacks = $('#correct-colorbox-heartattacks');  correctcolorboxheartattacks.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-heartattacks-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var dizzinesstest = $('#dizzinesstest'); var dizzinesstest1 = $('#dizzinesstest1');
        if (dizzinessx === true){
          dizzinesstest.css('color', 'rgb(209, 228, 236)');
          dizzinesstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#dizzinesstest-comment').css('color', 'rgb(209, 228, 236)');
          $('#dizzinesstest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxdizziness = $('#colorbox-dizziness');  colorboxdizziness.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-dizziness-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxdizziness = $('#correct-colorbox-dizziness');  correctcolorboxdizziness.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-dizziness-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var physicalactivitytest = $('#physicalactivitytest'); var physicalactivitytest1 = $('#physicalactivitytest1');
        if (physicalactivityx === true){
          physicalactivitytest.css('color', 'rgb(209, 228, 236)');
          physicalactivitytest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#physicalactivitytest-comment').css('color', 'rgb(209, 228, 236)');
          $('#physicalactivitytest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxphysicalactivity = $('#colorbox-physicalactivity');  colorboxphysicalactivity.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-physicalactivity-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxphysicalactivity = $('#correct-colorbox-physicalactivity');  correctcolorboxphysicalactivity.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-physicalactivity-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var palpitationstest = $('#padtest'); var palpitationstest1 = $('#palpitationstest1');
        if (palpitationsx === true){
          palpitationstest.css('color', 'rgb(209, 228, 236)');
          palpitationstest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#palpitationstest-comment').css('color', 'rgb(209, 228, 236)');
          $('#palpitationstest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxpalpitations = $('#colorbox-palpitations');  colorboxpalpitations.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-palpitations-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxpalpitations = $('#correct-colorbox-palpitations');  correctcolorboxpalpitations.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-palpitations-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
  /*Stand out*/
  
        var sleepapnoeatest = $('#sleepapnoeatest'); var sleepapnoeatest1 = $('#sleepapnoeatest1');
        if (sleepapnoeax === true){
          sleepapnoeatest.css('color', 'rgb(209, 228, 236)');
          sleepapnoeatest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#sleepapnoeatest-comment').css('color', 'rgb(209, 228, 236)');
          $('#sleepapnoeatest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxsleepapnoea = $('#colorbox-sleepapnoea');  colorboxsleepapnoea.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-sleepapnoea-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxsleepapnoea = $('#correct-colorbox-sleepapnoea');  correctcolorboxsleepapnoea.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-sleepapnoea-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var padtest = $('#padtest'); var padtest1 = $('#padtest1');
        if (padx === true){
          padtest.css('color', 'rgb(209, 228, 236)');
          padtest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#padtest-comment').css('color', 'rgb(209, 228, 236)');
          $('#padtest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxpad = $('#colorbox-pad');  colorboxpad.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-pad-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxpad = $('#correct-colorbox-pad');  correctcolorboxpad.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-pad-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var fevertest = $('#fevertest'); var fevertest1 = $('#fevertest1');
        if (feverx === true){
          fevertest.css('color', 'rgb(209, 228, 236)');
          fevertest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#fevertest-comment').css('color', 'rgb(209, 228, 236)');
          $('#fevertest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxfever = $('#colorbox-fever');  colorboxfever.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-fever-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxfever = $('#correct-colorbox-fever');  correctcolorboxfever.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-fever-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var weighttest = $('#weighttest'); var weighttest1 = $('#weighttest1');
        if (weightx === true){
          weighttest.css('color', 'rgb(209, 228, 236)');
          weighttest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#weighttest-comment').css('color', 'rgb(209, 228, 236)');
          $('#weighttest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxweight = $('#colorbox-weight');  colorboxweight.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-weight-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxweight = $('#correct-colorbox-weight');  correctcolorboxweight.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-weight-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
        var oedematest = $('#oedematest'); var oedematest1 = $('#oedematest1');
        if (oedemax === true){
          oedematest.css('color', 'rgb(209, 228, 236)');
          oedematest1.css('color', 'rgb(0, 0, 0)');
          generalhistorycounter++
          $('#oedematest-comment').css('color', 'rgb(209, 228, 236)');
          $('#oedematest-comment2').css('color', 'rgb(0, 0, 0)');
                      var colorboxoedema = $('#colorbox-oedema');  colorboxoedema.css('background-color', 'rgb(209, 228, 236)');
                    $('#colorbox-oedema-before').css('background-color', 'rgb(209, 228, 236)');
                      var correctcolorboxoedema = $('#correct-colorbox-oedema');  correctcolorboxoedema.css('background-color', 'rgb(197, 244, 197)');
                    $('#correct-colorbox-oedema-before').css('background-color', 'rgb(197, 244, 197)');
        }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  //out of 23
  
       var generalhistorygrade = $('#generalhistorygrade');
       
       if (generalhistorycounter ===23){
       generalhistorygrade.text('Grade = A** Perfect!')}
  
      else if (generalhistorycounter ===22||generalhistorycounter ===21||generalhistorycounter ===20||generalhistorycounter ===19){
          generalhistorygrade.text('Grade = A*, Excellent work!')}
  
      else if (generalhistorycounter ===18||generalhistorycounter ===17||generalhistorycounter ===16||generalhistorycounter ===15){
         generalhistorygrade.text('Grade = A, Well done!')}
  
      
         else if (generalhistorycounter ===14||generalhistorycounter ===13||generalhistorycounter ===12||generalhistorycounter ===11){
          generalhistorygrade.text('Grade = B, Keep at it!')}
  
          else if (generalhistorycounter ===10||generalhistorycounter ===9||generalhistorycounter ===8||generalhistorycounter ===7){
            generalhistorygrade.text('Grade = C')}
  
            else if (generalhistorycounter ===6||generalhistorycounter ===5||generalhistorycounter ===4||generalhistorycounter ===3
              ||generalhistorycounter ===2||generalhistorycounter ===1||generalhistorycounter ===0){
              generalhistorygrade.text('Grade = D')}
  
  
  
  
  
      // Reset variables and update UI.
      noteContent = '';
      renderNotes(getAllNotes());
      noteTextarea.val('');
      //instructions.text('Press the Start Recognition button to ask another question. Then press Submit question.');
   
  
  
  
  
  
  
  
  
  
    
              }
   
  
  
  
  
  
  /*--------------------Is for bringing up the 'listening icon/microphone icon once the user accepts the use of the mic-------------- */
  
    let micisworking = document.getElementById('micisworking');//THIS IS NOT NEEDED FOR THE MIC TO WORK!!!!!!!!!!!
  
    
  recognition.onstart = function() {
    micisworking.style.display = 'unset';
    messagebeforeacceptingmic.style.display = 'none';
  


  //for the video without speaking WHILST THE MIC IS ON ssssssssssss
const inbetweenVideo = document.getElementById('inbetweenVideo'); inbetweenVideo.style.display = 'block';
document.getElementById("inbetweenmp4_src").src = "videos/silentvideo.mp4"; inbetweenVideo.load();
inbetweenVideo.onloadedmetadata = () => {
  inbetweenVideo.muted = true;  inbetweenVideo.loop = true;  inbetweenVideo.play();
};
           


            if (counterforpresssubmitprompt==0){
              initialpromptforpresssubmit.style.display = 'unset';
              counterforpresssubmitprompt++;
            }
  }
  
  
  
  
  
  
  recognition.onend= function () {
    micisworking.style.display = 'none';
    //micisworking.style.backgroundColor = 'red';

          if (actionTriggered == false && silentmsg == false){
          pauseBtn.click(); 
          silentmsg = false;
          document.getElementById('silencemessage').style.display = 'unset';
          pauseBtn.style.display = "none";
        }
  
  
  
  }; 
  //&& !pauseBtn.click
  
  
  
  
  
  
  
  
  
  
  
  
  /*
  let slideIndex1 = 0;
  showSlides1();
  
  function showSlides1() {
    let b;
    let slides1 = document.getElementsByClassName("mySlides1");
    let dots1 = document.getElementsByClassName("dot1");
    for (b = 0; b < slides1.length; b++) {
      slides1[b].style.display = "none";  
    }
    slideIndex1++;
    if (slideIndex1 > slides1.length) {slideIndex1 = 1}    
    for (b = 0; b < dots1.length; b++) {
      dots1[b].className = dots1[b].className.replace(" active", "");
    }
    slides1[slideIndex1-1].style.display = "block";  
    dots1[slideIndex1-1].className += " active";
    setTimeout(showSlides1, 2000); // Change image every 2 seconds
  }*/
   //#endregion
  
  
  
  
  /*-------------------------------------for the 3 lines of the nav bar when it goes to phone-----*/
  
   function myFunction() {
    var x = document.getElementById("myLinks");
    
    if (x.style.display === "block") {
      x.style.display = "none";
      
      document.getElementById("title").style.display = "block";
      document.getElementById("title1").style.display = "block";
      document.getElementById("title2").style.display = "block";
    } else {
      x.style.display = "block";
      
    document.getElementById("title").style.display = "none";
    document.getElementById("title1").style.display = "none";
    document.getElementById("title2").style.display = "none";
    }
  }
  
  
  
   
  
  /*----------------------------------SLIDESHOW IN REVIEW SECTION----------------------------------*/
  
  let slideIndex = 1;
  showSlides(slideIndex);
  
  function plusSlides(n) {
    showSlides(slideIndex += n);
            window.scrollTo({
              top: 0,
              behavior: 'smooth' // Optional: makes the scroll smooth
            });
  }
  
  function currentSlide(n) {
    showSlides(slideIndex = n);
              window.scrollTo({
                top: 0,
                behavior: 'smooth' // Optional: makes the scroll smooth
              });
  }
  
  function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
  }
  
  
  
  
  
  
  
  
  
  
  
  
  /*----------TUTORIAL SECTION----------*/
  
  // Get the modal
  var modal = document.getElementById("myModal");
  
  // Get the image and insert it inside the modal - use its "alt" text as a caption
  var img = document.getElementById("myImg");
  var modalImg = document.getElementById("img01");
  /*var captionText = document.getElementById("caption");*/
  img.onclick = function(){
    modal.style.display = "block";
    modalImg.src = this.src;
    /*captionText.innerHTML = this.alt;*/
    modalImg.play();
  }
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    modalImg.src = this.src;
    modalImg.stop();
  }
  
  
  
  
  
  
  
  
  
   
  
  
  
  
  
  
  
   
  
  
   
  
  
  /*-----------------------------
        FOR THE PRESSING OF ENTER KEY!!!!!!
  ------------------------------*/
  /*----
  addEventListener("keypress", function(event) {
    if (event.key === "z") {
      event.preventDefault();
      document.getElementById("start-record-btn").click();
    }
  });
  --*/
  
  
  //var input = document.getElementById("start-record-btn");
  //input.
  addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn").click();
    }
  });
  
  var input = document.getElementById("note-textarea");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn").click();
    }
  });
  
  
  /*-----------------------------
        App buttons and input
  ------------------------------*/
  
  
  
  
  
  
  
  
  
  
  $('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
      noteContent += ' ';
    }
    recognition.start();
  });
   
   
  //$('#pause-record-btn').on('click', function(e) {
    //recognition.stop();
    //instructions.text('Voice recognition paused.');
  //});
   
  // Sync the text inside the text area with the noteContent variable.
  noteTextarea.on('input', function() {
    noteContent = $(this).val();
  })
   
  
  
  
  
  
  
  
  //async function stopRecording() {
  $('#save-note-btn').on('click', function(e) {
  }
    //this is where you put the "IF statements for the noteContent in"
  )
    //}//end of while loop called counter
    
  
    
    
  
  
     
  
  
  
  
  
  
  
  
  
  notesList.on('click', function(e) {
    e.preventDefault();
    var target = $(e.target);
   
    // Listen to the selected note.
    if(target.hasClass('listen-note')) {
      var content = target.closest('.note').find('.content').text();
  
  
  
      if(content.includes("name") && content.includes("age")) {
        readOutLoud("My name is Marc Jevner and I am 31")
        
      }
  
  
  
    
    
   
  
  
  
  
  
  
  
  
  
  
  
    }
    // Delete note.
    if(target.hasClass('delete-note')) {
      var dateTime = target.siblings('.date').text();  
      deleteNote(dateTime);
      target.closest('.note').remove();
    }
  
  });
   
   
   
  
  
  
  
  /*
  //ELEVENLABS////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function speak() {         //https://github.com/bh679/ElevenLabs-Javascript-Example/blob/main/FrontEndOnly/index.html
      
    const text11L = "free";
    const voiceId = 'nsQAxyXwUKBvqtEK9MfK';
    const apiKey = 'XX';
  
  
    const headers = new Headers();
    headers.append('Accept', 'audio/mpeg');
    headers.append('xi-api-key', apiKey);
    headers.append('Content-Type', 'application/json');
  
    const body = JSON.stringify({
        text: text11L,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
        }
    });
  
    fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
        method: 'POST',
        headers: headers,
        body: body
    })
    .then(response => {
        if (response.ok) {
            return response.blob();
        } 
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();        //audio.onended = () => { status.innerText += '\nAudio has finished playing!';  };
    })
  }
  
  //END OF ELEVENLABS//////////////////////////////////////////////////////////////////////////////////////
  */
  
  
  
  
  
  
  
  
  
  /*-----------------------------
        Speech Synthesis
  ------------------------------*/
   
  function readOutLoud(message) {
  var speech = new SpeechSynthesisUtterance();
   
    // Set the text and voice attributes.
  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 0.8;
    
  window.speechSynthesis.onvoiceschanged = function() {
    var voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find(voice => voice.name === 'Microsoft David Desktop');//these don't work
  
    window.speechSynthesis.speak(speech);//don't delete this!!!!
  };
  }
   
   
   
  /*-----------------------------
        Helper Functions
  ------------------------------*/
   
  function renderNotes(notes) {
    var html = '';
    
    if(notes.length) {
      notes.forEach(function(note) {
        html+= `<li class="note">
                  
                  
                  
          <p class="header"> </p>
          <p class="content">${note.content + "?"}
          <br>
          <span class="date"><font size="-2">${note.date}</font></span> 
          <a href="#" class="listen-note" title="Listen to Note">Listen to the patient's response...</a>
          <a href="#" class="delete-note" title="Delete">Delete Question</a>
              <hr>
            </p>
            
          </li>`;   
     
      });
    }
    else {
      html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
    }
    notesList.html(html);
  }
   
   
  function saveNote(dateTime, content) {
    localStorage.setItem('note-' + dateTime, content);
  }
   
   
  function getAllNotes() {
    var notes = [];
    var key;
    for (var i = 0; i < localStorage.length; i++) {
      key = localStorage.key(i);
      console.log(i)
      console.log(key)
   
      if(key.substring(0,5) == 'note-') {
        notes.push({
          date: key.replace('note-',''),
          content: localStorage.getItem(localStorage.key(i))
        });
      }
    }
    console.log(notes)
    return notes;
  }
   
   
  function deleteNote(dateTime) {
    localStorage.removeItem('note-' + dateTime);
  }
  
  
  
  
  
  
  
  
  
  
  /*-----------------------------
          Examinations
   ------------------------------*/
   let examinations_silence = false;

  
   try {
    var SpeechRecognition_examinations = window.SpeechRecognition_examinations || window.webkitSpeechRecognition;
    var recognition_examinations = new SpeechRecognition_examinations();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  var noteexaminations = 'N/A';
  var examinationsContent = '';
  var examinationstextarea = $('#examinations-textarea');
  
   
  recognition_examinations.continuous = true;
  var silenceTimer_examinations = null;
  recognition_examinations.onresult = function(event) {
    if (silenceTimer_examinations) {
      clearTimeout(silenceTimer_examinations);
      silenceTimer_examinations = null;
    }
  
    var current_examinations = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript_examinations = event.results[current_examinations][0].transcript;
   
    var mobileRepeatBug_examinations = (current_examinations == 1 && transcript_examinations == event.results[0][0].transcript_examinations);
   
    if(!mobileRepeatBug_examinations) {
  
      if (noteexaminations === 'N/A') {
        noteexaminations = '';
      }
  
      noteexaminations += transcript_examinations;
      examinationstextarea.val(noteexaminations);
    }
    silenceTimer_examinations = setTimeout(function() {
  
  
  
    }, 1000);
  
  };
  
  
  $('#start-record-btn-for-examinations').on('click', function(e) {
    if (examinationsContent.length) {
      examinationsContent += ' ';
    }
    recognition_examinations.start();
    examinations_silence = false;
    
  
    
    
    
  
  
  
  
  
  
  
  
  
  
    });
  
    examinationstextarea.on('input', function() {
    noteexaminations = $(this).val();
    })
  
  
  
  $('#save-note-btn-for-examinations,#move-onto-questions-btn_examinations').on('click', function(e) {
  recognition_examinations.stop();
  examinations_silence = true;
  
  
  
  
  
  
  
  
  
  
  
    setTimeout(function() {
  
      var recordinginstructionsforexaminations = $('#recording-instructions-for-examinations');
      recognition_examinations.onspeechend = function() {
      recordinginstructionsforexaminations.text(noteexaminations);//IMPORTANT DO NOT DELETE!!!!
    }
  
    saveNote(new Date().toLocaleString(), noteexaminations);  
  
  
    var examinationsfinal = $('#examinationsfinal');
    examinationsfinal.text(noteexaminations);
    $('#examinationsfinal1').html($('#examinationsfinal').html());
  
  
  
  
  
  
  //mark your examination
  var cardioexamx = false;
  if(noteexaminations.includes("abdo")||examinationsfinal.includes("tumm")||examinationsfinal.includes("stomach")){ 
    cardioexamx = true;
  }
  
  
  var cardioexamreal1 = $('#cardioexamreal1'); var cardioexamreal2 = $('#cardioexamreal2');
  if (cardioexamx === true){
  redstyles_aboveline(cardioexamreal1); greenstyles_aboveline(cardioexamreal2);
  }
  
  
  
  function redstyles(element){
    element.css({'visibility': 'hidden'});}
  
  function greenstyles(element){
    element.css({'visibility': 'visible','border-bottom':'1px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
    function redstyles_aboveline(element){
      element.css({'visibility': 'hidden','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'none'});}
      
    function greenstyles_aboveline(element){
      element.css({'visibility': 'visible','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
    
  
  
  
  }, 2000);
  
  
  document.getElementById('examinations').style.display = 'none';
    document.getElementById('summary').style.display = 'unset';
  
    recognition_examinations.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/summary.mp4"; document.getElementById("myVideo").load(); document.getElementById("myVideo").muted = false;
    document.getElementById('myVideo').onended = function(e) {
    recognition1.start();     document.getElementById('messagebeforeacceptingmic_summary').style.display = 'unset'; 
    document.getElementById('save-note-btn-for-summary').style.display = 'unset';     
    }
    
  
  }
  )
  
  /*--------------------Is for bringing up the 'listening icon/microphone icon once the user accepts the use of the mic-------------- */
  
  let micisworkingexaminations = document.getElementById('micisworkingexaminations');//THIS IS NOT NEEDED FOR THE MIC TO WORK!!!!!!!!!!!
  recognition_examinations.onstart = function() {
      micisworkingexaminations.style.display = 'unset';
      document.getElementById('messagebeforeacceptingmic_examinations').style.display = 'none';
    }
  
  
  
  
  /*------enterkey     !!!!!!!!!!!!!THESE NEXT 2 PARAGRAPHS DO NOTHING!!!!!!!*/
  let greg_examinations = 0;
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && micisworkingexaminations.style.display === 'unset' && greg_examinations==0) {//&& myVideo.ended  
      document.getElementById("save-note-btn-for-examinations").click(); greg_examinations++; examinations_silence = false;
      }   });
  
  
  
  
  
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
  $('#examinations-textarea').focus();
  
  $(document).on('keydown', function() {
    $('#examinations-textarea').focus();
  });
  });
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
recognition_examinations.onend= function (){
  if (examinations_silence == false){
    recognition_examinations.start()
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  /*-----------------------------
          Summary
   ------------------------------*/
  var summary_silence = false;
  
   try {
    var SpeechRecognition1 = window.SpeechRecognition1 || window.webkitSpeechRecognition;
    var recognition1 = new SpeechRecognition1();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  var noteSummary = 'N/A';
  var summaryContent = '';
  var summarytextarea = $('#summary-textarea');
    
  recognition1.continuous = true;
  var silenceTimer1 = null;
  recognition1.onresult = function(event) {
    if (silenceTimer1) {
      clearTimeout(silenceTimer1);
      silenceTimer1 = null;
    }
   
    var current1 = event.resultIndex;
   
  // Get a transcript of what was said.
  var transcript1 = event.results[current1][0].transcript;
   
  var mobileRepeatBug1 = (current1 == 1 && transcript1 == event.results[0][0].transcript1);
  
  if(!mobileRepeatBug1) {
  
    if (noteSummary === 'N/A') {
      noteSummary = '';
    }
  
    noteSummary += transcript1;
    summarytextarea.val(noteSummary);
  }
  silenceTimer1 = setTimeout(function() {
  
  
  
    }, 1000);
  };
   
  
  $('#start-record-btn-for-summary').on('click', function(e) {
    if (summaryContent.length) {
      summaryContent += ' ';
    }
    recognition1.start();
    summary_silence = false;
    });
  
    summarytextarea.on('input', function() {
      noteSummary = $(this).val();
      })
  
  $('#save-note-btn-for-summary,#move-onto-questions-btn_summary').on('click', function(e) {
    recognition1.stop();
    summary_silence = true;
    
  
    setTimeout(function() {
  
      var recordinginstructionsforsummary = $('#recording-instructions-for-summary');
      recognition1.onspeechend = function() {
      recordinginstructionsforsummary.text(noteSummary);//IMPORTANT DO NOT DELETE!!!!
    }
  
    saveNote(new Date().toLocaleString(), noteSummary);
    
  
    var summaryfinal = $('#summaryfinal');
    summaryfinal.text(noteSummary.toLowerCase());
    summaryreview = noteSummary.toLowerCase();
    $('#summaryfinal1').html($('#summaryfinal').html());
  
    
  
   
  
  
  
  
  
    var age_summaryx = false;
    if(summaryreview.includes("old")||summaryreview.includes("year")||summaryreview.includes("thirty")||summaryreview.includes("3")||summaryreview.includes("thirty")){ 
      age_summaryx = true;
    }
  
    var gender_summaryx = false;
    if(summaryreview.includes("male")||summaryreview.includes("man")||summaryreview.includes("boy")){ 
      gender_summaryx = true;
    }
  
    var description_summaryx = false;
    if(summaryreview.includes("elephant")||summaryreview.includes("heavy")||summaryreview.includes("press")||summaryreview.includes("intense")){ 
      description_summaryx = true;
    }
  
    var duration_summaryx = false;
    if(summaryreview.includes("day")||summaryreview.includes("morning")||summaryreview.includes("recent")||summaryreview.includes("week")||summaryreview.includes("month")||summaryreview.includes("hour")||summaryreview.includes("min")||summaryreview.includes("second")){ 
      duration_summaryx = true;
    }
  
    var accompanyingSx_summaryx = false;
    if(summaryreview.includes("associate")||summaryreview.includes("cough")||summaryreview.includes("palpitation")||summaryreview.includes("vomi")||summaryreview.includes("sick")||summaryreview.includes("naus")||summaryreview.includes("short")||summaryreview.includes("sympto")||summaryreview.includes("heart")||summaryreview.includes("weight")){ 
      accompanyingSx_summaryx = true;
    }
  
    var betterworse_summaryx = false;
    if(summaryreview.includes("better")||summaryreview.includes("worse")||summaryreview.includes("improve")||summaryreview.includes("paracetamol")||summaryreview.includes("pain relief")||summaryreview.includes("analgesia")){ 
      betterworse_summaryx = true;
    }
  
  //////////////////////////////////////////////////////
  
  
    var age_summaryreal1 = $('#age_summaryreal1'); var age_summaryreal2 = $('#age_summaryreal2');
  if (age_summaryx === true){
  redstyles(age_summaryreal1); greenstyles(age_summaryreal2);
  }
  
  var gender_summaryreal1 = $('#gender_summaryreal1'); var gender_summaryreal2 = $('#gender_summaryreal2');
  if (gender_summaryx === true){
  redstyles(gender_summaryreal1); greenstyles(gender_summaryreal2);
  }
  
  var description_summaryreal1 = $('#description_summaryreal1'); var description_summaryreal2 = $('#description_summaryreal2');
  if (description_summaryx === true){
  redstyles(description_summaryreal1); greenstyles(description_summaryreal2);
  }
  
  var duration_summaryreal1 = $('#duration_summaryreal1'); var duration_summaryreal2 = $('#duration_summaryreal2');
  if (duration_summaryx === true){
  redstyles(duration_summaryreal1); greenstyles(duration_summaryreal2);
  }
  
  var accompanyingSx_summaryreal1 = $('#accompanyingSx_summaryreal1'); var accompanyingSx_summaryreal2 = $('#accompanyingSx_summaryreal2');
  if (accompanyingSx_summaryx === true){
  redstyles(accompanyingSx_summaryreal1); greenstyles(accompanyingSx_summaryreal2);
  }
  
  var betterworse_summaryreal1 = $('#betterworse_summaryreal1'); var betterworse_summaryreal2 = $('#betterworse_summaryreal2');
  if (betterworse_summaryx === true){
  redstyles_aboveline(betterworse_summaryreal1); greenstyles_aboveline(betterworse_summaryreal2);
  }//aboveline
  
  
  
  
  function redstyles(element){
    element.css({'visibility': 'hidden','border-bottom':'none','border-top':'none'});}
  
  function greenstyles(element){
    element.css({'visibility': 'visible','border-bottom':'1px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
    function redstyles_aboveline(element){
      element.css({'visibility': 'hidden','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'none'});}
      
    function greenstyles_aboveline(element){
      element.css({'visibility': 'visible','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
    
  
  
  
  
  
  }, 2000);
  
  
  document.getElementById('summary').style.display = 'none';
    document.getElementById('differentials').style.display = 'unset';
  
    recognition1.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
     document.getElementById("mp4_src").src = "videos/differential.mp4"; document.getElementById("myVideo").load(); document.getElementById("myVideo").muted = false;
    document.getElementById('myVideo').onended = function(e) {
      recognition_differentials.start();     document.getElementById('messagebeforeacceptingmic_differentials').style.display = 'unset';
    document.getElementById('save-note-btn-for-differentials').style.display = 'unset'; 
    }
  
  
  }
  )
  
  
  
  
  let micisworkingsummary = document.getElementById('micisworkingsummary');//THIS IS NOT NEEDED FOR THE MIC TO WORK!!!!!!!!!!!
  recognition1.onstart = function() {
      micisworkingsummary.style.display = 'unset';
      document.getElementById('messagebeforeacceptingmic_summary').style.display = 'none';
    
    
    }
  
  /*------enterkey*/
  let greg_summary = 0;
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && micisworkingsummary.style.display === 'unset' && greg_summary==0) {  
      document.getElementById("save-note-btn-for-summary").click(); greg_summary++; summary_silence = false;
      }   });
  
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
  $('#summary-textarea').focus();
  
  $(document).on('keydown', function() {
    $('#summary-textarea').focus();
  });
  });
  
  
  
  
  
  
  
  
  
  
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
recognition1.onend= function (){
  if (summary_silence == false){
    recognition1.start()
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  
  /*-----------------------------
          Differentials
   ------------------------------*/
  var differentials_silence = false;
  
   try {
    var SpeechRecognition_differentials = window.SpeechRecognition_differentials || window.webkitSpeechRecognition;
    var recognition_differentials = new SpeechRecognition_differentials();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  var noteDifferentials = 'N/A';
  var differentialsContent = '';
  var differentialstextarea = $('#differentials-textarea');
  
   
  recognition_differentials.continuous = true;
  var silenceTimer_differentials = null;
  recognition_differentials.onresult = function(event) {
    if (silenceTimer_differentials) {
      clearTimeout(silenceTimer_differentials);
      silenceTimer_differentials = null;
    }
  
    var current_differentials = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript_differentials = event.results[current_differentials][0].transcript;
   
    var mobileRepeatBug_differentials = (current_differentials == 1 && transcript_differentials == event.results[0][0].transcript_differentials);
   
    if(!mobileRepeatBug_differentials) {
  
      if (noteDifferentials === 'N/A') {
        noteDifferentials = '';
      }
  
      noteDifferentials += transcript_differentials;
      differentialstextarea.val(noteDifferentials);
    }
    silenceTimer_differentials = setTimeout(function() {
  
  
  
    }, 1000);
  
  };
  
  
  $('#start-record-btn-for-differentials').on('click', function(e) {
    if (differentialsContent.length) {
      differentialsContent += ' ';
    }
    recognition_differentials.start();
    differentials_silence = false;
    });
  
    differentialstextarea.on('input', function() {
    noteDifferentials = $(this).val();
    })
  
  
  
  $('#save-note-btn-for-differentials,#move-onto-questions-btn_differentials').on('click', function(e) {
  recognition_differentials.stop();
  differentials_silence = true;
  
  
    setTimeout(function() {
  
      var recordinginstructionsfordifferentials = $('#recording-instructions-for-differentials');
      recognition_differentials.onspeechend = function() {
      recordinginstructionsfordifferentials.text(noteDifferentials);//IMPORTANT DO NOT DELETE!!!!
    }
  
    saveNote(new Date().toLocaleString(), noteDifferentials);
    
  
    var differentialsfinal = $('#differentialsfinal');
    differentialsfinal.text(noteDifferentials);
    differentialsfinal = noteDifferentials.toLowerCase();
    $('#differentialsfinal1').html($('#differentialsfinal').html());
  
  
  
  
  
  
  
    var gallstones_differentialsx = false;
    if(differentialsfinal.includes("gall")||differentialsfinal.includes("stone")||differentialsfinal.includes("cystitis")||differentialsfinal.includes("bladder")||differentialsfinal.includes("gitis")){ 
      gallstones_differentialsx = true;
  
    }
  
    var pancreatitis_differentialsx = false;
    if(differentialsfinal.includes("pan")){ 
      pancreatitis_differentialsx = true;
    }
  
    var hepatitis_differentialsx = false;
    if(differentialsfinal.includes("hepa")||differentialsfinal.includes("liver")||differentialsfinal.includes("cir")){ 
      hepatitis_differentialsx = true;
    }
    
    var gastroenteritis_differentialsx = false;
    if(differentialsfinal.includes("gastro")||differentialsfinal.includes("enteritis")||differentialsfinal.includes("poison")||!differentialsfinal.includes("gastro oesop")||!differentialsfinal.includes("gastro eso")){ 
      gastroenteritis_differentialsx = true;
    }
  
    var gord_differentialsx = false;
    if(differentialsfinal.includes("gord")||differentialsfinal.includes("gastro oesop")||differentialsfinal.includes("reflux")||differentialsfinal.includes("heart burn")||differentialsfinal.includes("heartburn")||differentialsfinal.includes("gerd")){ 
      gord_differentialsx = true;
    }
    
   
    
  //////////////////////////////////////////////////////
  
  var gallstones_differentialsreal1 = $('#gallstones_differentialsreal1'); var gallstones_differentialsreal2 = $('#gallstones_differentialsreal2');
  if (gallstones_differentialsx === true){
  redstyles(gallstones_differentialsreal1); greenstyles(gallstones_differentialsreal2);
  }
  
  var pancreatitis_differentialsreal1 = $('#pancreatitis_differentialsreal1'); var pancreatitis_differentialsreal2 = $('#pancreatitis_differentialsreal2');
  if (pancreatitis_differentialsx === true){
  redstyles(pancreatitis_differentialsreal1); greenstyles(pancreatitis_differentialsreal2);
  }
  
  var hepatitis_differentialsreal1 = $('#hepatitis_differentialsreal1'); var hepatitis_differentialsreal2 = $('#hepatitis_differentialsreal2');
  if (hepatitis_differentialsx === true){
  redstyles_aboveline(hepatitis_differentialsreal1); greenstyles_aboveline(hepatitis_differentialsreal2);
  }//aboveline
  
  var gastroenteritis_differentialsreal1 = $('#gastroenteritis_differentialsreal1'); var gastroenteritis_differentialsreal2 = $('#gastroenteritis_differentialsreal2');
  if (gastroenteritis_differentialsx === true){
  redstyles(gastroenteritis_differentialsreal1); greenstyles(gastroenteritis_differentialsreal2);
  }
  
  var gord_differentialsreal1 = $('#gord_differentialsreal1'); var gord_differentialsreal2 = $('#gord_differentialsreal2');
  if (gord_differentialsx === true){
  redstyles(gord_differentialsreal1); greenstyles(gord_differentialsreal2);
  }
  
 
  
  
  
  
  function redstyles(element){
    element.css({'visibility': 'hidden'});}
  
  function greenstyles(element){
    element.css({'visibility': 'visible','border-bottom':'1px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
  function redstyles_aboveline(element){
    element.css({'visibility': 'hidden','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'none'});}
    
  function greenstyles_aboveline(element){
    element.css({'visibility': 'visible','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
  
  
  
  }, 2000);
  
  
   document.getElementById('differentials').style.display = 'none';
    document.getElementById('investigations').style.display = 'unset';
  
    recognition_differentials.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/investigations.mp4"; document.getElementById("myVideo").load(); document.getElementById("myVideo").muted = false;
    document.getElementById('myVideo').onended = function(e) {
    recognition_investigations.start();     document.getElementById('messagebeforeacceptingmic_investigations').style.display = 'unset';
    document.getElementById('save-note-btn-for-investigations').style.display = 'unset';
    }
  
  }
  )
  
  
  
  
  
  
  
  let micisworkingdifferentials = document.getElementById('micisworkingdifferentials');//THIS IS NOT NEEDED FOR THE MIC TO WORK!!!!!!!!!!!
  recognition_differentials.onstart = function() {
      micisworkingdifferentials.style.display = 'unset';
      document.getElementById('messagebeforeacceptingmic_differentials').style.display = 'none';
    }
  
  
  /*------enterkey*/
  let greg_differentials = 0;
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && micisworkingdifferentials.style.display == 'unset' && greg_differentials==0) {  
      document.getElementById("save-note-btn-for-differentials").click(); greg_differentials++; differentials_silence = false;
      }   });
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
  $('#differentials-textarea').focus();
  
  $(document).on('keydown', function() {
    $('#differentials-textarea').focus();
  });
  });
  
  
  
  
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
recognition_differentials.onend= function (){
  if (differentials_silence == false){
    recognition_differentials.start()
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  
  
  
  /*-----------------------------
          Investigations
   ------------------------------*/
  var investigations_silence = false;
  
   try {
    var SpeechRecognition_investigations = window.SpeechRecognition_investigations || window.webkitSpeechRecognition;
    var recognition_investigations = new SpeechRecognition_investigations();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  var noteinvestigations = 'N/A';
  var investigationsContent = '';
  var investigationstextarea = $('#investigations-textarea');
  
   
  recognition_investigations.continuous = true;
  var silenceTimer_investigations = null;
  recognition_investigations.onresult = function(event) {
    if (silenceTimer_investigations) {
      clearTimeout(silenceTimer_investigations);
      silenceTimer_investigations = null;
    }
  
    var current_investigations = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript_investigations = event.results[current_investigations][0].transcript;
   
    var mobileRepeatBug_investigations = (current_investigations == 1 && transcript_investigations == event.results[0][0].transcript_investigations);
   
    if(!mobileRepeatBug_investigations) {
  
      if (noteinvestigations === 'N/A') {
        noteinvestigations = '';
      }
  
      noteinvestigations += transcript_investigations;
      investigationstextarea.val(noteinvestigations);
    }
    silenceTimer_investigations = setTimeout(function() {
  
  
  
    }, 1000);
  
  };
  
  
  $('#start-record-btn-for-investigation').on('click', function(e) {
    if (investigationsContent.length) {
      investigationsContent += ' ';
    }
    recognition_investigations.start();
    investigations_silence = false;
    });
  
    investigationstextarea.on('input', function() {
    noteinvestigations = $(this).val();
    })
  
  
  
  $('#save-note-btn-for-investigations,#move-onto-questions-btn_investigations').on('click', function(e) {
  recognition_investigations.stop();
  investigations_silence = true;
  
  
    setTimeout(function() {
  
      var recordinginstructionsforinvestigations = $('#recording-instructions-for-investigations');
      recognition_investigations.onspeechend = function() {
      recordinginstructionsforinvestigations.text(noteinvestigations);//IMPORTANT DO NOT DELETE!!!!
    }
    saveNote(new Date().toLocaleString(), noteinvestigations);
    
    var investigationsfinal = $('#investigationsfinal');
    investigationsfinal.text(noteinvestigations);
    investigationsfinal = noteinvestigations.toLowerCase();
    $('#investigationsfinal1').html($('#investigationsfinal').html());
  
  
  
  
    var bedsideobs_investigationsx = false;
    if(investigationsfinal.includes("temp")||investigationsfinal.includes("bed")||investigationsfinal.includes("side")||investigationsfinal.includes("obs")||investigationsfinal.includes("respiratory")||investigationsfinal.includes("rate")||investigationsfinal.includes("glucose")||investigationsfinal.includes("blood pressure")||investigationsfinal.includes("tachy")){ 
      bedsideobs_investigationsx = true;
    }

    var urinalysis_investigationsx = false;
    if(investigationsfinal.includes("urin")||investigationsfinal.includes("dip")||investigationsfinal.includes("mc")||investigationsfinal.includes("empty")){ 
      urinalysis_investigationsx = true;
    }

    var ecg_investigationsx = false;
    if(investigationsfinal.includes("electro")||investigationsfinal.includes("ecg")||investigationsfinal.includes("gram")||investigationsfinal.includes("cardio")){ 
      ecg_investigationsx = true;
    }
  
  
    var vbg_investigationsx = false;
    if(investigationsfinal.includes("gas")||investigationsfinal.includes("venous")||investigationsfinal.includes("arter")){ 
      vbg_investigationsx = true;
    }
    
    var culture_investigationsx = false;
    if(investigationsfinal.includes("culture")){ 
      culture_investigationsx = true;
    }
  
    var lft_investigationsx = false;
    if(investigationsfinal.includes("lft")||investigationsfinal.includes("liver")||investigationsfinal.includes("function")||investigationsfinal.includes("bili")){ 
      lft_investigationsx = true;
    }

    var amylase_investigationsx = false;
    if(investigationsfinal.includes("amylase")||investigationsfinal.includes("lip")||investigationsfinal.includes("enzyme")||investigationsfinal.includes("pancreatic")){ 
      amylase_investigationsx = true;
    }

    var normalbloods_investigationsx = false;
    if(investigationsfinal.includes("blood")||investigationsfinal.includes("fbc")||investigationsfinal.includes("full")||investigationsfinal.includes("urea")||investigationsfinal.includes("crp")||investigationsfinal.includes("esr")||investigationsfinal.includes("haem")||investigationsfinal.includes("hb")||investigationsfinal.includes("white cell")||investigationsfinal.includes("wcc")){ 
      normalbloods_investigationsx = true;
    }
  
    var special_investigationsx = false;
    if(investigationsfinal.includes("hep")||investigationsfinal.includes("itis")||investigationsfinal.includes("ana")||investigationsfinal.includes("ama")||investigationsfinal.includes("anti")||investigationsfinal.includes("immunog")||investigationsfinal.includes("igg")||investigationsfinal.includes("igm")||investigationsfinal.includes("hcv")||investigationsfinal.includes("antibod")||investigationsfinal.includes("liver screen")){ 
      special_investigationsx = true;
    }
    
    var abdoUSS_investigationsx = false;
    if(investigationsfinal.includes("abdo")||investigationsfinal.includes("ultra")||investigationsfinal.includes("sound")){ 
      abdoUSS_investigationsx = true;
    }
  
    var CT_investigationsx = false;
    if(investigationsfinal.includes("ct")||investigationsfinal.includes("see")||investigationsfinal.includes("computer")||investigationsfinal.includes("topo")||investigationsfinal.includes("tea")||investigationsfinal.includes("sea")){ 
      CT_investigationsx = true;
    }
  
    var MRCP_investigationsx = false;
    if(investigationsfinal.includes("cp")||investigationsfinal.includes("magnet")||investigationsfinal.includes("resonan")||investigationsfinal.includes("cholang")||investigationsfinal.includes("tography")||investigationsfinal.includes("endosc")||investigationsfinal.includes("retro")||investigationsfinal.includes("pee")||investigationsfinal.includes("pea")){ 
      MRCP_investigationsx = true;
    }
  //////////////////////////////////////////////////////
  
  var bedsideobs_investigationsreal1 = $('#bedsideobs_investigationsreal1'); var bedsideobs_investigationsreal2 = $('#bedsideobs_investigationsreal2');
  if (bedsideobs_investigationsx === true){
  redstyles(bedsideobs_investigationsreal1); greenstyles(bedsideobs_investigationsreal2);
  }
  
  var urinalysis_investigationsreal1 = $('#urinalysis_investigationsreal1'); var urinalysis_investigationsreal2 = $('#urinalysis_investigationsreal2');
  if (urinalysis_investigationsx === true){
  redstyles(urinalysis_investigationsreal1); greenstyles(urinalysis_investigationsreal2);
  }
  
  var ecg_investigationsreal1 = $('#ecg_investigationsreal1'); var ecg_investigationsreal2 = $('#ecg_investigationsreal2');
  if (ecg_investigationsx === true){
  redstyles(ecg_investigationsreal1); greenstyles(ecg_investigationsreal2);
  }
    
  var vbg_investigationsreal1 = $('#vbg_investigationsreal1'); var vbg_investigationsreal2 = $('#vbg_investigationsreal2');
  if (vbg_investigationsx === true){
  redstyles(vbg_investigationsreal1); greenstyles(vbg_investigationsreal2);
  }
  
  var culture_investigationsreal1 = $('#culture_investigationsreal1'); var culture_investigationsreal2 = $('#culture_investigationsreal2');
  if (culture_investigationsx === true){
  redstyles(culture_investigationsreal1); greenstyles(culture_investigationsreal2);
  }
  
  var lft_investigationsreal1 = $('#lft_investigationsreal1'); var lft_investigationsreal2 = $('#lft_investigationsreal2');
  if (lft_investigationsx === true){
  redstyles(lft_investigationsreal1); greenstyles(lft_investigationsreal2);
  }

  var amylase_investigationsreal1 = $('#amylase_investigationsreal1'); var amylase_investigationsreal2 = $('#amylase_investigationsreal2');
  if (amylase_investigationsx === true){
  redstyles(amylase_investigationsreal1); greenstyles(amylase_investigationsreal2);
  }

  var normalbloods_investigationsreal1 = $('#normalbloods_investigationsreal1'); var normalbloods_investigationsreal2 = $('#normalbloods_investigationsreal2');
  if (normalbloods_investigationsx === true){
  redstyles(normalbloods_investigationsreal1); greenstyles(normalbloods_investigationsreal2);
  }
  
  var special_investigationsreal1 = $('#special_investigationsreal1'); var special_investigationsreal2 = $('#special_investigationsreal2');
  if (special_investigationsx === true){
  redstyles_aboveline(special_investigationsreal1); greenstyles_aboveline(special_investigationsreal2);
  }

  var abdoUSS_investigationsreal1 = $('#abdoUSS_investigationsreal1'); var abdoUSS_investigationsreal2 = $('#abdoUSS_investigationsreal2');
  if (abdoUSS_investigationsx === true){
  redstyles_aboveline(abdoUSS_investigationsreal1); greenstyles_aboveline(abdoUSS_investigationsreal2);
  }

  var CT_investigationsreal1 = $('#CT_investigationsreal1'); var CT_investigationsreal2 = $('#CT_investigationsreal2');
  if (CT_investigationsx === true){
  redstyles_aboveline(CT_investigationsreal1); greenstyles_aboveline(CT_investigationsreal2);
  }

  var MRCP_investigationsreal1 = $('#MRCP_investigationsreal1'); var MRCP_investigationsreal2 = $('#MRCP_investigationsreal2');
  if (MRCP_investigationsx === true){
  redstyles_aboveline(MRCP_investigationsreal1); greenstyles_aboveline(MRCP_investigationsreal2);
  }
  
  
  
  function redstyles(element){
    element.css({'visibility': 'hidden'});}
  
  function greenstyles(element){
    element.css({'visibility': 'visible','border-bottom':'1px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
  function redstyles_aboveline(element){
    element.css({'visibility': 'hidden','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'none'});}
      
  function greenstyles_aboveline(element){
    element.css({'visibility': 'visible','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
    
  
  
  
  }, 2000);
  
  
   document.getElementById('investigations').style.display = 'none';
    document.getElementById('riskfactors').style.display = 'unset';
  
    recognition_investigations.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/riskfactors.mp4"; document.getElementById("myVideo").load(); document.getElementById("myVideo").muted = false;
    document.getElementById('myVideo').onended = function(e) {
    recognition_riskfactors.start();     document.getElementById('messagebeforeacceptingmic_riskfactors').style.display = 'unset';
    document.getElementById('save-note-btn-for-riskfactors').style.display = 'unset';
    }
  
  }
  )
  
  
  
  
  
  
  
  let micisworkinginvestigations = document.getElementById('micisworkinginvestigations');//THIS IS NOT NEEDED FOR THE MIC TO WORK!!!!!!!!!!!
  recognition_investigations.onstart = function() {
      micisworkinginvestigations.style.display = 'unset';
      document.getElementById('messagebeforeacceptingmic_investigations').style.display = 'none';
    }
  
  /*------enterkey*/
  let greg_investigations = 0;
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && micisworkinginvestigations.style.display == 'unset' && greg_investigations==0) {  
      document.getElementById("save-note-btn-for-investigations").click(); greg_investigations++; investigations_silence = false;
      }   });
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
  $('#investigations-textarea').focus();
  
  $(document).on('keydown', function() {
    $('#investigations-textarea').focus();
  });
  });
  
  
  
  
  
  
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
recognition_investigations.onend= function (){
  if (investigations_silence == false){
    recognition_investigations.start()
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  
  /*-----------------------------
          Riskfactors
   ------------------------------*/
  var riskfactors_silence = false;
  
   try {
    var SpeechRecognition_riskfactors = window.SpeechRecognition_riskfactors || window.webkitSpeechRecognition;
    var recognition_riskfactors = new SpeechRecognition_riskfactors();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  var noteriskfactors = 'N/A';
  var riskfactorsContent = '';
  var riskfactorstextarea = $('#riskfactors-textarea');
  
   
  recognition_riskfactors.continuous = true;
  var silenceTimer_riskfactors = null;
  recognition_riskfactors.onresult = function(event) {
    if (silenceTimer_riskfactors) {
      clearTimeout(silenceTimer_riskfactors);
      silenceTimer_riskfactors = null;
    }
  
    var current_riskfactors = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript_riskfactors = event.results[current_riskfactors][0].transcript;
   
    var mobileRepeatBug_riskfactors = (current_riskfactors == 1 && transcript_riskfactors == event.results[0][0].transcript_riskfactors);
   
    if(!mobileRepeatBug_riskfactors) {
  
      if (noteriskfactors === 'N/A') {
        noteriskfactors = '';  // Reset it to an empty string before appending new content
      }
  
      noteriskfactors += transcript_riskfactors;
      riskfactorstextarea.val(noteriskfactors);
    }
    silenceTimer_riskfactors = setTimeout(function() {
  
  
  
    }, 1000);
  
  };
  
  
  $('#start-record-btn-for-riskfactors').on('click', function(e) {
    if (riskfactorsContent.length) {
      riskfactorsContent += ' ';
    }
    recognition_riskfactors.start();
    riskfactors_silence = false;
    });
  
    riskfactorstextarea.on('input', function() {
    noteriskfactors = $(this).val();
    })
  
    
  $('#save-note-btn-for-riskfactors,#move-onto-questions-btn_riskfactors').on('click', function(e) {
  recognition_riskfactors.stop();
  riskfactors_silence = true;
  
  
    setTimeout(function() {
  
      var recordinginstructionsforriskfactors = $('#recording-instructions-for-riskfactors');
      recognition_riskfactors.onspeechend = function() {
      recordinginstructionsforriskfactors.text(noteriskfactors);//IMPORTANT DO NOT DELETE!!!!
    }
  
    saveNote(new Date().toLocaleString(), noteriskfactors);
    
  
    var riskfactorsfinal = $('#riskfactorsfinal');
    riskfactorsfinal.text(noteriskfactors);
    riskfactorsfinal = noteriskfactors.toLowerCase();
    $('#riskfactorsfinal1').html($('#riskfactorsfinal').html());
  
  
  
  
  
  
    var age_riskfactorsx = false;
    if(riskfactorsfinal.includes("age")||riskfactorsfinal.includes("old")||riskfactorsfinal.includes("year")){ 
      age_riskfactorsx = true;
    }
  
    var FH_riskfactorsx = false;
    if(riskfactorsfinal.includes("famil")){ 
      FH_riskfactorsx = true;
    }
  
    var ethnicity_riskfactorsx = false;
    if(riskfactorsfinal.includes("ethnic")||riskfactorsfinal.includes("background")||riskfactorsfinal.includes("ancestry")||riskfactorsfinal.includes("rac")||riskfactorsfinal.includes("origin")||riskfactorsfinal.includes("asian")||riskfactorsfinal.includes("india")||riskfactorsfinal.includes("bangla")||riskfactorsfinal.includes("pak")||
    (riskfactorsfinal.includes("from")&&riskfactorsfinal.includes("where"))){ 
      ethnicity_riskfactorsx = true;
    }
  
    var sex_riskfactorsx = false;
    if(riskfactorsfinal.includes("sex")||riskfactorsfinal.includes("gender")||riskfactorsfinal.includes("male")){ 
      sex_riskfactorsx = true;
    }
  
    var highcholesterol_riskfactorsx = false;
    if(riskfactorsfinal.includes("cholesterol")||riskfactorsfinal.includes("chol")||riskfactorsfinal.includes("col")||riskfactorsfinal.includes("lipid")||riskfactorsfinal.includes("lipo")||riskfactorsfinal.includes("athero")){ 
      highcholesterol_riskfactorsx = true;
    }
  
    var obesity_riskfactorsx = false;
  if(riskfactorsfinal.includes("fat")||riskfactorsfinal.includes("obesity")||riskfactorsfinal.includes("bmi")||riskfactorsfinal.includes("body mass")||riskfactorsfinal.includes("index")||riskfactorsfinal.includes("weight")||riskfactorsfinal.includes("obes")){ 
      obesity_riskfactorsx = true;
    }
  
    var unhealthydiet_riskfactorsx = false;
    if(riskfactorsfinal.includes("diet")||riskfactorsfinal.includes("food")||riskfactorsfinal.includes("eat")||riskfactorsfinal.includes("nutritio")||riskfactorsfinal.includes("calo")){ 
      unhealthydiet_riskfactorsx = true;
    }
  
  
  //////////////////////////////////////////////////////
  
  var age_riskfactorsreal1 = $('#age_riskfactorsreal1'); var age_riskfactorsreal2 = $('#age_riskfactorsreal2');
  if (age_riskfactorsx === true){
  redstyles(age_riskfactorsreal1); greenstyles(age_riskfactorsreal2);
  }
  
  var FH_riskfactorsreal1 = $('#FH_riskfactorsreal1'); var FH_riskfactorsreal2 = $('#FH_riskfactorsreal2');
  if (FH_riskfactorsx === true){
  redstyles(FH_riskfactorsreal1); greenstyles(FH_riskfactorsreal2);
  }
  
  var ethnicity_riskfactorsreal1 = $('#ethnicity_riskfactorsreal1'); var ethnicity_riskfactorsreal2 = $('#ethnicity_riskfactorsreal2');
  if (ethnicity_riskfactorsx === true){
  redstyles(ethnicity_riskfactorsreal1); greenstyles(ethnicity_riskfactorsreal2);
  }
  
  var sex_riskfactorsreal1 = $('#sex_riskfactorsreal1'); var sex_riskfactorsreal2 = $('#sex_riskfactorsreal2');
  if (sex_riskfactorsx === true){
  redstyles(sex_riskfactorsreal1); greenstyles(sex_riskfactorsreal2);
  }
  
  var highcholesterol_riskfactorsreal1 = $('#highcholesterol_riskfactorsreal1'); var highcholesterol_riskfactorsreal2 = $('#highcholesterol_riskfactorsreal2');
  if (highcholesterol_riskfactorsx === true){
  redstyles(highcholesterol_riskfactorsreal1); greenstyles(highcholesterol_riskfactorsreal2);
  }
  
  var obesity_riskfactorsreal1 = $('#obesity_riskfactorsreal1'); var obesity_riskfactorsreal2 = $('#obesity_riskfactorsreal2');
  if (obesity_riskfactorsx === true){
  redstyles(obesity_riskfactorsreal1); greenstyles(obesity_riskfactorsreal2);
  }
  
  var unhealthydiet_riskfactorsreal1 = $('#unhealthydiet_riskfactorsreal1'); var unhealthydiet_riskfactorsreal2 = $('#unhealthydiet_riskfactorsreal2');
  if (unhealthydiet_riskfactorsx === true){
  redstyles(unhealthydiet_riskfactorsreal1); greenstyles(unhealthydiet_riskfactorsreal2);
  }

  
  function redstyles(element){
    element.css({'visibility': 'hidden'});}
  
  function greenstyles(element){
    element.css({'visibility': 'visible','border-bottom':'1px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
  function redstyles_aboveline(element){
    element.css({'visibility': 'hidden','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'none'});}
      
  function greenstyles_aboveline(element){
    element.css({'visibility': 'visible','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
    
  
  
  
  
  
  
  
  
  
  
  }, 2000);
  
  
   document.getElementById('riskfactors').style.display = 'none';
    document.getElementById('treatments').style.display = 'unset';
  
    recognition_riskfactors.stop();    document.getElementById('stop-consultation-btn').style.display = 'none';
    document.getElementById("mp4_src").src = "videos/management.mp4"; document.getElementById("myVideo").load(); document.getElementById("myVideo").muted = false;
    document.getElementById('myVideo').onended = function(e) {
    recognition_treatments.start();     document.getElementById('messagebeforeacceptingmic_treatments').style.display = 'unset';
    document.getElementById('save-note-btn-for-treatments').style.display = 'unset';
    }
  
  }
  )
  
  
  
  
  
  
  
  
  
  
  
  let micisworkingriskfactors = document.getElementById('micisworkingriskfactors');//THIS IS NOT NEEDED FOR THE MIC TO WORK!!!!!!!!!!!
  recognition_riskfactors.onstart = function() {
      micisworkingriskfactors.style.display = 'unset';
      document.getElementById('messagebeforeacceptingmic_riskfactors').style.display = 'none';
    }
  
  /*------enterkey*/
  let greg_riskfactors = 0;
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && micisworkingriskfactors.style.display == 'unset' && greg_riskfactors==0) {  
      document.getElementById("save-note-btn-for-riskfactors").click(); greg_riskfactors++; riskfactors_silence = false;
      }   });
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
  $('#riskfactors-textarea').focus();
  
  $(document).on('keydown', function() {
    $('#riskfactors-textarea').focus();
  });
  });
  
  
  
   
  
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
recognition_riskfactors.onend= function (){
  if (riskfactors_silence == false){
    recognition_riskfactors.start()
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  
  
  
  /*-----------------------------
          Treatments
   ------------------------------*/
  var treatments_silence = false;
  
   try {
    var SpeechRecognition_treatments = window.SpeechRecognition_treatments || window.webkitSpeechRecognition;
    var recognition_treatments = new SpeechRecognition_treatments();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  var notetreatments = 'N/A';
  
  
  var treatmentsContent = '';
  var treatmentstextarea = $('#treatments-textarea');
  
   
  recognition_treatments.continuous = true;
  var silenceTimer_treatments = null;
  recognition_treatments.onresult = function(event) {
    if (silenceTimer_treatments) {
      clearTimeout(silenceTimer_treatments);
      silenceTimer_treatments = null;
    }
  
    var current_treatments = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript_treatments = event.results[current_treatments][0].transcript;
   
    var mobileRepeatBug_treatments = (current_treatments == 1 && transcript_treatments == event.results[0][0].transcript_treatments);
   
    if(!mobileRepeatBug_treatments) {
  
      if (notetreatments === 'N/A') {
        notetreatments = '';  // Reset it to an empty string before appending new content
      }
  
      notetreatments += transcript_treatments;
      treatmentstextarea.val(notetreatments);
    }
    silenceTimer_treatments = setTimeout(function() {
  
  
  
    }, 1000);
  
  };
  
  
  $('#start-record-btn-for-treatments').on('click', function(e) {
    if (treatmentsContent.length) {
      treatmentsContent += ' ';
    }
    recognition_treatments.start();
    treatments_silence = false;
    });
  
    treatmentstextarea.on('input', function() {
    notetreatments = $(this).val();
    })
  
  
  
  $('#save-note-btn-for-treatments').on('click', function(e) {
  recognition_treatments.stop();
  treatments_silence = true;
  
    setTimeout(function() {
  
      var recordinginstructionsfortreatments = $('#recording-instructions-for-treatments');
      recognition_treatments.onspeechend = function() {
      recordinginstructionsfortreatments.text(notetreatments);//IMPORTANT DO NOT DELETE!!!!
    }
    saveNote(new Date().toLocaleString(), notetreatments);  
  
    var treatmentsfinal = $('#treatmentsfinal');
    treatmentsfinal.text(notetreatments);
  
  
  
  
    treatmentsfinal = notetreatments.toLowerCase();
    $('#treatmentsfinal1').html($('#treatmentsfinal').html());
  
    
  
  
  
  
  
    var analgesia_treatmentsx = false;
    if(treatmentsfinal.includes("analgesia")||treatmentsfinal.includes("paracet")||treatmentsfinal.includes("pain relief")||treatmentsfinal.includes("morph")||treatmentsfinal.includes("ibuprof")||treatmentsfinal.includes("cod")||treatmentsfinal.includes("edge")){ 
      analgesia_treatmentsx = true;
    }
  
    var fluids_treatmentsx = false;
    if(treatmentsfinal.includes("fluid")||treatmentsfinal.includes("iv")||treatmentsfinal.includes("intraven")||treatmentsfinal.includes("water")||treatmentsfinal.includes("oral")){ 
      fluids_treatmentsx = true;
    }
  
    var abx_treatmentsx = false;
    if(treatmentsfinal.includes("antib")||treatmentsfinal.includes("bacteria")||treatmentsfinal.includes("abx")){ 
      abx_treatmentsx = true;
    }
  
    var antiemetics_treatmentsx = false;
    if(treatmentsfinal.includes("emetic")||treatmentsfinal.includes("nausea")||treatmentsfinal.includes("vomit")||treatmentsfinal.includes("ondan")||treatmentsfinal.includes("cycl")||treatmentsfinal.includes("metha")||treatmentsfinal.includes("chlorper")){ 
      antiemetics_treatmentsx = true;
    }
  
    var cholecystectomy_treatmentsx = false;
    if(treatmentsfinal.includes("cystectomy")||treatmentsfinal.includes("surg")||treatmentsfinal.includes("remov")||treatmentsfinal.includes("gall bladder")){ 
      cholecystectomy_treatmentsx = true;
    }
  
    var ercp_treatmentsx = false;
    if(treatmentsfinal.includes("cp")||treatmentsfinal.includes("magnet")||treatmentsfinal.includes("resonan")||treatmentsfinal.includes("cholang")||treatmentsfinal.includes("tography")||treatmentsfinal.includes("endosc")||treatmentsfinal.includes("retro")||treatmentsfinal.includes("pee")||treatmentsfinal.includes("pea")){ 
      ercp_treatmentsx = true;
    }
  
    var cardiologyreferral_treatmentsx = false;
    if(treatmentsfinal.includes("refer")||treatmentsfinal.includes("admit")||treatmentsfinal.includes("hpb")||treatmentsfinal.includes("multi dis")||treatmentsfinal.includes("disciplin")||treatmentsfinal.includes("mdt")||treatmentsfinal.includes("hepato")||treatmentsfinal.includes("biliary team")||treatmentsfinal.includes("general surg")||treatmentsfinal.includes("gen surg")||treatmentsfinal.includes("speciali")||treatmentsfinal.includes("specialt")){ 
      cardiologyreferral_treatmentsx = true;
    }
  
    var lifestyle_treatmentsx = false;
    if(treatmentsfinal.includes("life")||treatmentsfinal.includes("routine")||treatmentsfinal.includes("habit")||treatmentsfinal.includes("health pract")||treatmentsfinal.includes("behav")||treatmentsfinal.includes("cultur")||treatmentsfinal.includes("exercise")||treatmentsfinal.includes("diet")||treatmentsfinal.includes("alcohol")||treatmentsfinal.includes("smok")||treatmentsfinal.includes("weight")){ 
      lifestyle_treatmentsx = true;
    }
  
    var udca_treatmentsx = false;
    if(treatmentsfinal.includes("urso")||treatmentsfinal.includes("deoxy")||treatmentsfinal.includes("lic acid")||treatmentsfinal.includes("udca")){ 
      udca_treatmentsx = true;
    }
    
  
  //////////////////////////////////////////////////////
  
  var analgesia_treatmentsreal1 = $('#analgesia_treatmentsreal1'); var analgesia_treatmentsreal2 = $('#analgesia_treatmentsreal2');
  if (analgesia_treatmentsx === true){
  redstyles(analgesia_treatmentsreal1); greenstyles(analgesia_treatmentsreal2);
  }
  
  var fluids_treatmentsreal1 = $('#fluids_treatmentsreal1'); var fluids_treatmentsreal2 = $('#fluids_treatmentsreal2');
  if (fluids_treatmentsx === true){
  redstyles(fluids_treatmentsreal1); greenstyles(fluids_treatmentsreal2);
  }
  
  var abx_treatmentsreal1 = $('#abx_treatmentsreal1'); var abx_treatmentsreal2 = $('#abx_treatmentsreal2');
  if (abx_treatmentsx === true){
  redstyles(abx_treatmentsreal1); greenstyles(abx_treatmentsreal2);
  }
  
  var antiemetics_treatmentsreal1 = $('#antiemetics_treatmentsreal1'); var antiemetics_treatmentsreal2 = $('#antiemetics_treatmentsreal2');
  if (antiemetics_treatmentsx === true){
  redstyles(antiemetics_treatmentsreal1); greenstyles(antiemetics_treatmentsreal2);
  }
  
  var cholecystectomy_treatmentsreal1 = $('#cholecystectomy_treatmentsreal1'); var cholecystectomy_treatmentsreal2 = $('#cholecystectomy_treatmentsreal2');
  if (cholecystectomy_treatmentsx === true){
  redstyles(cholecystectomy_treatmentsreal1); greenstyles(cholecystectomy_treatmentsreal2);
  }
  
  var ercp_treatmentsreal1 = $('#ercp_treatmentsreal1'); var ercp_treatmentsreal2 = $('#ercp_treatmentsreal2');
  if (ercp_treatmentsx === true){
  redstyles(ercp_treatmentsreal1); greenstyles(ercp_treatmentsreal2);
  }
  
  var cardiologyreferral_treatmentsreal1 = $('#cardiologyreferral_treatmentsreal1'); var cardiologyreferral_treatmentsreal2 = $('#cardiologyreferral_treatmentsreal2');
  if (cardiologyreferral_treatmentsx === true){
  redstyles(cardiologyreferral_treatmentsreal1); greenstyles(cardiologyreferral_treatmentsreal2);
  }
  
  var lifestyle_treatmentsreal1 = $('#lifestyle_treatmentsreal1'); var lifestyle_treatmentsreal2 = $('#lifestyle_treatmentsreal2');
  if (lifestyle_treatmentsx === true){
  redstyles(lifestyle_treatmentsreal1); greenstyles(lifestyle_treatmentsreal2);
  }
  
  var udca_treatmentsreal1 = $('#udca_treatmentsreal1'); var udca_treatmentsreal2 = $('#udca_treatmentsreal2');
  if (udca_treatmentsx === true){
  redstyles(udca_treatmentsreal1); greenstyles(udca_treatmentsreal2);
  }
  
  
  
  
  function redstyles(element){
    element.css({'visibility': 'hidden'});}
  
  function greenstyles(element){
    element.css({'visibility': 'visible','border-bottom':'1px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
  
  function redstyles_aboveline(element){
    element.css({'visibility': 'hidden','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'none'});}
      
  function greenstyles_aboveline(element){
    element.css({'visibility': 'visible','border-bottom':'4px solid rgb(190, 188, 188)','border-top':'1px solid rgb(190, 188, 188)'});}
   
   
    
  
  
  
  }, 2000);
  
  
  document.getElementById('review-section').style.display = 'unset';
    document.getElementById('taking-history-section').style.display = 'none';
    document.getElementById('taking-history-section-part2').style.display = 'none';
    document.getElementById('move-onto-questions-btn').style.display = 'none';
    
    document.getElementById('examinations').style.display = 'none';
    document.getElementById('summary').style.display = 'none';
    document.getElementById('differentials').style.display = 'none';
    document.getElementById('investigations').style.display = 'none';
    document.getElementById('riskfactors').style.display = 'none';
    document.getElementById('treatments').style.display = 'none';
  
  
    document.getElementById('fullscreenvideobackground').style.display = 'unset';
    document.body.style.backgroundColor = 'rgb(255, 255, 255)';
    document.getElementById('logoduringconsultation').style.display = 'none';
    document.getElementById('myVideo').style.display = 'none';
  
  }
  )
  
  
  
  
  let micisworkingtreatments = document.getElementById('micisworkingtreatments');//THIS IS NOT NEEDED FOR THE MIC TO WORK!!!!!!!!!!!
  recognition_treatments.onstart = function() {
      micisworkingtreatments.style.display = 'unset';
      document.getElementById('messagebeforeacceptingmic_treatments').style.display = 'none';
    }
  
  /*------enterkey*/
  let greg_treatments = 0;
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && micisworkingtreatments.style.display == 'unset' && greg_treatments==0) {  
      document.getElementById("save-note-btn-for-treatments").click(); greg_treatments++; treatments_silence = false;
      }   });
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
  $('#treatments-textarea').focus();
  
  $(document).on('keydown', function() {
    $('#treatments-textarea').focus();
  });
  });
  
  
  
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
recognition_treatments.onend= function (){
  if (treatments_silence == false){
    recognition_treatments.start()
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*-----------------------------
          Fake Examinations
  
  const txt1 = document.getElementById('examinations-textarea');
  const btn1 = document.getElementById('save-examinations');
  const out1 = document.getElementById('output1');
  
   function fun1() {
    if (txt1.value.includes('cardi')||txt1.value.includes('heart')){
      out1.innerHTML = txt1.value + ' is CORRECT';
  
    }
    else{
      out1.innerHTML = txt1.value + ' may be correct, however it is not in our model answers, however it does not necessarily mean your answer is incorrect as long as you are able to justify your reasoning. You may try again if you would like';
  
      var examinationsfinal = $('#examinationsfinal');
      examinationsfinal.text(txt1.value);
      
    }
  
   }//end of function called fun1
  
   btn1.addEventListener('click', fun1);
  
   //Enter key
   var input = document.getElementById("examinations-textarea");
   input.addEventListener("keypress", function(event) {
     if (event.key === "Enter") {
       event.preventDefault();
       document.getElementById("save-examinations").click();
     }
   });
  
   ------------------------------*/
  
  /*-----------------------------
          Examination findings (as in what the patient has on examination)
   
  
   
  
   const examfindingsbtn = document.getElementById('examfindings-btn');
   const messageofexaminationfindings = document.getElementById('messageofexaminationfindings');
  
  function examinationfindings(){
    messageofexaminationfindings.innerHTML = "let go";
  }
  examfindingsbtn.addEventListener('click', examinationfindings);
  
  
  ------------------------------*/
  
  
  
  
  
  
   
  /*-----------------------------
          differentials
   
  
  
  //DIFFERENTIAL 1
  
   const txt1s = document.getElementById('differential1-textarea');
   const btn1s = document.getElementById('save-d1');
   const out1s = document.getElementById('output10');
   
    function fun1s() {
     if (txt1s.value.includes('MI')||txt1s.value.includes('heart attack')){
       out1s.innerHTML = txt1s.value + ' is CORRECT';
   
     }
     else{
       out1s.innerHTML = txt1s.value + ' may be correct, however it is not in our model answers, however it does not necessarily mean your answer is incorrect as long as you are able to justify your reasoning. You may try again if you would like';
   
     }
   
    }//end of function called fun1s
   
    btn1s.addEventListener('click', fun1s);
  
  ------------------------------*/
  
  /*----enterkey
  
  var input = document.getElementById("differential1-textarea");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-d1").click();
    }
  });
  
  
  
  
  //DIFFERENTIAL 2
  const txt2s = document.getElementById('differential2-textarea');
  const btn2s = document.getElementById('save-d2');
  const out2s = document.getElementById('output2');
  
   function fun2s() {
    if (txt2s.value.includes('MI')||txt2s.value.includes('heart attack')){
      out2s.innerHTML = txt2s.value + ' is CORRECT';
  
    }
    else{
      out2s.innerHTML = txt2s.value + ' may be correct, however it is not in our model answers, however it does not necessarily mean your answer is incorrect as long as you are able to justify your reasoning. You may try again if you would like';
  
    }
  
   }//end of function called fun1s
  
   btn2s.addEventListener('click', fun2s);
  */
  /*----enterkey*
  
  var input = document.getElementById("differential2-textarea");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-d2").click();
    }
  });
  
  
  
  
  
  
  
   //DIFFERENTIAL 3
  const txt3s = document.getElementById('differential3-textarea');
  const btn3s = document.getElementById('save-d3');
  const out3s = document.getElementById('output3');
  
   function fun3s() {
    if (txt3s.value.includes('MI')||txt3s.value.includes('heart attack')){
      out3s.innerHTML = txt3s.value + ' is CORRECT';
  
    }
    else{
      out3s.innerHTML = txt3s.value + ' may be correct, however it is not in our model answers, however it does not necessarily mean your answer is incorrect as long as you are able to justify your reasoning. You may try again if you would like';
  
    }
    var differentialsfinal = $('#differentialsfinal');
    differentialsfinal.text(txt1s.value + ', ' + txt2s.value + ', ' + txt3s.value);
  
  
   }//end of function called fun1s
  
   btn3s.addEventListener('click', fun3s);
  /
  /*----enterkey
  
  var input = document.getElementById("differential3-textarea");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-d3").click();
    }
  });
  
  */
  
  
  
  /*-----------------------------
          Blood tests to do
   ------------------------------
  
  
   try {
    var SpeechRecognition2 = window.SpeechRecognition2 || window.webkitSpeechRecognition;
    var recognition2 = new SpeechRecognition2();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  
  var noteSummary2 = '';
  var summaryContent2 = '';
  var summarytextarea2 = $('#summary-textareatwo');
  
   
   
  recognition2.continuous = true;
   
  recognition2.onresult = function(event) {
   
    var current2 = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript2 = event.results[current2][0].transcript;
   
    var mobileRepeatBug2 = (current2 == 1 && transcript2 == event.results[0][0].transcript2);
   
    if(!mobileRepeatBug2) {
      noteSummary2 += transcript2;
      summarytextarea2.val(noteSummary2);
    }
  };
   
  
  var recordinginstructionsforsummary2 = $('#recording-instructions-for-blood');
  
  recognition2.onstart = function() {
    recordinginstructionsforsummary2.text('Microphone is activated. Try speaking into the microphone. Then double click the Submit Question button.');
  }
   
  recognition2.onspeechend = function() {
    recordinginstructionsforsummary2.text('DOUBLE CLICK THE SUBMIT BUTTON. (Once you get the response, press the Microphone button to ask another question)');
  }
   
  recognition2.onerror = function(event) {
    if(event.error == 'no-speech') {
      recordinginstructionsforsummary2.text('No speech was detected. Try again.');  
    };
  }
  
  
  
  
  
  $('#start-record-btn-for-blood').on('click', function(e) {
  if (summaryContent2.length) {
    summaryContent2 += ' ';
  }
  recognition2.start();
  });
  
  
  summarytextarea2.on('input', function() {
  noteSummary2 = $(this).val();
  })
  
  
  $('#save-note-btn-for-blood').on('click', function(e) {
  recognition2.stop();
  
  
  if(!noteSummary2.length) {
    recordinginstructionsforsummary2.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    
    saveNote(new Date().toLocaleString(), noteSummary2);
    recordinginstructionsforsummary2.text('You said: '+ noteSummary2);
  
  
    var bloodtestsfinal = $('#bloodtestsfinal');
    bloodtestsfinal.text(noteSummary2);
  
    //noteSummary = '';
    //renderNotes(getAllNotes());
    summarytextarea2.val('');
  }
  })
  */
  
  /*------enterkey
  
  var input = document.getElementById("start-record-btn-for-blood");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn-for-blood").click();
    }
  });
  
  var input = document.getElementById("summary-textareatwo");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn-for-blood").click();
    }
  });
  
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
    $('#summary-textareatwo').focus();
  
    $(document).on('keydown', function() {
      $('#summary-textareatwo').focus();
    });
  });
  
  */
  
  
  
  
  /*-----------------------------
          riskfactors
   ------------------------------*/
  
  
   try {
    var SpeechRecognition4 = window.SpeechRecognition4 || window.webkitSpeechRecognition;
    var recognition4 = new SpeechRecognition4();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  
  var noteSummary4 = '';
  var summaryContent4 = '';
  var summarytextarea4 = $('#riskfactors-textarea');
  
   
   
  recognition4.continuous = true;
   
  recognition4.onresult = function(event) {
   
    var current4 = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript4 = event.results[current4][0].transcript;
   
    var mobileRepeatBug4 = (current4 == 1 && transcript4 == event.results[0][0].transcript4);
   
    if(!mobileRepeatBug4) {
      noteSummary4 += transcript4;
      summarytextarea4.val(noteSummary4);
    }
  };
   
  
  var recordinginstructionsforsummary4 = $('#recording-instructions-for-riskfactors');
  
  recognition4.onstart = function() {
    recordinginstructionsforsummary4.text('Microphone is activated. Try speaking into the microphone. Then double click the Submit Question button.');
  }
   
  recognition4.onspeechend = function() {
    recordinginstructionsforsummary4.text('DOUBLE CLICK THE SUBMIT BUTTON. (Once you get the response, press the Microphone button to ask another question)');
  }
   
  recognition4.onerror = function(event) {
    if(event.error == 'no-speech') {
      recordinginstructionsforsummary4.text('No speech was detected. Try again.');  
    };
  }
  
  
  
  
  
  $('#start-record-btn-for-riskfactors').on('click', function(e) {
  if (summaryContent4.length) {
    summaryContent4 += ' ';
  }
  recognition4.start();
  });
  
  
  summarytextarea4.on('input', function() {
  noteSummary4 = $(this).val();
  })
  
  
  $('#save-note-btn-for-riskfactors').on('click', function(e) {
  recognition4.stop();
  
  if(!noteSummary4.length) {
    recordinginstructionsforsummary4.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    
    saveNote(new Date().toLocaleString(), noteSummary4);
    recordinginstructionsforsummary4.text('You said: '+ noteSummary4);
  
  
    var riskfactorsfinal = $('#riskfactorsfinal');
    riskfactorsfinal.text(noteSummary4);
  
    //noteSummary = '';
    //renderNotes(getAllNotes());
    summarytextarea4.val('');
  }
  })
  
  /*------enterkey*/
  
  var input = document.getElementById("start-record-btn-for-riskfactors");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn-for-riskfactors").click();
    }
  });
  
  var input = document.getElementById("riskfactors-textarea");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn-for-riskfactors").click();
    }
  });
  
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
    $('#riskfactors-textarea').focus();
  
    $(document).on('keydown', function() {
      $('#riskfactors-textarea').focus();
    });
  });
  
  
  
  /*-----------------------------
        Saving the riskfactors answers
  ------------------------------*/
  
  /*
  
  const txt4_blood = document.getElementById('riskfactors-textarea');
  const btn4_blood = document.getElementById('save-note-btn-for-riskfactors');
  const out4_blood = document.getElementById('recording-instructions-for-riskfactors');
  
  function riskfactorss() {
  if (txt4_blood.value.includes('cardi')||txt4_blood.value.includes('heart')){
    out4_blood.innerHTML = txt4_blood.value + ' is CORRECT';
  
  }
  else{
    out4_blood.innerHTML = txt4_blood.value + ' may be correct, however it is not in our model answers, however it does not necessarily mean your answer is incorrect as long as you are able to justify your reasoning. You may try again if you would like';
  
  }
  
  }//end of function called fun1
  
  btn4_blood.addEventListener('click', riskfactorss); 
  
  */
  
  
  
  
  
  
  
  
  
  
  /*-----------------------------
          treatments
   ------------------------------*/
  
  
   try {
    var SpeechRecognition5 = window.SpeechRecognition5 || window.webkitSpeechRecognition;
    var recognition5 = new SpeechRecognition5();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  
  var noteSummary5 = '';
  var summaryContent5 = '';
  var summarytextarea5 = $('#treatments-textarea');
  
   
   
  recognition5.continuous = true;
   
  recognition5.onresult = function(event) {
   
    var current5 = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcript5 = event.results[current5][0].transcript;
   
    var mobileRepeatBug5 = (current5 == 1 && transcript5 == event.results[0][0].transcript5);
   
    if(!mobileRepeatBug5) {
      noteSummary5 += transcript5;
      summarytextarea5.val(noteSummary5);
    }
  };
   
  
  var recordinginstructionsforsummary5 = $('#recording-instructions-for-treatments');
  
  recognition5.onstart = function() {
    recordinginstructionsforsummary5.text('Microphone is activated. Try speaking into the microphone. Then double click the Submit Question button.');
  }
   
  recognition5.onspeechend = function() {
    recordinginstructionsforsummary5.text('DOUBLE CLICK THE SUBMIT BUTTON. (Once you get the response, press the Microphone button to ask another question)');
  }
   
  recognition5.onerror = function(event) {
    if(event.error == 'no-speech') {
      recordinginstructionsforsummary5.text('No speech was detected. Try again.');  
    };
  }
  
  
  
  
  
  $('#start-record-btn-for-treatments').on('click', function(e) {
  if (summaryContent5.length) {
    summaryContent5 += ' ';
  }
  recognition5.start();
  });
  
  
  summarytextarea5.on('input', function() {
  noteSummary5 = $(this).val();
  })
  
  
  $('#save-note-btn-for-treatments').on('click', function(e) {
  recognition5.stop();
  
  if(!noteSummary5.length) {
    recordinginstructionsforsummary5.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    
    saveNote(new Date().toLocaleString(), noteSummary5);
    recordinginstructionsforsummary5.text('You said: '+ noteSummary5);
  
  
    var treatmentsfinal = $('#treatmentsfinal');
    treatmentsfinal.text(noteSummary5);
  
    //noteSummary = '';
    //renderNotes(getAllNotes());
    summarytextarea5.val('');
  }
  })
  
  /*------enterkey*/
  
  var input = document.getElementById("start-record-btn-for-treatments");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn-for-treatments").click();
    }
  });
  
  var input = document.getElementById("treatments-textarea");
  input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("save-note-btn-for-treatments").click();
    }
  });
  
  
  //this following part makes you write down straight onto the textbox rather than having to click on the textbox.
  $(function() {
    $('#treatments-textarea').focus();
  
    $(document).on('keydown', function() {
      $('#treatments-textarea').focus();
    });
  });
  
  
  
  
  /*-----------------------------
        Saving the treatments answers
  ------------------------------*/
  
  /*
  
  const txt5_blood = document.getElementById('treatments-textarea');
  const btn5_blood = document.getElementById('save-note-btn-for-treatments');
  const out5_blood = document.getElementById('recording-instructions-for-treatments');
  
  function treatmentss() {
  if (txt5_blood.value.includes('cardi')||txt5_blood.value.includes('heart')){
    out5_blood.innerHTML = txt5_blood.value + ' is CORRECT';
  
  }
  else{
    out5_blood.innerHTML = txt5_blood.value + ' may be correct, however it is not in our model answers, however it does not necessarily mean your answer is incorrect as long as you are able to justify your reasoning. You may try again if you would like';
  
  }
  
  }//end of function called fun1
  
  btn5_blood.addEventListener('click', treatmentss); 
  
  */
  
  
  
  
  
  
  
  
  /*-----------------------------
        FinalReview
  ------------------------------*/
  
  
  /*const finalreviewbtn = document.getElementById('finalreview-btn');
  
  function finalreviewss() {
  
  
  var summaryfinal = $('#summaryfinal');
  summaryfinal.text(noteSummary);
  
  
  var differentialsfinal = $('#differentialsfinal');
  differentialsfinal.text(txt1s.value + ', ' + txt2s.value + ', ' + txt3s.value);
  
  
  
  var examinationsfinal = $('#examinationsfinal');
  examinationsfinal.text(txt1.value);
  
  
  var bloodtestsfinal = $('#bloodtestsfinal');
  bloodtestsfinal.text(noteSummary2);
  
  
  var otherinvestigationsfinal = $('#otherinvestigationsfinal');
  otherinvestigationsfinal.text(noteSummary3);
  
  
  var riskfactorsfinal = $('#riskfactorsfinal');
  riskfactorsfinal.text(noteSummary4);
  
  
  var treatmentsfinal = $('#treatmentsfinal');
  treatmentsfinal.text(noteSummary5);
  */
  
  
  
  
  
  
  
  var summarymodel = $('#summarymodel');
  summarymodel.text('model');
  
  var differentialsmodel = $('#differentialsmodel'); differentialsmodel.text('● Acute Coronary Syndrome (I.e. Myocardial infarction/heart attack)');
  var differentialsmodel2 = $('#differentialsmodel2'); differentialsmodel2.text('● Costochondritis');
  var differentialsmodel3 = $('#differentialsmodel3'); differentialsmodel3.text('● Unstable angina');
  var differentialsmodel4 = $('#differentialsmodel4'); differentialsmodel4.text('● Anxiety attack/panic disorder');
  
  
  var examinationsmodel = $('#examinationsmodel'); examinationsmodel.text('● Cardiac exam');
  var examinationsmodel2 = $('#examinationsmodel2'); examinationsmodel2.text('● If the patient comes in acutely, you should do an ABCDE assessment');
  var examinationsmodel3 = $('#examinationsmodel3'); examinationsmodel3.text('● If the patient is unconscious and not breathing, you should start CPR and chest compressions');
  var examinationsmodel4 = $('#examinationsmodel4'); examinationsmodel4.text('● You could also perform a respiratory exam to rule out pneumonia andother potential causes of chest pain');
  
  
  
  var bloodtestsmodel = $('#bloodtestsmodel'); bloodtestsmodel.text('● Full Blood Count');
  var bloodtestsmodel2 = $('#bloodtestsmodel2'); bloodtestsmodel2.text('● Urea and Electrolytes');
  var bloodtestsmodel3 = $('#bloodtestsmodel3'); bloodtestsmodel3.text('● Troponin');
  var bloodtestsmodel4 = $('#bloodtestsmodel4'); bloodtestsmodel4.text('● Pro-BNP');
  var bloodtestsmodel5 = $('#bloodtestsmodel5'); bloodtestsmodel5.text('● Thyroid Function Tests');
  
  
  
  
  var otherinvestigationsmodel = $('#otherinvestigationsmodel'); otherinvestigationsmodel.text('● ECG');
  var otherinvestigationsmodel2 = $('#otherinvestigationsmodel2'); otherinvestigationsmodel2.text('● Chest X-ray');
  var otherinvestigationsmodel3 = $('#otherinvestigationsmodel3'); otherinvestigationsmodel3.text('● Check blood pressure, in both arms too (to rule out aortic disseaction)');
  var otherinvestigationsmodel4 = $('#otherinvestigationsmodel4'); otherinvestigationsmodel4.text('● ECHO - To look for any complications of a heart attack such as heart failure');
  var otherinvestigationsmodel5 = $('#otherinvestigationsmodel5'); otherinvestigationsmodel5.text('● Check the temperature - To rule out pneumonia and other infective causes');
  
  var riskfactorsmodel = $('#riskfactorsmodel');
  riskfactorsmodel.text('model');
  
  var treatmentsmodel = $('#treatmentsmodel');
  treatmentsmodel.text('model');
  
  
  
  //}
  
  
  
  //finalreviewbtn.addEventListener('click', finalreviewss);
  
  
  
  
  /*-----------------------------------------------------
      trial = false;
      var test = $('#test');
       if (noteContent.includes("job")){
         //test.text('all of this works');
         trial = true;
       }
       
       if (trial === true){
         test.text('YES he asked about job');
       }
  -------------------------------------------------------*/
  
  
  
  
  
  
  









  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
  
    analyser.fftSize = 512;
    microphone.connect(analyser);
  
    function updateGlow() {
        analyser.getByteFrequencyData(dataArray);
        let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
  
        let glowIntensity = Math.min(volume * 3.5, 50); // Cap intensity at 50px
  
        micisworking.style.boxShadow = `0px 0px ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, 0.8)`;
        micisworkingexaminations.style.boxShadow = `0px 0px ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, 0.8)`;
        micisworkingsummary.style.boxShadow = `0px 0px ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, 0.8)`;
        micisworkingdifferentials.style.boxShadow = `0px 0px ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, 0.8)`;
        micisworkinginvestigations.style.boxShadow = `0px 0px ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, 0.8)`;
        micisworkingriskfactors.style.boxShadow = `0px 0px ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, 0.8)`;
        micisworkingtreatments.style.boxShadow = `0px 0px ${glowIntensity}px ${glowIntensity / 2}px rgba(255, 0, 0, 0.8)`;
  
        requestAnimationFrame(updateGlow);
    }
  
    updateGlow();
  }).catch(error => console.error(error));

  




  
  
  
  
  
  
  
  
  const WWWEBItitles = document.querySelector('WWWEBItitles');
  const evenbetterifgeneral = document.querySelector('evenbetterifgeneral');
  
if (WWWEBItitles && evenbetterifgeneral) {
  WWWEBItitles.style.height = getComputedStyle(evenbetterifgeneral).height;
} else {
  console.error("❌ Missing elements for height sync", {
    WWWEBItitles,
    evenbetterifgeneral
  });
}
  
  
  
  
  
  
  
  
  
  /*
  
  
  
  
  
  //links
  //http://eloquentjavascript.net/09_regexp.html
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  
  
  var messages = [], //array that hold the record of each string in chat
    lastUserMessage = "", //keeps track of the most recent input string from the user
    botMessage = "", //var keeps track of what the chatbot is going to say
    botName = 'Mark', //name of the chatbot
    talking = true; //when false the speach function doesn't work
  //
  //
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //edit this function to change what the chatbot says
  function chatbotResponse() {
    talking = true;
    botMessage = "I'm confused"; //the default message
  
    if (lastUserMessage === 'hi' || lastUserMessage =='hello') {
      const hi = ['hi','howdy','hello']
      botMessage = hi[Math.floor(Math.random()*(hi.length))];;
    }
  
    if (lastUserMessage === 'name') {
      botMessage = 'My name is ' + botName;
    }
  }
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //****************************************************************
  //
  //
  //
  //this runs each time enter is pressed.
  //It controls the overall input and output
  function newEntry() {
    //if the message from the user isn't empty then run 
    if (document.getElementById("chatbox").value != "") {
      //pulls the value from the chatbox ands sets it to lastUserMessage
      lastUserMessage = document.getElementById("chatbox").value;
      //sets the chat box to be clear
      document.getElementById("chatbox").value = "";
      //adds the value of the chatbox to the array messages
      messages.push(lastUserMessage);
      //Speech(lastUserMessage);  //says what the user typed outloud
      //sets the variable botMessage in response to lastUserMessage
      chatbotResponse();
      //add the chatbot's name and message to the array messages
      messages.push("<b>" + botName + ":</b> " + botMessage);
      // says the message using the text to speech function written below
      Speech(botMessage);
      //outputs the last few array elements of messages to html
      for (var i = 1; i < 8; i++) {
        if (messages[messages.length - i])
          document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
      }
    }
  }
  
  //text to Speech
  //https://developers.google.com/web/updates/2014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
  function Speech(say) {
    if ('speechSynthesis' in window && talking) {
      var utterance = new SpeechSynthesisUtterance(say);
      //msg.voice = voices[10]; // Note: some voices don't support altering params
      //msg.voiceURI = 'native';
      //utterance.volume = 1; // 0 to 1
      //utterance.rate = 0.1; // 0.1 to 10
      //utterance.pitch = 1; //0 to 2
      //utterance.text = 'Hello World';
      //utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }
  
  //runs the keypress() function when a key is pressed
  document.onkeypress = keyPress;
  //if the key pressed is 'enter' runs the function newEntry()
  function keyPress(e) {
    var x = e || window.event;
    var key = (x.keyCode || x.which);
    if (key == 13 || key == 3) {
      //runs this function when enter is pressed
      newEntry();
    }
    if (key == 38) {
      console.log('hi')
        //document.getElementById("chatbox").value = lastUserMessage;
    }
  }
  
  //clears the placeholder text ion the chatbox
  //this function is set to run when the users brings focus to the chatbox, by clicking on it
  function placeHolder() {
    document.getElementById("chatbox").placeholder = "";
  }
  
  
  
  
  /*-----------------------------
          treatments
   ------------------------------*/
  /*
  
   try {
    var SpeechRecognitionz = window.SpeechRecognitionz || window.webkitSpeechRecognition;
    var recognitionz = new SpeechRecognitionz();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }
   
  
  
  var noteSummaryz = '';
  var summaryContentz = '';
  var summarytextareaz = $('#chatbox');
  
   
   
  recognitionz.continuous = true;
   
  recognitionz.onresult = function(event) {
   
    var currentz = event.resultIndex;
   
    // Get a transcript of what was said.
    var transcriptz = event.results[currentz][0].transcript;
   
    var mobileRepeatBugz = (currentz == 1 && transcriptz == event.results[0][0].transcriptz);
   
    if(!mobileRepeatBugz) {
      noteSummaryz += transcriptz;
      summarytextareaz.val(noteSummaryz);
    }
  };
   
  
  var recordinginstructionsforsummaryz = $('#recording-instructionsz');
  
  recognitionz.onstart = function() {
    recordinginstructionsforsummaryz.text('Microphone is activated. Try speaking into the microphone. Then double click the Submit Question button.');
  }
   
  recognitionz.onspeechend = function() {
    recordinginstructionsforsummaryz.text('DOUBLE CLICK THE SUBMIT BUTTON. (Once you get the response, press the Microphone button to ask another question)');
  }
   
  recognitionz.onerror = function(event) {
    if(event.error == 'no-speech') {
      recordinginstructionsforsummaryz.text('No speech was detected. Try again.');  
    };
  }
  
  
  
  
  
  $('#start-record-btnz').on('click', function(e) {
  if (summaryContentz.length) {
    summaryContentz += ' ';
  }
  recognitionz.start();
  });
  
  
  summarytextareaz.on('input', function() {
  noteSummaryz = $(this).val();
  })
  
  
  $('#save-note-btnz').on('click', function(e) {
  recognitionz.stop();
  
  if(!noteSummaryz.length) {
    recordinginstructionsforsummaryz.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    
    saveNote(new Date().toLocaleString(), noteSummaryz);
    recordinginstructionsforsummaryz.text('You said: '+ noteSummaryz);
  
    //noteSummary = '';
    //renderNotes(getAllNotes());
    summarytextareaz.val('');
  }
  })
  
  
  noteSummaryz = '';
  renderNotes(getAllNotes());
  noteSummaryz.val('');
  
  */
  
/*
 } catch (e) {
  console.error("Script crashed:", e);
}*/