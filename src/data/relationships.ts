import type { Relationship } from '../types';
import { clients } from './clients';
import { resetSeed, generateId, randomFrom, weightedRandom } from './generators';

function generateRelationships(): Relationship[] {
  resetSeed(500);
  const relationships: Relationship[] = [];
  const used = new Set<string>();

  // Create small clusters of 3-5 related entities
  const corps = clients.filter(c => c.type === 'Corporation');
  const individuals = clients.filter(c => c.type === 'Individual');
  const trusts = clients.filter(c => c.type === 'Trust');

  // Link individuals to corporations as directors/beneficial owners
  for (const corp of corps.slice(0, 15)) {
    const numLinks = Math.min(individuals.length, Math.floor(Math.random() * 3) + 1);
    for (let i = 0; i < numLinks; i++) {
      const individual = randomFrom(individuals);
      const key = `${individual.id}-${corp.id}`;
      if (used.has(key)) continue;
      used.add(key);

      relationships.push({
        id: `REL-${generateId()}`,
        sourceClientId: individual.id,
        sourceClientName: individual.name,
        targetClientId: corp.id,
        targetClientName: corp.name,
        type: weightedRandom([
          { value: 'beneficial_owner' as const, weight: 40 },
          { value: 'director' as const, weight: 40 },
          { value: 'signatory' as const, weight: 20 },
        ]),
      });
    }
  }

  // Link some trusts to individuals
  for (const trust of trusts) {
    const individual = randomFrom(individuals);
    const key = `${individual.id}-${trust.id}`;
    if (used.has(key)) continue;
    used.add(key);

    relationships.push({
      id: `REL-${generateId()}`,
      sourceClientId: individual.id,
      sourceClientName: individual.name,
      targetClientId: trust.id,
      targetClientName: trust.name,
      type: 'beneficial_owner',
    });
  }

  // Some related accounts between corporations
  for (let i = 0; i < 8 && i < corps.length - 1; i++) {
    const source = corps[i];
    const target = randomFrom(corps.filter(c => c.id !== source.id));
    const key = `${source.id}-${target.id}`;
    if (used.has(key)) continue;
    used.add(key);

    relationships.push({
      id: `REL-${generateId()}`,
      sourceClientId: source.id,
      sourceClientName: source.name,
      targetClientId: target.id,
      targetClientName: target.name,
      type: 'related_account',
    });
  }

  return relationships;
}

export const relationships = generateRelationships();
