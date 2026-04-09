import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { sars } from '../../data';

export function SarPipelineChart() {
  const pipeline = [
    { stage: 'Drafting', count: sars.filter(s => s.status === 'drafting').length, color: '#64748b' },
    { stage: 'Review', count: sars.filter(s => s.status === 'review').length, color: '#f59e0b' },
    { stage: 'Filed', count: sars.filter(s => s.status === 'filed').length, color: '#14b8a6' },
    { stage: 'Acknowledged', count: sars.filter(s => s.status === 'acknowledged').length, color: '#10b981' },
  ];

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-1">SAR Pipeline</h3>
      <p className="text-xs text-text-muted mb-4">{sars.length} total Suspicious Activity Reports</p>
      <div className="h-48 min-h-[192px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={pipeline} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={1000}>
              {pipeline.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
