import { useState, useMemo, useCallback } from 'react';
import { SimulationParams, SimulationResult, StressScenario } from '@/types/financial';
import { runMonteCarloSimulation, STRESS_SCENARIOS, computeSensitivityMatrix } from '@/lib/engine/monteCarlo';

export const DEFAULT_SIMULATION_PARAMS: SimulationParams = {
  currentAge: 28,
  retirementAge: 60,
  maxAge: 95,
  initialCapital: 800000,
  annualSavings: 120000,
  retirementAnnualExpense: 200000,
  expectedReturn: 0.08,
  inflationRate: 0.025,
  volatility: 0.14,
  simulationsCount: 10000,
};

export function useMonteCarlo(initialParams: SimulationParams = DEFAULT_SIMULATION_PARAMS) {
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Compute main simulation result (10,000 runs)
  const simulationResult: SimulationResult = useMemo(() => {
    return runMonteCarloSimulation(params);
  }, [params]);

  // Compute sensitivity matrix
  const sensitivityMatrix = useMemo(() => {
    return computeSensitivityMatrix(params);
  }, [params]);

  const updateParam = useCallback(<K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const applyStressScenario = useCallback((scenario: StressScenario | null) => {
    if (!scenario) {
      setActiveScenarioId(null);
      setParams(initialParams);
      return;
    }
    setActiveScenarioId(scenario.id);
    const patch = scenario.getPatch(initialParams);
    setParams(prev => ({ ...prev, ...patch }));
  }, [initialParams]);

  return {
    params,
    setParams,
    updateParam,
    simulationResult,
    sensitivityMatrix,
    activeScenarioId,
    applyStressScenario,
    stressScenarios: STRESS_SCENARIOS,
  };
}