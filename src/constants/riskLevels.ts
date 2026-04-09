import type { RiskLevel } from '../types';

export const riskLevelConfig: Record<RiskLevel, { label: string; description: string }> = {
  high: { label: 'High Risk', description: 'Score 70-100: Requires enhanced due diligence' },
  medium: { label: 'Medium Risk', description: 'Score 40-69: Standard monitoring protocols' },
  low: { label: 'Low Risk', description: 'Score 0-39: Routine compliance checks' },
};
