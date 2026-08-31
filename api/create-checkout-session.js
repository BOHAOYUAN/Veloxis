// Veloxis AI — Stripe Checkout Session Creator (Zero-Dependency High-Speed Serverless Function)

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY environment variable is not configured on Vercel' });
  }

  try {
    const { tier = 'pro', interval = 'month', advisor_id, advisor_email } = req.body || {};

    const isEnterprise = tier === 'enterprise';
    const isAnnual = interval === 'year';

    // Pricing Matrix: Pro $99/mo ($79/mo billed annually), Enterprise $299/mo ($239/mo billed annually)
    let unitAmountCents = 9900; // $99.00
    let productName = 'Veloxis AI — Pro RIA Wealth Management';
    let productDesc = 'Unlimited HNW Clients, FINRA 4K PDF Export, 2008 GFC Stress Suite, Roth Tax Alpha';

    if (isEnterprise) {
      unitAmountCents = isAnnual ? 286800 : 29900; // $2,868/yr or $299/mo
      productName = 'Veloxis AI — Enterprise RIA Firm';
      productDesc = 'Multi-Advisor Seats, White-Label Portal, Custom Quant Calibration, Dedicated Quant API';
    } else {
      unitAmountCents = isAnnual ? 94800 : 9900; // $948/yr ($79/mo) or $99/mo
    }

    const origin = req.headers.origin || req.headers.referer || 'https://veloxis-tau.vercel.app';
    const cleanOrigin = origin.replace(/\/$/, '');

    const params = new URLSearchParams();
    params.append('mode', 'subscription');
    params.append('success_url', `${cleanOrigin}/index.html?session_id={CHECKOUT_SESSION_ID}&upgraded=true`);
    params.append('cancel_url', `${cleanOrigin}/index.html?canceled=true`);
    
    if (advisor_email) {
      params.append('customer_email', advisor_email);
    }
    if (advisor_id) {
      params.append('client_reference_id', advisor_id);
      params.append('metadata[advisor_id]', advisor_id);
      params.append('metadata[tier]', tier);
    }

    // Line item configuration
    params.append('line_items[0][price_data][currency]', 'usd');
    params.append('line_items[0][price_data][unit_amount]', unitAmountCents.toString());
    params.append('line_items[0][price_data][recurring][interval]', isAnnual ? 'year' : 'month');
    params.append('line_items[0][price_data][product_data][name]', productName);
    params.append('line_items[0][price_data][product_data][description]', productDesc);
    params.append('line_items[0][price_data][product_data][images][0]', 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png');
    params.append('line_items[0][quantity]', '1');

    // Call Stripe official API
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error('Stripe API error:', session);
      return res.status(400).json({ error: session.error?.message || 'Failed to create Stripe session' });
    }

    return res.status(200).json({
      success: true,
      url: session.url,
      session_id: session.id
    });

  } catch (error) {
    console.error('Checkout Handler Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
