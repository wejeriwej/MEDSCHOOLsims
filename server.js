import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your web page



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

























app.post("/api/2ndcase", async (req, res) => {
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
              { role: "system", content: "you're Jason, a 40 year old male. with right upper quadrant sharp pain that comes + goes for last 2 months + happened this morning. You're in a consultation room & the Dr is asking you questions. Answer as Jason" },
              { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                          Your previous response: ${response_question || "N/A"}
                                          New Dr question: ${input}
                                          Jason's answer: ${responseText}` },
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
          { role: "system", content: "you're Jason, a 40 year old male. with right upper quadrant sharp pain that comes + goes for last 2 months + happened this morning. You're in a consultation room & the Dr is asking you questions. Answer as Jason be minimal max 1 sentence" },
          { role: "user", content: `Previous Dr question: ${previousquestion || "N/A"}
                                    Your previous response: ${response_question || "N/A"}
                                    New Dr question: ${input}
                                    Jason's answer:` },
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










// ---------------------------------------------------------- //


app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
