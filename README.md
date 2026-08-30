# Veloxis — Conversational Financial Planning & Monte Carlo Engine

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Vercel-Serverless-black?logo=vercel)](https://vercel.com)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?logo=node.js)](https://nodejs.org)

Veloxis is an open-source financial planning prototype designed as an architectural benchmark for modern RIA (Registered Investment Advisor) platforms such as RightCapital and eMoney.

It replaces multi-step form wizards with sub-second natural language entity extraction (Groq LPU) and client-side 2D vector rendering for real-time Monte Carlo simulations and estate planning visualizations.

---

## Technical Motivation

1. **Intake Friction**: Standard wealth planning software requires 40+ manual inputs across 8 tabs (assets, liabilities, tax rates, inflation assumptions, withdrawal ordering). Client onboarding drop-off rates often correlate directly with form length.
2. **Compute Latency**: Server-side Monte Carlo simulations (10,000 iterations across a 30-year retirement horizon) frequently introduce 2-5 second network and rendering delays.
3. **Architecture Solution**: Veloxis delegates unstructured entity extraction to Groq's LPU infrastructure (Llama-3.3 70B, ~85ms inference), returning a validated JSON schema. Dynamic probability distributions and visual cards are rendered on the client via `requestAnimationFrame` on an HTML5 2D Canvas.

---

## System Architecture

```
[ User Input (Text / Voice) ]
           │
           ▼
[ Vercel Edge Gateway (/api/generate) ]
           │
     ┌─────┴──────────────────────────────┐
     ▼                                    ▼
[ Groq LPU (Primary) ]           [ DeepSeek V3 (Failover) ]
(Llama-3.3 70B JSON Schema)     (Deterministic Backup)
     │                                    │
     └─────┬──────────────────────────────┘
           ▼
[ Strict JSON Validation Payload ]
           │
           ▼
[ Client-Side Engine (HTML5 2D Canvas) ]
           ├── Monte Carlo Probability Corridor (10k runs)
           ├── Estate & Tax Flowchart Render
           └── Export Engine (4K PDF / 60fps WebM)
```

---

## Performance & Latency Budget

| Component | Target Latency (p50) | Target Latency (p99) | Execution Target |
| :--- | :--- | :--- | :--- |
| **API Gateway Routing** | 12ms | 45ms | Vercel Serverless Edge |
| **Entity Extraction (Groq LPU)** | **85ms** | **180ms** | Llama-3.3 70B (JSON Mode) |
| **Failover (DeepSeek V3)** | 1100ms | 1800ms | HTTP Failover Circuit |
| **Canvas Vector Render** | **16.6ms (60fps)** | 33ms | HTML5 2D Context |

---

## API Specification

### `POST /api/generate`

#### Request Payload
```typescript
interface FinancialIntakeRequest {
  prompt: string;         // Raw prompt e.g., "35 yo, $500k liquid, $200k income..."
  customApiKey?: string;  // Optional client-provided Groq/Gemini API key
  language?: 'en' | 'zh'; // Response localization target
}
```

#### Response Payload (Strict JSON Schema)
```typescript
interface FinancialPlanResponse {
  success: boolean;
  engine: string;
  data: {
    client_summary: string;
    current_age: number;
    retire_age: number;
    liquid_assets: number;
    annual_income: number;
    annual_spending: number;
    monte_carlo_success_rate: number;
    roth_conversion_recommended: boolean;
    tax_savings_estimate: number;
    slides: Array<{
      slide_index: number;
      chapter_label: string;
      title: string;
      subtitle: string;
      metric_box: { value: string; label: string };
      versus?: { old_way: string; new_way: string };
      bullet_points: Array<{ point_title: string; point_desc: string }>;
      takeaway_quote?: string;
    }>;
  };
}
```

#### Example Usage
```bash
curl -X POST https://veloxis.vercel.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Age 35, $500k savings, retire at 55 spending $80k/yr",
    "language": "en"
  }'
```

---

## Environment Variables & Configuration

Create a `.env.local` file in the root directory:

```env
# Primary Sub-Second Inference Engine
GROQ_API_KEY=gsk_your_groq_api_key_here

# Backup LLM Engine
DEEPSEEK_API_KEY=sk_your_deepseek_api_key_here

# Merchant Gateway (Optional for monetization layer)
DODO_PAYMENTS_API_KEY=dodo_your_key_here
```

---

## Development Setup

```bash
# Clone the repository
git clone https://github.com/BOHAOYUAN/Veloxis.git
cd Veloxis

# Serve static files locally (e.g. using static server or Vercel CLI)
npx vercel dev
```

---

## License

MIT License. Distributed for educational and benchmarking purposes.
