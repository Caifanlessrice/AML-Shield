import type { Transaction } from '../types';
import { clients } from './clients';
import {
  resetSeed, generateId, randomFrom, randomDateTime, weightedRandom, randomFloat
} from './generators';

function generateTransactions(): Transaction[] {
  resetSeed(200);
  const transactions: Transaction[] = [];
  const now = new Date('2026-04-09');
  const yearAgo = new Date('2025-04-09');

  const counterpartyNames = [
    'Global Trade Corp', 'First National Bank', 'Pacific Shipping Ltd',
    'Euro Finance AG', 'Sunrise Imports LLC', 'Delta Commodities',
    'Atlas Payment Services', 'Oceanic Holdings', 'Metro Financial Group',
    'Premier Exchange Corp', 'Coastal Freight Inc', 'Nordic Capital Partners',
    'Eastern Star Trading', 'Westbrook Investments', 'Southern Cross Finance',
    'Alpha Securities Ltd', 'Heritage Banking Corp', 'Quantum Payments Inc',
    'Lighthouse Capital', 'Summit Commercial Bank'
  ];

  for (let i = 0; i < 850; i++) {
    const client = randomFrom(clients);
    const isHighRisk = client.riskLevel === 'high';

    // High risk clients get more suspicious amounts
    let amount: number;
    if (isHighRisk && Math.random() < 0.3) {
      // Structuring: just under $10k
      amount = randomFloat(9200, 9950);
    } else {
      amount = weightedRandom([
        { value: randomFloat(50, 5000), weight: 50 },
        { value: randomFloat(5000, 50000), weight: 30 },
        { value: randomFloat(50000, 500000), weight: 15 },
        { value: randomFloat(500000, 5000000), weight: 5 },
      ]);
    }

    const riskFlags: string[] = [];
    if (amount > 9000 && amount < 10000) riskFlags.push('Potential structuring');
    if (amount > 100000 && isHighRisk) riskFlags.push('Large value - high risk client');
    if (client.pepStatus) riskFlags.push('PEP-associated transaction');
    if (['Cayman Islands', 'British Virgin Islands', 'Panama City, Panama'].includes(client.jurisdiction)) {
      if (Math.random() < 0.3) riskFlags.push('High-risk jurisdiction');
    }
    if (Math.random() < 0.02) riskFlags.push('Unusual time pattern');
    if (Math.random() < 0.015) riskFlags.push('Round-tripping indicator');

    const status = riskFlags.length > 0
      ? weightedRandom<Transaction['status']>([
          { value: 'flagged', weight: 40 },
          { value: 'cleared', weight: 30 },
          { value: 'pending', weight: 20 },
          { value: 'blocked', weight: 10 },
        ])
      : weightedRandom<Transaction['status']>([
          { value: 'cleared', weight: 85 },
          { value: 'pending', weight: 15 },
        ]);

    const type = weightedRandom<Transaction['type']>([
      { value: 'wire', weight: 40 },
      { value: 'ach', weight: 30 },
      { value: 'check', weight: 10 },
      { value: 'crypto', weight: 12 },
      { value: 'cash', weight: 8 },
    ]);

    const descriptions: Record<Transaction['type'], string[]> = {
      wire: ['International wire transfer', 'Domestic wire payment', 'Wire remittance'],
      ach: ['ACH direct deposit', 'ACH payment', 'Automated clearing'],
      check: ['Check deposit', 'Cashier\'s check', 'Business check payment'],
      crypto: ['BTC conversion', 'USDT transfer', 'Crypto exchange deposit'],
      cash: ['Cash deposit', 'Cash withdrawal', 'Currency exchange'],
    };

    transactions.push({
      id: `TXN-${generateId()}`,
      clientId: client.id,
      clientName: client.name,
      counterpartyId: `CPT-${generateId()}`,
      counterpartyName: randomFrom(counterpartyNames),
      amount: Math.round(amount * 100) / 100,
      currency: weightedRandom([
        { value: 'USD', weight: 60 },
        { value: 'EUR', weight: 15 },
        { value: 'GBP', weight: 10 },
        { value: 'CHF', weight: 5 },
        { value: 'JPY', weight: 5 },
        { value: 'AED', weight: 5 },
      ]),
      type,
      direction: weightedRandom([
        { value: 'inbound' as const, weight: 45 },
        { value: 'outbound' as const, weight: 55 },
      ]),
      date: randomDateTime(yearAgo, now),
      riskFlags,
      status,
      description: randomFrom(descriptions[type]),
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const transactions = generateTransactions();
