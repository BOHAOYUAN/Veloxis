import { runMonteCarloSimulation } from '@/lib/engine/monteCarlo';
import { PlanScenario, ScenarioComparison } from '@/types/financial';

export function comparePlanScenarios(
  currentScenario: PlanScenario,
  proposedScenario: PlanScenario,
): ScenarioComparison {
  const sharedSeed = currentScenario.params.randomSeed;
  const current = runMonteCarloSimulation({ ...currentScenario.params, randomSeed: sharedSeed });
  const proposed = runMonteCarloSimulation({ ...proposedScenario.params, randomSeed: sharedSeed });

  return {
    current,
    proposed,
    successProbabilityDelta:
      proposed.metrics.successProbabilityAtPlanEnd - current.metrics.successProbabilityAtPlanEnd,
    medianRetirementAssetDelta:
      proposed.metrics.medianRetirementAsset - current.metrics.medianRetirementAsset,
    medianEndingAssetDelta:
      proposed.metrics.medianEndingAsset - current.metrics.medianEndingAsset,
    annualSavingsDelta: proposed.params.annualSavings - current.params.annualSavings,
    retirementExpenseDelta:
      proposed.params.retirementAnnualExpense - current.params.retirementAnnualExpense,
    retirementAgeDelta: proposed.params.retirementAge - current.params.retirementAge,
    socialSecurityClaimAgeDelta:
      proposed.params.socialSecurityClaimAge - current.params.socialSecurityClaimAge,
  };
}
