import type { Alert } from '../types';
import { clients } from './clients';
import {
  resetSeed, generateId, randomFrom, randomDateTime, weightedRandom, randomFloat
} from './generators';

function generateAlerts(): Alert[] {
  resetSeed(300);
  const alerts: Alert[] = [];
  const now = new Date('2026-04-09');
  const sixMonthsAgo = new Date('2025-10-09');

  const alertDescriptions: Record<Alert['type'], string[]> = {
    structuring: [
      'Multiple transactions below reporting threshold detected',
      'Pattern of deposits just under $10,000 identified',
      'Systematic avoidance of CTR filing thresholds',
    ],
    velocity: [
      'Unusual spike in transaction frequency',
      'Transaction volume exceeds historical baseline by 300%',
      'Rapid succession of transfers within 24-hour period',
    ],
    geographic: [
      'Funds routed through high-risk jurisdictions',
      'Multiple transfers to sanctioned regions detected',
      'Unusual geographic pattern inconsistent with client profile',
    ],
    pep_transaction: [
      'Transaction involving politically exposed person',
      'PEP-linked account received large inbound transfer',
      'Enhanced due diligence triggered for PEP activity',
    ],
    large_cash: [
      'Cash deposit exceeding $50,000',
      'Series of large cash transactions detected',
      'Cash-intensive activity inconsistent with business profile',
    ],
    round_tripping: [
      'Funds returned to originating account via intermediaries',
      'Circular fund flow pattern detected',
      'Potential layering through multiple accounts identified',
    ],
  };

  // Weight alerts toward high-risk clients
  const highRiskClients = clients.filter(c => c.riskLevel === 'high');
  const medRiskClients = clients.filter(c => c.riskLevel === 'medium');
  const lowRiskClients = clients.filter(c => c.riskLevel === 'low');

  for (let i = 0; i < 120; i++) {
    const client = weightedRandom([
      { value: randomFrom(highRiskClients), weight: 55 },
      { value: randomFrom(medRiskClients), weight: 35 },
      { value: randomFrom(lowRiskClients), weight: 10 },
    ]);

    const type = randomFrom<Alert['type']>([
      'structuring', 'velocity', 'geographic', 'pep_transaction', 'large_cash', 'round_tripping'
    ]);

    alerts.push({
      id: `ALT-${generateId()}`,
      clientId: client.id,
      clientName: client.name,
      type,
      severity: weightedRandom<Alert['severity']>([
        { value: 'critical', weight: 10 },
        { value: 'high', weight: 25 },
        { value: 'medium', weight: 40 },
        { value: 'low', weight: 25 },
      ]),
      status: weightedRandom<Alert['status']>([
        { value: 'new', weight: 40 },
        { value: 'investigating', weight: 25 },
        { value: 'escalated', weight: 15 },
        { value: 'resolved', weight: 15 },
        { value: 'dismissed', weight: 5 },
      ]),
      createdAt: randomDateTime(sixMonthsAgo, now),
      description: randomFrom(alertDescriptions[type]),
      amount: Math.random() < 0.7 ? Math.round(randomFloat(5000, 2000000) * 100) / 100 : undefined,
    });
  }

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const alerts = generateAlerts();
