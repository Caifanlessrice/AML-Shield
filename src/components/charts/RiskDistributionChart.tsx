import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getRiskDistribution } from '../../data';
import { riskColorMap } from '../../utils/riskColors';

export function RiskDistributionChart() {
  const dist = getRiskDistribution();
  const data = [
    { name: 'High Risk', value: dist.high, color: riskColorMap.high.hex },
    { name: 'Medium Risk', value: dist.medium, color: riskColorMap.medium.hex },
    { name: 'Low Risk', value: dist.low, color: riskColorMap.low.hex },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Client Risk Distribution</h3>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 min-w-[160px] min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'var(--color-text-primary)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {data.map(item => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-text-secondary">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-text-primary">{item.value}</span>
                <span className="text-xs text-text-muted ml-1">({((item.value / total) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
