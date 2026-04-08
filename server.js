import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

import admin from "firebase-admin";
import Stripe from "stripe";

import WebSocket from "ws";
import expressWs from "express-ws";


const app = express();
app.use(express.json());

app.use(express.static("public"));



// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://oscereal-706d4.web.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));












//------Whisper:--------

import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const upload = multer({ dest: "uploads/" });
const openai = new OpenAI();

app.post("/api/transcribe", upload.single("file"), async (req, res) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "gpt-4o-transcribe"
    });

    res.json({ text: transcription.text });

    fs.unlinkSync(req.file.path); // cleanup
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "transcription failed" });
  }
});








/*
expressWs(app);

app.ws("/deepgram", (clientSocket) => {
  const dgSocket = new WebSocket(
    "wss://api.deepgram.com/v1/listen?punctuate=true&encoding=linear16&sample_rate=16000",
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    }
  );

  clientSocket.on("message", (msg) => {
    if (dgSocket.readyState === WebSocket.OPEN) dgSocket.send(msg);
  });

  dgSocket.on("message", (data) => clientSocket.send(data.toString()));

  dgSocket.on("close", () => clientSocket.close());
  dgSocket.on("error", () => clientSocket.close());
});
*/






/*
// ---------------- DEEPGRAM TOKEN ----------------

expressWs(app);

app.ws("/deepgram", (clientSocket) => {
  const dgSocket = new WebSocket(
"wss://api.deepgram.com/v1/listen?punctuate=true",
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
      },
    }
  );

  // Forward audio from browser → Deepgram
  clientSocket.on("message", (msg) => {
    if (dgSocket.readyState === WebSocket.OPEN) dgSocket.send(msg);
  });

  // Send transcript back to browser
  dgSocket.on("message", (data) => clientSocket.send(data.toString()));

  dgSocket.on("close", () => clientSocket.close());
  dgSocket.on("error", () => clientSocket.close());
});
*/













app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("✅ Stripe event received:", event.type);

    // ✅ THIS IS THE IMPORTANT CHANGE
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;
      const customerEmail = invoice.customer_email;

      console.log("💰 Subscription payment succeeded for:", customerEmail);

      try {
        const snapshot = await admin
          .firestore()
          .collection("users")
          .where("email", "==", customerEmail)
          .get();

        if (snapshot.empty) {
          console.log("⚠️ No matching user found in Firestore");
        }

        snapshot.forEach(doc => {
          doc.ref.update({
            plan: "pro",
            subscriptionStatus: "active"
          });
        });

        console.log("🔥 Firestore updated successfully");
      } catch (err) {
        console.error("❌ Firestore update error:", err);
      }
    }




if (event.type === "customer.subscription.deleted") {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  const customer = await stripe.customers.retrieve(customerId);
  const email = customer.email;

  console.log("❌ Subscription cancelled for:", email);

  const snapshot = await admin
    .firestore()
    .collection("users")
    .where("email", "==", email)
    .get();

  snapshot.forEach(doc => {
    doc.ref.update({
      plan: "free",
      subscriptionStatus: "cancelled"
    });
  });
}









    res.json({ received: true });
  }
);

app.use(express.json());


// ---------------- CHAT GPT API ---------------- //





app.post("/api/oscetrial", async (req, res) => {
  const { input, previousquestion, response_question } = req.body;

  try {
   /* const completeSentence = async (responseText) => {
      // Loop until we have a sentence-ending punctuation mark
      while (!(responseText.endsWith('.') || responseText.endsWith('!') || responseText.endsWith('?'))) {
        // Make a request to complete the sentence
        const additionalResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // or another model, like "gpt-4"
            messages: [
              { role: "system", content: "you're Marc, a 31-year-old male, experiencing constant severe chest pain." },
              { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}\nYour previous response: ${response_question || "N/A"}\nNew Dr question: ${input}\nMarc's answer:`},
            ],
            temperature: 0.1,
            max_tokens: 20, // Allow a bit more tokens for completion
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          }),
        });

        const data = await additionalResponse.json();
        responseText += ' ' + data.choices[0].message.content.trim(); // Add the extra tokens
      }
      return responseText.trim();
    };
*/
    // Initial request to OpenAI 
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", //gpt-4o-mini
        messages: [
          { role: "system", content: "you're Marc, a 31-year-old male, experiencing constant severe chest pain. You're in a consultation room & the Dr is asking you questions. Answer as Marc be minimal max 1 sentence" },
              { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}\nYour previous response: ${response_question || "N/A"}\nNew Dr question: ${input}\nMarc's answer:`},        ],
        temperature: 0.1,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    res.json({ content: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
});














app.get("/api/history", verifyFirebaseUser, async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("users")
      .doc(req.uid)
      .collection("history")
      .orderBy("createdAt", "desc")
      .get();

    const history = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});














app.post("/api/TUTOR2ndcase", verifyFirebaseUser, async (req, res) => {
  console.log("🚀 TUTOR2ndcase endpoint hit");
  console.log("📦 BODY:", req.body); // 👈 ADD THIS

  const { input, sessionId, endSession } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId required" });
  }

  const db = admin.firestore();
  const docRef = db.collection("conversations").doc(sessionId);

  try {

    // =========================
    // 🛑 END SESSION (EVALUATION)
    // =========================
    if (endSession) {
      console.log("🛑 Ending session:", sessionId);

      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(400).json({ error: "No session found" });
      }

      const messages = doc.data().messages || [];

      const evaluationMessages = [
        {
          role: "system",
          content: `
You are a medical school admissions assessor.

Based on the full interview conversation:

1. Give an overall score out of 10
2. Provide an overall assessment in 2nd person + be specific + reason for score. Be ruthless + harsh in the assessment.
3. List some of the strengths
4. List areas for improvement + go into detail + specifics

Format EXACTLY like:

Score: X/10

Overall: ...

Strengths:
- ...
- ...

Improvements:
- ...
- ...
- ...
- ...
`
        },
        ...messages
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: evaluationMessages,
          temperature: 0.3,
          max_tokens: 200
        }),
      });

      const data = await response.json();
      const evaluation = data.choices[0].message.content.trim();




// Extract score from evaluation text
const scoreMatch = evaluation.match(/Score:\s*(\d+)\/10/);
const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

// Save to user's history
await admin.firestore().collection("users").doc(doc.data().userId).collection("history").add({
  sessionId,
  evaluation,
  score,
createdAt: admin.firestore.FieldValue.serverTimestamp(),
createdAtReadable: new Date().toISOString()});




      await docRef.update({
        evaluation,
        completed: true,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({ evaluation });





    }

    // =========================
    // 💬 NORMAL INTERVIEW FLOW
    // =========================

    const doc = await docRef.get();

    let messages;

    if (!doc.exists) {
      messages = [
        {
          role: "system",
          content: `
You are a medical school interviewer.

- Ask one question at a time
- Respond naturally
- Ask follow-up questions
- DO NOT give feedback during interview
- Keep responses concise + ask hard questions + be a severe examiner
`
        }
      ];
    } else {
      messages = doc.data().messages || [];
    }

    messages.push({
      role: "user",
      content: input
    });
/*
    const MAX_MESSAGES = 12;
    if (messages.length > MAX_MESSAGES) {
      messages = [messages[0], ...messages.slice(-MAX_MESSAGES)];
    }
*/
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 80
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content.trim();

    messages.push({
      role: "assistant",
      content: reply
    });

    await docRef.set({
      messages,
      userId: req.uid, // 👈 Stores UserID in conversation
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ content: reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});














app.post("/api/3rdcase", async (req, res) => {
  const { input, previousquestion, response_question } = req.body;

  try {
  /*  
    const completeSentence = async (responseText) => {
      // Loop until we have a sentence-ending punctuation mark
      while (!(responseText.endsWith('.') || responseText.endsWith('!') || responseText.endsWith('?'))) {
        // Make a request to complete the sentence
        const additionalResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // or another model, like "gpt-4"
            messages: [
              { role: "system", content: "you're Daniel, a 33 yr old male. with a worsening cough over last 6 weeks associated with pleuritic Rt chest pain + fever. You're in a consultation room & the Dr is asking you questions. Answer as Daniel" },
              { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                          Your previous response: ${response_question || "N/A"}
                                          New Dr question: ${input}
                                          Daniel's answer: ${responseText}` },
            ],
            temperature: 0.1,
            max_tokens: 20, // Allow a bit more tokens for completion
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          }),
        });

        const data = await additionalResponse.json();
        responseText += ' ' + data.choices[0].message.content.trim(); // Add the extra tokens
      }
      return responseText.trim();
    };
*/
    // Initial request to OpenAI
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", //gpt-4o-mini
        messages: [
          { role: "system", content: "you're Daniel, a 33 yr old male. with a worsening cough over last 6 weeks associated with pleuritic Rt chest pain + fever. You're in a consultation room & the Dr is asking you questions. Answer as Daniel be minimal max 1 sentence" },
          { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                    Your previous response: ${response_question || "N/A"}
                                    New Dr question: ${input}
                                    Daniel's answer:` },
        ],
        temperature: 0.1,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    res.json({ content: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
});












app.post("/api/4thcase", async (req, res) => {
  const { input, previousquestion, response_question } = req.body;

  try {
/*const completeSentence = async (responseText) => {
      // Loop until we have a sentence-ending punctuation mark
      while (!(responseText.endsWith('.') || responseText.endsWith('!') || responseText.endsWith('?'))) {
        // Make a request to complete the sentence
        const additionalResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // or another model, like "gpt-4"
            messages: [
              { role: "system", content: "you're John, a 31 year old male. with new right sided arm + leg weakness over last 3 hrs with facial droop + slurred speech. You're in a consultation room & the Dr is asking you questions. Answer as John" },
              { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                          Your previous response: ${response_question || "N/A"}
                                          New Dr question: ${input}
                                          John's answer: ${responseText}` },
            ],
            temperature: 0.1,
            max_tokens: 20, // Allow a bit more tokens for completion
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
          }),
        });

        const data = await additionalResponse.json();
        responseText += ' ' + data.choices[0].message.content.trim(); // Add the extra tokens
      }
      return responseText.trim();
    };
*/
    // Initial request to OpenAI

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", //gpt-4o-mini
        messages: [
          { role: "system", content: "you're John, a 31 year old male. with new right sided arm + leg weakness over last 3 hrs with facial droop + slurred speech. You're in a consultation room & the Dr is asking you questions. Answer as John be minimal max 1 sentence" },
          { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                    Your previous response: ${response_question || "N/A"}
                                    New Dr question: ${input}
                                    John's answer:` },
        ],
        temperature: 0.1,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    res.json({ content: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
});









app.post("/api/5thcase", async (req, res) => {
  const { input, previousquestion, response_question } = req.body;

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", //gpt-4o-mini
        messages: [
          { role: "system", content: "you're Greg, a 56 yr old with new shortness of breath. You're struggling to breath. You're in a consultation room & the Dr is asking you questions. Answer as Greg be minimal max 1 sentence" },
          { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                    Your previous response: ${response_question || "N/A"}
                                    New Dr question: ${input}
                                    Greg's answer:` },
        ],
        temperature: 0.1,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    res.json({ content: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
});










app.post("/api/6thcase", async (req, res) => {
  const { input, previousquestion, response_question } = req.body;

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", //gpt-4o-mini
        messages: [
          { role: "system", content: "you're Jon, a 30 yr old with new central abdominal pain. You're in a consultation room & the Dr is asking you questions (Dx is appendicitis). Answer as Jon be minimal max 1 sentence" },
          { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                    Your previous response: ${response_question || "N/A"}
                                    New Dr question: ${input}
                                    Jon's answer:` },
        ],
        temperature: 0.1,
        max_tokens: 25,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      }),
    });

    const data = await response.json();
    res.json({ content: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect to OpenAI" });
  }
});







// ---------------- ELEVENLABS ---------------- //


/*
app.post("/api/voicezak", async (req, res) => {
  const { text, voiceId } = req.body;

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs API error:", errText);
      return res.status(response.status).send(errText);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Error contacting ElevenLabs:", error);
    res.status(500).json({ error: "Failed to fetch from ElevenLabs" });
  }
});

*/



app.post("/api/voicezak", async (req, res) => {
  const { text, voiceId } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid or missing text" });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs API error:", errText);
      return res.status(response.status).send(errText);
    }

    const audioBuffer = await response.arrayBuffer();
    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error("Error contacting ElevenLabs:", error);
    res.status(500).json({ error: "Failed to fetch from ElevenLabs" });
  }
});





//stripe CARD PAYMENTS////////////////////////////////////


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  )
});



async function verifyFirebaseUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    req.uid = decoded.uid;
    req.email = decoded.email;
    next();
  } catch (err) {
  console.error("❌ Token error:", err);
  res.status(401).json({ error: "Invalid token" });
}
}





app.post("/api/create-checkout-session", verifyFirebaseUser, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: req.email,
      line_items: [
        {
          price: "price_1T157PLCGle4gqnNrr23raj5", // Stripe price ID
          quantity: 1
        }
      ],
      success_url: "https://oscereal-706d4.web.app/webpages/logins/successfulpay.html",
      cancel_url: "https://oscereal-706d4.web.app/webpages/logins/profile.html"
    });

    res.json({ url: session.url });
  /*} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Stripe error" });
  }*/
} catch (err) {
  console.error("Stripe session error:", err);
  res.status(500).json({ error: err.message });
}

});






app.post("/api/create-portal-session", verifyFirebaseUser, async (req, res) => {
  try {
    const customers = await stripe.customers.list({
      email: req.email,
      limit: 1,
    });

    if (!customers.data.length) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: "https://oscereal-706d4.web.app/webpages/logins/profile.html",
    });

    res.json({ url: portalSession.url });
  } catch (err) {
    console.error("Portal session error:", err);
    res.status(500).json({ error: "Failed to create portal session" });
  }
});






//Is to ping render when user accesses main page/index.html so that it wakes up render. Frontend JS is inside index.html btw
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});









// ---------------------------------------------------------- //


app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
