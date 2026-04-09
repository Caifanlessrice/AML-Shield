import type { Client } from '../types';
import {
  resetSeed, generateId, randomFrom, randomDate, randomBetween, weightedRandom,
  FIRST_NAMES, LAST_NAMES, COMPANY_NAMES, TRUST_NAMES, JURISDICTIONS, INDUSTRIES
} from './generators';

function generateClients(): Client[] {
  resetSeed(100);
  const clients: Client[] = [];

  for (let i = 0; i < 60; i++) {
    const type = weightedRandom<Client['type']>([
      { value: 'Individual', weight: 60 },
      { value: 'Corporation', weight: 30 },
      { value: 'Trust', weight: 10 },
    ]);

    let name: string;
    if (type === 'Individual') {
      name = `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`;
    } else if (type === 'Corporation') {
      name = randomFrom(COMPANY_NAMES);
    } else {
      name = randomFrom(TRUST_NAMES);
    }

    const riskScore = weightedRandom([
      { value: randomBetween(70, 98), weight: 15 },
      { value: randomBetween(40, 69), weight: 35 },
      { value: randomBetween(5, 39), weight: 50 },
    ]);

    const riskLevel = riskScore >= 70 ? 'high' as const : riskScore >= 40 ? 'medium' as const : 'low' as const;
    const jurisdiction = randomFrom(JURISDICTIONS);
    const pepStatus = Math.random() < 0.08;

    clients.push({
      id: `CLI-${generateId()}`,
      name,
      type,
      jurisdiction: jurisdiction.name,
      region: jurisdiction.region,
      onboardingDate: randomDate(new Date('2019-01-01'), new Date('2025-12-01')),
      riskScore,
      riskLevel,
      pepStatus,
      industry: randomFrom(INDUSTRIES),
      status: weightedRandom([
        { value: 'active' as const, weight: 75 },
        { value: 'inactive' as const, weight: 15 },
        { value: 'under_review' as const, weight: 10 },
      ]),
      email: `${name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12)}@${randomFrom(['gmail.com', 'outlook.com', 'corporate.net', 'business.co'])}`,
      phone: `+${randomBetween(1, 99)} ${randomBetween(100, 999)} ${randomBetween(1000, 9999)}`,
    });
  }

  return clients;
}

export const clients = generateClients();
