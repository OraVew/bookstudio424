// pages/api/verify-payment-intent.js

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { paymentIntentId } = req.body;

        try {
            // Retrieve the payment intent from Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            // Check the status of the payment
            if (paymentIntent.status === 'succeeded') {
                // Handle post-payment workflows here
                // E.g., update your database, send email confirmations, etc.
                console.log("Payment confirmed and succeeded");

                // Implement your business logic for successful payment
                // Maybe send a confirmation email to the user
                // Update booking status in your database

                res.status(200).json({ success: true, message: "Payment confirmed and successful!" });
            } else {
                // Handle different cases or log for review
                res.status(400).json({ success: false, message: "Payment not successful" });
            }
        } catch (error) {
            console.error("Error verifying payment intent:", error);
            res.status(500).json({ statusCode: 500, message: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}
