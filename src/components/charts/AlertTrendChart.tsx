import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getAlertTrends } from '../../data';

export function AlertTrendChart() {
  const data = getAlertTrends(30).map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Alert Trends (30 Days)</h3>
      <div className="h-48 min-h-[192px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
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
            <Area
              type="monotone"
              dataKey="count"
              name="Total Alerts"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#alertGrad)"
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="critical"
              name="High/Critical"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#criticalGrad)"
              animationDuration={1400}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
