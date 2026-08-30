// Veloxis AI — Groq 0.08s Sub-Second Conversational Wealth Engine
// Primary LLM: Groq LPU Llama-3.3 70B Versatile
// Failover LLM: DeepSeek V3

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

module.exports = async function handler(req, res) {
  // CORS & Options Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', engine: 'Veloxis Groq 0.08s LPU Active', version: '1.0.0' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, customApiKey, language = 'en' } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt input is required' });
    }

    // System prompt for Groq Llama-3.3 70B / DeepSeek V3 FinTech Financial Modeling
    const systemPrompt = `You are Veloxis Core, a world-class FinTech Wealth & Monte Carlo Financial Architect designed for Modern RIAs (RightCapital benchmark).
Analyze the user's input prompt (voice/text) and extract financial parameters. Return a STRICT JSON object ONLY (no markdown fences, no extra commentary).

JSON Schema:
{
  "client_summary": "Brief 1-sentence executive financial profile",
  "current_age": 35,
  "retire_age": 55,
  "liquid_assets": 500000,
  "annual_income": 200000,
  "annual_spending": 80000,
  "monte_carlo_success_rate": 96,
  "roth_conversion_recommended": true,
  "tax_savings_estimate": 145000,
  "slides": [
    {
      "slide_index": 1,
      "chapter_label": "CHAPTER 1: THE WEALTH SNAPSHOT",
      "title": "Main Headline Title",
      "subtitle": "Sub-header takeaway",
      "metric_box": { "value": "$500,000", "label": "Current Net Worth" },
      "versus": { "old_way": "Traditional Static Plan", "new_way": "Veloxis 0.1s Guardrail Strategy" },
      "bullet_points": [
        { "point_title": "Asset Corridor", "point_desc": "High confidence probability range" }
      ],
      "takeaway_quote": "Key executive takeaway quote"
    }
  ]
}
Generate between 5 to 15 structured slides based on user input complexity. All text should be in ${language === 'zh' ? 'Chinese' : 'English'}.`;

    let result = null;
    let engineUsed = 'Groq LPU Llama-3.3 70B';

    // 1. Primary Attempt: Groq LPU (Sub-Second Latency)
    const groqKey = customApiKey || process.env.GROQ_API_KEY || 'gsk_demo_key';
    try {
      const groqRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const contentStr = groqData.choices[0]?.message?.content;
        if (contentStr) {
          result = JSON.parse(contentStr);
        }
      }
    } catch (e) {
      console.warn('Groq LPU failed, falling back to DeepSeek V3:', e.message);
    }

    // 2. Failover Attempt: DeepSeek V3 Gateway
    if (!result) {
      engineUsed = 'DeepSeek V3 Gateway';
      const deepseekKey = process.env.DEEPSEEK_API_KEY || 'sk-8b1e0e191aa548018aa74b9906a547d1';
      const dsRes = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        })
      });

      if (!dsRes.ok) {
        throw new Error(`LLM Engine Error: ${dsRes.statusText}`);
      }

      const dsData = await dsRes.json();
      const contentStr = dsData.choices[0]?.message?.content;
      result = JSON.parse(contentStr);
    }

    return res.status(200).json({
      success: true,
      engine: engineUsed,
      data: result
    });

  } catch (error) {
    console.error('Veloxis API Error:', error);
    return res.status(500).json({
      error: 'Failed to generate wealth plan',
      details: error.message
    });
  }
};
