import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/layout/PageTransition';
import { TransactionVolumeChart } from '../components/charts/TransactionVolumeChart';
import { transactions } from '../data';
import { cn } from '../utils/cn';
import { formatDateTime, formatCurrency } from '../utils/formatters';
import type { TransactionType, TransactionStatus } from '../types';

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [selectedTxn, setSelectedTxn] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (search && !t.clientName.toLowerCase().includes(search.toLowerCase()) && !t.counterpartyName.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      return true;
    });
  }, [search, typeFilter, statusFilter]);

  const selectedTransaction = selectedTxn ? transactions.find(t => t.id === selectedTxn) : null;

  const flaggedCount = filtered.filter(t => t.riskFlags.length > 0).length;
  const totalVolume = filtered.reduce((sum, t) => sum + t.amount, 0);

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Transaction Monitoring</h1>
          <p className="text-base text-text-secondary mt-2">Monitor and investigate transaction flows across all clients</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Transactions', value: filtered.length.toLocaleString(), color: 'text-text-primary' },
            { label: 'Total Volume', value: `$${(totalVolume / 1_000_000).toFixed(1)}M`, color: 'text-primary' },
            { label: 'Flagged', value: flaggedCount.toString(), color: 'text-risk-high' },
            { label: 'Pending Review', value: filtered.filter(t => t.status === 'pending').length.toString(), color: 'text-risk-medium' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface-raised border border-border rounded-xl p-4">
              <div className="text-xs text-text-muted">{stat.label}</div>
              <div className={cn('text-xl font-bold mt-1', stat.color)}>{stat.value}</div>
            </div>
          ))}
        </div>

        <TransactionVolumeChart transactions={filtered} />

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3.5 3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search by client or counterparty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
            />
          </div>

          <div className="flex gap-2">
            {(['all', 'wire', 'ach', 'check', 'crypto', 'cash'] as const).map(type => (
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
                {type === 'all' ? 'All Types' : type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(['all', 'cleared', 'pending', 'flagged', 'blocked'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  statusFilter === status
                    ? 'bg-primary/15 border-primary/30 text-primary'
                    : 'bg-surface-raised border-border text-text-secondary hover:text-text-primary'
                )}
              >
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Counterparty</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Flags</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(txn => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn.id)}
                    className={cn(
                      'border-b border-border/50 hover:bg-surface-overlay/30 transition-colors cursor-pointer',
                      txn.riskFlags.length > 0 && 'bg-risk-high/[0.03]'
                    )}
                  >
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateTime(txn.date)}</td>
                    <td className="px-4 py-3 text-text-primary font-medium">{txn.clientName}</td>
                    <td className="px-4 py-3 text-text-secondary">{txn.counterpartyName}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          txn.direction === 'inbound' ? 'bg-risk-low' : 'bg-blue-400'
                        )} />
                        {txn.type}
                      </span>
                    </td>
                    <td className={cn(
                      'px-4 py-3 text-right font-medium whitespace-nowrap',
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
                        <span className="text-xs text-risk-high flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1l5.196 9H.804L6 1z"/></svg>
                          {txn.riskFlags.length}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-xs text-text-muted border-t border-border">
            Showing {Math.min(100, filtered.length)} of {filtered.length} transactions
          </div>
        </div>

        {/* Transaction Detail Modal */}
        <AnimatePresence>
          {selectedTransaction && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => setSelectedTxn(null)}
              />
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-surface-raised border-t border-border rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto"
              >
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-text-primary">Transaction Detail</h2>
                    <button
                      onClick={() => setSelectedTxn(null)}
                      className="w-8 h-8 rounded-lg bg-surface-overlay flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l8 8M11 3l-8 8"/></svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-text-muted">Transaction ID</div>
                        <div className="text-sm text-text-primary font-mono mt-0.5">{selectedTransaction.id}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">Client</div>
                        <div className="text-sm text-text-primary font-medium mt-0.5">{selectedTransaction.clientName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">Counterparty</div>
                        <div className="text-sm text-text-primary font-medium mt-0.5">{selectedTransaction.counterpartyName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">Description</div>
                        <div className="text-sm text-text-primary mt-0.5">{selectedTransaction.description}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-text-muted">Amount</div>
                        <div className="text-xl font-bold text-text-primary mt-0.5">
                          {selectedTransaction.direction === 'inbound' ? '+' : '-'}{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">Date & Time</div>
                        <div className="text-sm text-text-primary mt-0.5">{formatDateTime(selectedTransaction.date)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-text-muted">Type / Direction</div>
                        <div className="text-sm text-text-primary mt-0.5 capitalize">{selectedTransaction.type} &middot; {selectedTransaction.direction}</div>
                      </div>
                      {selectedTransaction.riskFlags.length > 0 && (
                        <div>
                          <div className="text-xs text-text-muted mb-1">Risk Flags</div>
                          <div className="space-y-1">
                            {selectedTransaction.riskFlags.map((flag, i) => (
                              <div key={i} className="text-xs px-2.5 py-1.5 rounded-lg bg-risk-high/10 text-risk-high border border-risk-high/20">
                                {flag}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
