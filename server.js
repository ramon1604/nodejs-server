require("dotenv").config();
const express = require("express");
let cors = require("cors");
const stripe = require("stripe")(process.env.SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  const items = req.body;
  let line_items = [];
  items.forEach((item) => {
    line_items.push({
      price: item.price,
      quantity: item.quantity,
    });
  });
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

app.listen(4000, () => console.log("Listening in port 4000!"));
