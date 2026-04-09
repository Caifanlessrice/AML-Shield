import type { RiskLevel, AlertSeverity } from '../types';

export const riskColorMap: Record<RiskLevel, { bg: string; text: string; hex: string; border: string }> = {
  high: { bg: 'bg-risk-high/15', text: 'text-risk-high', hex: '#f43f5e', border: 'border-risk-high/30' },
  medium: { bg: 'bg-risk-medium/15', text: 'text-risk-medium', hex: '#f59e0b', border: 'border-risk-medium/30' },
  low: { bg: 'bg-risk-low/15', text: 'text-risk-low', hex: '#10b981', border: 'border-risk-low/30' },
};

export const severityColorMap: Record<AlertSeverity, { bg: string; text: string; hex: string }> = {
  critical: { bg: 'bg-red-500/15', text: 'text-red-400', hex: '#ef4444' },
  high: { bg: 'bg-risk-high/15', text: 'text-risk-high', hex: '#f43f5e' },
  medium: { bg: 'bg-risk-medium/15', text: 'text-risk-medium', hex: '#f59e0b' },
  low: { bg: 'bg-blue-500/15', text: 'text-blue-400', hex: '#3b82f6' },
};

export function getRiskColor(level: RiskLevel) {
  return riskColorMap[level];
}

export function getSeverityColor(severity: AlertSeverity) {
  return severityColorMap[severity];
}

export function getRiskScoreColor(score: number): string {
  if (score >= 70) return '#f43f5e';
  if (score >= 40) return '#f59e0b';
  return '#10b981';
}
