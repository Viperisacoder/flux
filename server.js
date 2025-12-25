require('dotenv').config();

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Webhook endpoint MUST be registered before express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not set');
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log(`✓ Payment confirmed for session: ${session.id}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }
});

// Regular middleware after webhook
app.use(cors());
app.use(express.json());

// Create checkout session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    // Use SITE_URL for backend (set on Vercel as environment variable)
    // Fallback to localhost for local development
    const siteUrl = process.env.SITE_URL || 'http://localhost:5002';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Flux for macOS',
            },
            unit_amount: 200,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Download endpoint - validates payment via Stripe API
app.get('/api/download', async (req, res) => {
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

    // Return download URL (placeholder for now)
    const downloadUrl = process.env.DOWNLOAD_FILE_URL;
    if (!downloadUrl) {
      return res.status(503).json({ error: 'Download service not configured' });
    }

    console.log(`✓ Download authorized for session: ${sessionId}`);
    return res.json({ downloadUrl });
  } catch (error) {
    console.error('Download error:', error.message);
    return res.status(500).json({ error: 'Failed to process download request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
