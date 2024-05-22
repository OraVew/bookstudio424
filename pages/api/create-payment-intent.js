// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (amount) => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  const final = Math.round(amount * 100); // Multiply by 100 to convert to cents and round to nearest integer
  return final;
};

// Adjust your existing create-payment-intent API handler
export default async function handler(req, res) {
  const { amount, receipt_email } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(parseFloat(amount)),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    receipt_email: receipt_email
  });

  // Send back the client secret and the paymentIntent ID
  res.send({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id // Include this line
  });
};
