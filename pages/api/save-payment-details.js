// pages/api/save-payment-details.js
import clientPromise from '../../lib/mongodb';
import fetch from 'node-fetch';




export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db("BookOraVew");  // Ensure correct database name

    const customerDetails = req.body;
    console.log("1", req.body)
    console.log("2", customerDetails)

    // Insert into MongoDB
    const result = await db.collection("bookings").insertOne(customerDetails);

    // Properly await webhook functions
     //zapierEventHook(customerDetails);
     zapierPaymentHook(customerDetails);

    res.status(200).json({ message: "Payment details saved", data: result });
  } catch (error) {
    console.error("Failed to save payment details:", error);
    res.status(500).json({ error: error.message });
  }
}

const zapierEventHook = async (customerDetails) => {
  const webhookURL = 'https://hooks.zapier.com/hooks/catch/17285769/3n68n5r/';
  const response = await fetch(webhookURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerDetails)
  });

  if (!response.ok) {
    throw new Error(`Failed to send webhook: ${response.statusText}`);
  }
}

const zapierPaymentHook = async (customerDetails) => {
  const webhookURL = 'https://hooks.zapier.com/hooks/catch/17285769/37qgko0/';
  const response = await fetch(webhookURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerDetails)
  });

  if (!response.ok) {
    throw new Error(`Failed to send webhook: ${response.statusText}`);
  }
}
