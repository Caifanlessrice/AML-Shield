import { getKpiStats } from '../../data';
import { useAnimateNumber } from '../../hooks/useAnimateNumber';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  color?: string;
  icon: JSX.Element;
}

function StatCard({ label, value, suffix, color, icon }: StatCardProps) {
  const animated = useAnimateNumber(value);

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-5 hover:border-primary/20 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-text-muted font-medium uppercase tracking-wider">{label}</div>
          <div className={cn('text-2xl font-bold mt-2', color || 'text-text-primary')}>
            {animated}{suffix}
          </div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function KpiRow() {
  const stats = getKpiStats();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Open Cases"
        value={stats.openCases}
        color="text-risk-medium"
        icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9.5V14a1 1 0 001 1h10a1 1 0 001-1V9.5"/><path d="M1 6l8-3 8 3-8 3-8-3z"/></svg>}
      />
      <StatCard
        label="Resolved (30d)"
        value={stats.resolvedThisMonth}
        color="text-risk-low"
        icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="7"/><path d="M6 9l2 2 4-4"/></svg>}
      />
      <StatCard
        label="Escalated"
        value={stats.escalated}
        color="text-risk-high"
        icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 2l6.928 12H2.072L9 2z"/><path d="M9 7v3M9 12.5v.5"/></svg>}
      />
      <StatCard
        label="SARs Filed"
        value={stats.sarsFiled}
        color="text-primary"
        icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2h7l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M11 2v4h4M6 9h6M6 12h4"/></svg>}
      />
    </div>
  );
}
