import { motion } from 'framer-motion';
import { getJurisdictionRisk } from '../../data';
import { getRiskScoreColor } from '../../utils/riskColors';

export function GeoRiskMap() {
  const data = getJurisdictionRisk();
  const regions = Object.entries(data)
    .map(([region, stats]) => ({ region, ...stats }))
    .sort((a, b) => b.avgRisk - a.avgRisk);

  const maxCount = Math.max(...regions.map(r => r.count));

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-1">Geographic Risk Distribution</h3>
      <p className="text-xs text-text-muted mb-4">Client concentration by region</p>
      <div className="space-y-3">
        {regions.map((region, i) => (
          <div key={region.region} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{region.region}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">{region.count} clients</span>
                {region.highRisk > 0 && (
                  <span className="text-xs text-risk-high">{region.highRisk} high risk</span>
                )}
                <span className="text-sm font-semibold w-8 text-right" style={{ color: getRiskScoreColor(region.avgRisk) }}>
                  {region.avgRisk}
                </span>
              </div>
            </div>
            <div className="h-2 bg-surface-overlay rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(region.count / maxCount) * 100}%` }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: getRiskScoreColor(region.avgRisk) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
