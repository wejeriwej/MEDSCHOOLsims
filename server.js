import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

import admin from "firebase-admin";
import Stripe from "stripe";

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "http://127.0.0.1:5501",
  "http://localhost:5501",
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



app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
