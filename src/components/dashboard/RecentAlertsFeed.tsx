import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { alerts } from '../../data';
import { cn } from '../../utils/cn';
import { formatRelativeTime, formatCurrency } from '../../utils/formatters';

export function RecentAlertsFeed() {
  const recent = alerts.slice(0, 15);

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Recent Alerts</h3>
        <span className="text-xs text-text-muted">{alerts.filter(a => a.status === 'new').length} unresolved</span>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {recent.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
          >
            <Link
              to={`/clients/${alert.clientId}`}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-overlay/30 transition-colors group"
            >
              <span className={cn(
                'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                alert.severity === 'critical' && 'bg-red-500 animate-pulse',
                alert.severity === 'high' && 'bg-risk-high',
                alert.severity === 'medium' && 'bg-risk-medium',
                alert.severity === 'low' && 'bg-blue-400',
              )} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">
                    {alert.clientName}
                  </span>
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0',
                    alert.severity === 'critical' && 'bg-red-500/15 text-red-400',
                    alert.severity === 'high' && 'bg-risk-high/15 text-risk-high',
                    alert.severity === 'medium' && 'bg-risk-medium/15 text-risk-medium',
                    alert.severity === 'low' && 'bg-blue-500/15 text-blue-400',
                  )}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5 truncate">{alert.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-muted">{formatRelativeTime(alert.createdAt)}</span>
                  {alert.amount && (
                    <span className="text-xs text-text-muted">&middot; {formatCurrency(alert.amount)}</span>
                  )}
                  <span className={cn(
                    'text-xs capitalize',
                    alert.status === 'new' && 'text-blue-400',
                    alert.status === 'investigating' && 'text-risk-medium',
                    alert.status === 'escalated' && 'text-risk-high',
                    alert.status === 'resolved' && 'text-risk-low',
                    alert.status === 'dismissed' && 'text-text-muted',
                  )}>
                    {alert.status}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
