import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { clients } from '../data';
import { cn } from '../utils/cn';
import { formatDate } from '../utils/formatters';
import type { RiskLevel, ClientType } from '../types';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function ClientsPage() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ClientType | 'all'>('all');

  const filtered = useMemo(() => {
    return clients.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.jurisdiction.toLowerCase().includes(search.toLowerCase())) return false;
      if (riskFilter !== 'all' && c.riskLevel !== riskFilter) return false;
      if (typeFilter !== 'all' && c.type !== typeFilter) return false;
      return true;
    });
  }, [search, riskFilter, typeFilter]);

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Clients</h1>
          <p className="text-base text-text-secondary mt-2">{clients.length} registered clients across all jurisdictions</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3.5 3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or jurisdiction..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map(level => (
              <button
                key={level}
                onClick={() => setRiskFilter(level)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  riskFilter === level
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-surface-raised border-border text-text-secondary hover:text-text-primary'
                )}
              >
                {level === 'all' ? 'All Risk' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(['all', 'Individual', 'Corporation', 'Trust'] as const).map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  typeFilter === type
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-surface-raised border-border text-text-secondary hover:text-text-primary'
                )}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-text-muted">{filtered.length} clients found</div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map(client => (
            <motion.div key={client.id} variants={fadeUp}>
              <Link
                to={`/clients/${client.id}`}
                className="block bg-surface-raised border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{client.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5">{client.type}</p>
                  </div>
                  <span className={cn(
                    'text-xs px-2.5 py-1 rounded-full font-medium',
                    client.riskLevel === 'high' && 'bg-risk-high/15 text-risk-high',
                    client.riskLevel === 'medium' && 'bg-risk-medium/15 text-risk-medium',
                    client.riskLevel === 'low' && 'bg-risk-low/15 text-risk-low',
                  )}>
                    {client.riskScore}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-text-secondary">
                  <div className="flex justify-between">
                    <span>Jurisdiction</span>
                    <span className="text-text-primary">{client.jurisdiction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Industry</span>
                    <span className="text-text-primary">{client.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Onboarded</span>
                    <span className="text-text-primary">{formatDate(client.onboardingDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  {client.pepStatus && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-medium">PEP</span>
                  )}
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    client.status === 'active' && 'bg-risk-low/15 text-risk-low',
                    client.status === 'inactive' && 'bg-surface-overlay text-text-muted',
                    client.status === 'under_review' && 'bg-risk-medium/15 text-risk-medium',
                  )}>
                    {client.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
