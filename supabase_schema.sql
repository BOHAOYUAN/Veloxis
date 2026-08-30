-- ==============================================================================
-- VELOXIS AI — Enterprise Multi-Tenant RIA Wealth Management Database Schema
-- Standard: PostgreSQL 15+ / Supabase RLS (Row-Level Security)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. RIA Advisors / Organization Table
CREATE TABLE IF NOT EXISTS public.advisors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  firm_name TEXT NOT NULL DEFAULT 'Apex Wealth Partners RIA',
  advisor_name TEXT NOT NULL DEFAULT 'Senior Wealth Advisor',
  subscription_tier TEXT NOT NULL DEFAULT 'pro', -- 'trial', 'pro', 'enterprise'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HNW Clients Table (Managed by Advisors)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES public.advisors(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  current_age INT NOT NULL DEFAULT 35,
  target_retire_age INT NOT NULL DEFAULT 55,
  end_age INT NOT NULL DEFAULT 85,
  liquid_assets NUMERIC(15, 2) NOT NULL DEFAULT 500000.00,
  annual_spending NUMERIC(15, 2) NOT NULL DEFAULT 80000.00,
  equity_ratio NUMERIC(4, 2) NOT NULL DEFAULT 0.75,
  tax_savings NUMERIC(15, 2) NOT NULL DEFAULT 145000.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Financial Scenarios & Monte Carlo Snapshot Table (Plan A vs Plan B)
CREATE TABLE IF NOT EXISTS public.financial_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL DEFAULT 'Plan A (Base Guardrail)',
  monte_carlo_success_rate INT NOT NULL DEFAULT 96,
  median_age85_assets NUMERIC(15, 2) NOT NULL DEFAULT 1840000.00,
  stress_mode TEXT NOT NULL DEFAULT 'none', -- 'none', 'gfc2008', 'dotcom', 'stagflation'
  scenario_parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FINRA / SEC Compliance Audit Trail Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES public.advisors(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'GENERATE_PLAN', 'EXPORT_4K_PDF', 'FINRA_STRESS_TEST', 'SWITCH_SCENARIO'
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) & Public Access Policies
-- ==============================================================================
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow read & write for demonstration and authorized clients
CREATE POLICY "Public Read Clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Public Insert Clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Clients" ON public.clients FOR UPDATE USING (true);

CREATE POLICY "Public Read Scenarios" ON public.financial_scenarios FOR SELECT USING (true);
CREATE POLICY "Public Insert Scenarios" ON public.financial_scenarios FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Scenarios" ON public.financial_scenarios FOR UPDATE USING (true);

CREATE POLICY "Public Read Audit" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Public Insert Audit" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- Default Seed Data (3 High-Net-Worth RIA Client Profiles)
-- ==============================================================================
INSERT INTO public.advisors (id, email, firm_name, advisor_name, subscription_tier)
VALUES ('a0000000-0000-0000-0000-000000000001', 'advisor@veloxis.ai', 'Apex Wealth Partners RIA', 'Lead Senior Partner', 'enterprise')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.clients (id, advisor_id, client_name, current_age, target_retire_age, end_age, liquid_assets, annual_spending, equity_ratio, tax_savings)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Sarah Lin', 35, 55, 85, 500000.00, 80000.00, 0.75, 145000.00),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'David Miller', 42, 60, 88, 1200000.00, 110000.00, 0.80, 280000.00),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Michael Chang', 58, 65, 90, 2800000.00, 160000.00, 0.70, 540000.00)
ON CONFLICT (id) DO NOTHING;
