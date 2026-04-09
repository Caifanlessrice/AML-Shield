import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Transaction } from '../../types';

interface Props {
  transactions: Transaction[];
}

export function TransactionVolumeChart({ transactions }: Props) {
  const data = useMemo(() => {
    const buckets: Record<string, { date: string; volume: number; count: number }> = {};

    for (const t of transactions) {
      const week = getWeekLabel(t.date);
      if (!buckets[week]) buckets[week] = { date: week, volume: 0, count: 0 };
      buckets[week].volume += t.amount;
      buckets[week].count++;
    }

    return Object.values(buckets)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-12);
  }, [transactions]);

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Transaction Volume (Weekly)</h3>
      <div className="h-48 min-h-[192px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
              }}
              formatter={(value) => [`$${(Number(value) / 1_000_000).toFixed(2)}M`, 'Volume']}
            />
            <Bar
              dataKey="volume"
              fill="#14b8a6"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function getWeekLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
