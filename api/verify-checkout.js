// Veloxis AI — Stripe Checkout Session Verifier & Tier Activator

const SUPABASE_PROJECT_URL = process.env.SUPABASE_URL || 'https://mlvyjrevobzaecganmgp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_rtB-t4wWt2N6P8e_EbHHng_Wopex2g1';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY is not configured on Vercel' });
  }

  try {
    const { session_id } = req.body || req.query || {};
    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    // Verify session directly with Stripe
    const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`
      }
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      return res.status(400).json({ error: session.error?.message || 'Invalid session' });
    }

    const isPaid = session.payment_status === 'paid' || session.status === 'complete';
    const advisorId = session.client_reference_id || session.metadata?.advisor_id;
    const tier = session.metadata?.tier || 'pro';

    if (isPaid && advisorId) {
      // Update Supabase Database
      const updateRes = await fetch(`${SUPABASE_PROJECT_URL}/rest/v1/advisors?id=eq.${advisorId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          subscription_tier: tier,
          updated_at: new Date().toISOString()
        })
      });

      return res.status(200).json({
        success: true,
        verified: true,
        tier: tier,
        advisor_id: advisorId
      });
    }

    return res.status(200).json({
      success: true,
      verified: isPaid,
      status: session.status
    });

  } catch (error) {
    console.error('Verify Handler Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
