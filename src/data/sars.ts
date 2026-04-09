import type { SAR } from '../types';
import { alerts } from './alerts';
import { clients } from './clients';
import {
  resetSeed, generateId, randomFrom, randomDate, weightedRandom, randomFloat
} from './generators';

function generateSARs(): SAR[] {
  resetSeed(400);
  const sars: SAR[] = [];

  // Pick clients that have alerts with severity high or critical
  const escalatedAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const clientIds = [...new Set(escalatedAlerts.map(a => a.clientId))];

  const narratives = [
    'Subject engaged in pattern of structured cash deposits below CTR threshold over 30-day period. Total deposits of approximately $87,000 across 12 transactions. No apparent legitimate business purpose identified.',
    'Wire transfers totaling $1.2M routed through multiple shell companies in high-risk jurisdictions. Beneficial ownership unclear despite enhanced due diligence efforts.',
    'PEP-associated account received multiple large inbound transfers inconsistent with declared income sources. Client provided insufficient documentation when questioned.',
    'Circular fund flows detected between three related accounts, potentially indicative of layering activity. Funds originated from high-risk jurisdiction.',
    'Rapid increase in crypto-to-fiat conversions following a period of dormancy. Pattern consistent with integration phase of money laundering.',
    'Client operating cash-intensive business with deposits significantly exceeding industry norms. Third-party deposits from unrelated individuals observed.',
  ];

  for (let i = 0; i < 25 && i < clientIds.length; i++) {
    const clientId = clientIds[i];
    const client = clients.find(c => c.id === clientId)!;
    const clientAlerts = escalatedAlerts.filter(a => a.clientId === clientId);
    const status = weightedRandom<SAR['status']>([
      { value: 'drafting', weight: 16 },
      { value: 'review', weight: 24 },
      { value: 'filed', weight: 48 },
      { value: 'acknowledged', weight: 12 },
    ]);

    sars.push({
      id: `SAR-${generateId()}`,
      clientId,
      clientName: client.name,
      alertIds: clientAlerts.slice(0, 3).map(a => a.id),
      status,
      filedDate: status === 'filed' || status === 'acknowledged'
        ? randomDate(new Date('2025-06-01'), new Date('2026-04-01'))
        : null,
      amount: Math.round(randomFloat(25000, 3000000) * 100) / 100,
      narrative: randomFrom(narratives),
    });
  }

  return sars;
}

export const sars = generateSARs();
