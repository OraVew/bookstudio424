import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("BookOraVew");
    const { hostId } = req.query;
    const pricingSettings = await db.collection("hosts").findOne({_id: parseInt(hostId)});

    if (!pricingSettings) {
      return res.status(404).json({ message: "Pricing data not found" });
    }

    res.status(200).json(pricingSettings);
  } catch (error) {
    console.error('Error fetching pricing data:', error);
    res.status(500).json({ error: 'Failed to fetch pricing data: ' + error.message });
  }
}
