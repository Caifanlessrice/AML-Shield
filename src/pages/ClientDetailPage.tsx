import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import {
  getClientById, getTransactionsForClient, getAlertsForClient,
  getRelationshipsForClient, getSarsForClient
} from '../data';
import { cn } from '../utils/cn';
import { formatDate, formatDateTime, formatCurrency } from '../utils/formatters';
import { getRiskScoreColor } from '../utils/riskColors';
import { useAnimateNumber } from '../hooks/useAnimateNumber';

type Tab = 'overview' | 'transactions' | 'alerts' | 'relationships';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const client = getClientById(id!);
  if (!client) {
    return (
      <PageTransition>
        <div className="text-center py-20">
          <h2 className="text-xl text-text-primary">Client not found</h2>
          <Link to="/clients" className="text-primary text-sm mt-2 inline-block hover:underline">Back to clients</Link>
        </div>
      </PageTransition>
    );
  }

  const clientTransactions = getTransactionsForClient(client.id);
  const clientAlerts = getAlertsForClient(client.id);
  const clientRelationships = getRelationshipsForClient(client.id);
  const clientSars = getSarsForClient(client.id);
  const animatedScore = useAnimateNumber(client.riskScore);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'transactions', label: 'Transactions', count: clientTransactions.length },
    { key: 'alerts', label: 'Alerts', count: clientAlerts.length },
    { key: 'relationships', label: 'Relationships', count: clientRelationships.length },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <Link to="/clients" className="text-sm text-text-muted hover:text-primary transition-colors inline-flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 3L5 7l4 4"/></svg>
          Back to Clients
        </Link>

        {/* Client Header */}
        <div className="bg-surface-raised border border-border rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">{client.name}</h1>
                {client.pepStatus && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-400 font-medium">PEP</span>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-1">{client.type} &middot; {client.jurisdiction}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold" style={{ color: getRiskScoreColor(client.riskScore) }}>
                {animatedScore}
              </div>
              <div className="text-xs text-text-muted mt-0.5">Risk Score</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <div className="text-xs text-text-muted">Status</div>
              <div className={cn(
                'text-sm font-medium mt-0.5',
                client.status === 'active' && 'text-risk-low',
                client.status === 'inactive' && 'text-text-muted',
                client.status === 'under_review' && 'text-risk-medium',
              )}>
                {client.status.replace('_', ' ')}
              </div>
            </div>
            <div>
              <div className="text-xs text-text-muted">Industry</div>
              <div className="text-sm text-text-primary font-medium mt-0.5">{client.industry}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted">Onboarded</div>
              <div className="text-sm text-text-primary font-medium mt-0.5">{formatDate(client.onboardingDate)}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted">SARs Filed</div>
              <div className="text-sm text-text-primary font-medium mt-0.5">{clientSars.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-surface-raised border border-border rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2',
                activeTab === tab.key
                  ? 'bg-primary/15 text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  activeTab === tab.key ? 'bg-primary/20' : 'bg-surface-overlay'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface-raised border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Client Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-text-muted">Email</span><span className="text-text-primary">{client.email}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Phone</span><span className="text-text-primary">{client.phone}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Region</span><span className="text-text-primary">{client.region}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Client ID</span><span className="text-text-primary font-mono text-xs">{client.id}</span></div>
                </div>
              </div>

              <div className="bg-surface-raised border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Risk Summary</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Jurisdiction Risk', score: client.jurisdiction.includes('Cayman') || client.jurisdiction.includes('Virgin') || client.jurisdiction.includes('Panama') ? 85 : 30 },
                    { label: 'Transaction Pattern', score: Math.min(client.riskScore + 10, 100) },
                    { label: 'PEP Exposure', score: client.pepStatus ? 90 : 10 },
                    { label: 'Account Age', score: new Date(client.onboardingDate) > new Date('2024-01-01') ? 60 : 20 },
                  ].map(factor => (
                    <div key={factor.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-secondary">{factor.label}</span>
                        <span className="font-medium" style={{ color: getRiskScoreColor(factor.score) }}>{factor.score}</span>
                      </div>
                      <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${factor.score}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: getRiskScoreColor(factor.score) }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Counterparty</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Amount</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientTransactions.slice(0, 50).map(txn => (
                      <tr key={txn.id} className="border-b border-border/50 hover:bg-surface-overlay/30 transition-colors">
                        <td className="px-4 py-3 text-text-secondary">{formatDateTime(txn.date)}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5">
                            <span className={cn(
                              'w-1.5 h-1.5 rounded-full',
                              txn.direction === 'inbound' ? 'bg-risk-low' : 'bg-blue-400'
                            )} />
                            {txn.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-text-primary">{txn.counterpartyName}</td>
                        <td className={cn(
                          'px-4 py-3 text-right font-medium',
                          txn.direction === 'inbound' ? 'text-risk-low' : 'text-text-primary'
                        )}>
                          {txn.direction === 'inbound' ? '+' : '-'}{formatCurrency(txn.amount, txn.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            txn.status === 'cleared' && 'bg-risk-low/15 text-risk-low',
                            txn.status === 'pending' && 'bg-risk-medium/15 text-risk-medium',
                            txn.status === 'flagged' && 'bg-risk-high/15 text-risk-high',
                            txn.status === 'blocked' && 'bg-red-500/15 text-red-400',
                          )}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {txn.riskFlags.length > 0 && (
                            <span className="text-xs text-risk-high">{txn.riskFlags[0]}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {clientTransactions.length > 50 && (
                <div className="px-4 py-3 text-xs text-text-muted border-t border-border">
                  Showing 50 of {clientTransactions.length} transactions
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-3">
              {clientAlerts.length === 0 && (
                <div className="bg-surface-raised border border-border rounded-xl p-10 text-center text-text-muted text-sm">
                  No alerts for this client
                </div>
              )}
              {clientAlerts.map(alert => (
                <div key={alert.id} className="bg-surface-raised border border-border rounded-xl p-4 flex items-start gap-4">
                  <div className={cn(
                    'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    alert.severity === 'critical' && 'bg-red-500',
                    alert.severity === 'high' && 'bg-risk-high',
                    alert.severity === 'medium' && 'bg-risk-medium',
                    alert.severity === 'low' && 'bg-blue-400',
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-text-primary">{alert.type.replace('_', ' ')}</span>
                      <span className={cn(
                        'text-xs px-2 py-0.5 rounded-full font-medium',
                        alert.status === 'new' && 'bg-blue-500/15 text-blue-400',
                        alert.status === 'investigating' && 'bg-risk-medium/15 text-risk-medium',
                        alert.status === 'escalated' && 'bg-risk-high/15 text-risk-high',
                        alert.status === 'resolved' && 'bg-risk-low/15 text-risk-low',
                        alert.status === 'dismissed' && 'bg-surface-overlay text-text-muted',
                      )}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{alert.description}</p>
                    <p className="text-xs text-text-muted mt-1">{formatDateTime(alert.createdAt)}</p>
                  </div>
                  {alert.amount && (
                    <span className="text-sm font-medium text-text-primary">{formatCurrency(alert.amount)}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'relationships' && (
            <div className="space-y-3">
              {clientRelationships.length === 0 && (
                <div className="bg-surface-raised border border-border rounded-xl p-10 text-center text-text-muted text-sm">
                  No known relationships
                </div>
              )}
              {clientRelationships.map(rel => {
                const isSource = rel.sourceClientId === client.id;
                const linkedName = isSource ? rel.targetClientName : rel.sourceClientName;
                const linkedId = isSource ? rel.targetClientId : rel.sourceClientId;
                return (
                  <Link
                    key={rel.id}
                    to={`/clients/${linkedId}`}
                    className="block bg-surface-raised border border-border rounded-xl p-4 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{linkedName}</div>
                        <div className="text-xs text-text-muted mt-0.5">{rel.type.replace('_', ' ')}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                        <path d="M6 4l4 4-4 4" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
