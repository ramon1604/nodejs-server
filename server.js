require("dotenv").config({ path: "./.env" });
const express = require("express");
let cors = require("cors");
const e = require("express");
const stripe = require("stripe")(process.env.SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

//Stripe for checkout sessions
app.post("/checkout", async (req, res) => {
  const line_items = req.body;
  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.PUBLISHABLE_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const total = req.body.total;
  const paymentIntent = await stripe.paymentIntents.create({
    currency: "usd",
    amount: total,
    payment_method_types: [
      "card",
    ],
  });

  res.send(
    JSON.stringify({
      clientSecret: paymentIntent.client_secret,
    })
  );
});

app.listen(4000, () => console.log("Listening in port 4000!"));
