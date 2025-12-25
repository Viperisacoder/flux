const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    // Fetch session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.payment_status !== 'paid') {
      return res.status(403).json({ error: 'Payment not completed' });
    }

    // Return download URL
    const downloadUrl = process.env.DOWNLOAD_FILE_URL;
    if (!downloadUrl) {
      return res.status(503).json({ error: 'Download service not configured' });
    }

    console.log(`✓ Download authorized for session: ${sessionId}`);
    return res.json({ downloadUrl });
  } catch (error) {
    console.error('Download error:', error.message);
    return res.status(500).json({ error: error.message || 'Failed to process download request' });
  }
};
