# Veloxis Wealth OS — Conversational RIA Financial Planning Engine

<p align="center">
  <a href="https://veloxis.lumiere-private.com/"><img src="https://img.shields.io/badge/Live_Demo-veloxis.lumiere--private.com-00DC82?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/Next.js_15-App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React_19-00D8FF?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript_5.7-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vitest-10_Passed-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest Tests" />
</p>

> **Veloxis Wealth OS** is a production-grade, open-source conversational wealth planning platform designed as an architectural benchmark for next-generation RIA (Registered Investment Advisor) ecosystems (e.g., RightCapital, eMoney).
> 
> Built on **Next.js 15 (App Router), React 19, TypeScript 5.7, and Tailwind CSS 4**, it replaces traditional 40+ manual form fields with sub-second natural language entity extraction and executes 10,000-path stochastic Monte Carlo simulations directly on the client side at 60fps.

---

## ⚡ 5 Real-Time Interactive Quantitative Modules

1. **📈 蒙特卡洛扇形推演 (Monte Carlo Fan)**: 10,000-path stochastic life-cycle simulation using Box-Muller Gaussian transforms and `Float64Array` typed array memory optimizations, rendered on HTML5 2D Canvas at 60fps.
2. **🌊 终身现金流桑基图 (Cashflow Sankey)**: Dynamic multi-source inflow (Salary, Social Security, Drawdown) to outflow (Living, Taxes, Discretionary, Reinvestment) vector graph with age slider controls.
3. **💧 资产三桶税收瀑布流 (% 3-Bucket Tax Waterfall)**: Taxable, Tax-Deferred (401k/IRA), and Tax-Free (Roth) allocation engine with an interactive **Roth Conversion Tax Bracket Arbitrage Sandbox**.
4. **🏛️ 财富传承与信托拓扑 (Estate Planning & Trust Topology)**: Living Trust vs Probate Court process topology, calculating 5% legal loss avoidance and stepped-up basis tax benefits.
5. **🔥 宏观压力测试矩阵 (Stress Matrix)**: Scenario patches (e.g., 1970s Stagflation, Tech Crash 2000, 2008 GFC) with real-time sensitivity ruin probability heatmaps.

---

## 🏛️ System Architecture

```
[ User Conversational Financial Prompt ]
                   │
                   ▼
[ Vercel Edge Serverless Gateway (/api/generate/route.ts) ]
                   │
         ┌─────────┴────────────────────────┐
         ▼                                  ▼
[ Groq LPU Engine (85ms) ]        [ Gemini Structured Mode ]
(Llama-3.3 JSON Extraction)       (Failover & Strict Schema)
         │                                  │
         └─────────┬────────────────────────┘
                   ▼
[ TypeScript Zod Defensive Harness Layer (financialSchema.ts) ]
                   │
                   ▼
[ Client-Side Pure TypeScript Quantitative & Visual Engine ]
         ├── 10,000x Monte Carlo (GBM) Simulation (monteCarlo.ts)
         ├── Typed Array (Float64Array) Percentile Compute
         ├── Reactive State Hook (useMonteCarlo.ts)
         └── SVG / Canvas 2D Vector Visualizations (60fps)
```

---

## 🧪 Automated Testing & CI Quality Gate

The project includes **10 automated Vitest unit tests** verifying mathematical distributions, boundary monotonicity, 3-Bucket tax allocations, and estate trust algorithms:

```bash
# Run TypeScript static type checking
npm run type-check

# Run Vitest test suite
npm test
```

Continuous integration is enforced via **GitHub Actions** (`.github/workflows/ci.yml`) on every push and pull request.

---

## 🚀 Quick Start & Local Development

```bash
# Clone the repository
git clone https://github.com/BOHAOYUAN/Veloxis.git
cd Veloxis

# Install dependencies
npm install

# Run local development server
npm run dev
```

Open [https://veloxis.lumiere-private.com/](https://veloxis.lumiere-private.com/) for instant live interactive exploration.

---

## 📄 License

MIT License. Designed for benchmarking modern WealthTech software architectures.
