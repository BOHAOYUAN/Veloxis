-- ==============================================================================
-- VELOXIS AI 4.0 — Enterprise Multi-Tenant RIA SaaS Database Schema
-- Standard: PostgreSQL 15+ / Supabase RLS (Row-Level Security)
-- Security: auth.uid() scoped RLS, Postgres Trigger auto-provision advisor row
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- advisors.id = auth.uid() (1:1 with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.advisors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  firm_name TEXT NOT NULL DEFAULT 'My Wealth Advisory',
  advisor_name TEXT NOT NULL DEFAULT 'Financial Advisor',
  logo_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'trial',
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID NOT NULL REFERENCES public.advisors(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  current_age INT NOT NULL DEFAULT 35 CHECK (current_age BETWEEN 18 AND 100),
  target_retire_age INT NOT NULL DEFAULT 55 CHECK (target_retire_age BETWEEN 18 AND 100),
  end_age INT NOT NULL DEFAULT 85 CHECK (end_age BETWEEN 50 AND 120),
  liquid_assets NUMERIC(15, 2) NOT NULL DEFAULT 500000.00 CHECK (liquid_assets >= 0),
  annual_spending NUMERIC(15, 2) NOT NULL DEFAULT 80000.00 CHECK (annual_spending >= 0),
  equity_ratio NUMERIC(4, 2) NOT NULL DEFAULT 0.75 CHECK (equity_ratio BETWEEN 0 AND 1),
  ss_claim_age INT NOT NULL DEFAULT 67 CHECK (ss_claim_age BETWEEN 62 AND 70),
  ss_monthly_pia NUMERIC(10, 2) NOT NULL DEFAULT 2500.00,
  tax_savings NUMERIC(15, 2) NOT NULL DEFAULT 145000.00,
  notes TEXT,
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL DEFAULT 'Plan A (Base Guardrail)',
  monte_carlo_success_rate INT NOT NULL DEFAULT 96,
  median_age85_assets NUMERIC(15, 2) NOT NULL DEFAULT 1840000.00,
  stress_mode TEXT NOT NULL DEFAULT 'none',
  scenario_parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES public.advisors(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_clients_advisor_id ON public.clients(advisor_id);
CREATE INDEX IF NOT EXISTS idx_clients_archived ON public.clients(advisor_id, archived);
CREATE INDEX IF NOT EXISTS idx_audit_logs_advisor ON public.audit_logs(advisor_id, created_at DESC);

-- ==============================================================================
-- TRIGGER: Auto-create advisor row when user registers (auth.users INSERT)
-- Onboarding only needs UPDATE — no frontend INSERT permission needed
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.advisors (id, email, firm_name, advisor_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'firm_name', 'My Wealth Advisory'),
    COALESCE(NEW.raw_user_meta_data->>'advisor_name', 'Financial Advisor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY — auth.uid() scoped, FOR ALL with WITH CHECK
-- ==============================================================================
ALTER TABLE public.advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Clients" ON public.clients;
DROP POLICY IF EXISTS "Public Insert Clients" ON public.clients;
DROP POLICY IF EXISTS "Public Update Clients" ON public.clients;
DROP POLICY IF EXISTS "Public Read Scenarios" ON public.financial_scenarios;
DROP POLICY IF EXISTS "Public Insert Scenarios" ON public.financial_scenarios;
DROP POLICY IF EXISTS "Public Update Scenarios" ON public.financial_scenarios;
DROP POLICY IF EXISTS "Public Read Audit" ON public.audit_logs;
DROP POLICY IF EXISTS "Public Insert Audit" ON public.audit_logs;

CREATE POLICY "Advisors can manage own profile" ON public.advisors
  FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Advisors can manage own clients" ON public.clients
  FOR ALL
  USING (advisor_id = auth.uid())
  WITH CHECK (advisor_id = auth.uid());

CREATE POLICY "Advisors can manage own scenarios" ON public.financial_scenarios
  FOR ALL
  USING (client_id IN (SELECT id FROM public.clients WHERE advisor_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM public.clients WHERE advisor_id = auth.uid()));

CREATE POLICY "Advisors can write own audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (advisor_id = auth.uid());

CREATE POLICY "Advisors can read own audit logs" ON public.audit_logs
  FOR SELECT USING (advisor_id = auth.uid());

-- ==============================================================================
-- UPDATED_AT Trigger
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_advisors_updated_at ON public.advisors;
CREATE TRIGGER set_advisors_updated_at
  BEFORE UPDATE ON public.advisors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_clients_updated_at ON public.clients;
CREATE TRIGGER set_clients_updated_at
  BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
