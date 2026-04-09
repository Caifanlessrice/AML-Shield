import { clients } from './clients';
import { transactions } from './transactions';
import { alerts } from './alerts';
import { sars } from './sars';
import { relationships } from './relationships';
import type { KpiStats, RiskLevel } from '../types';

export { clients, transactions, alerts, sars, relationships };

export function getRiskDistribution(): Record<RiskLevel, number> {
  return {
    high: clients.filter(c => c.riskLevel === 'high').length,
    medium: clients.filter(c => c.riskLevel === 'medium').length,
    low: clients.filter(c => c.riskLevel === 'low').length,
  };
}

export function getAlertTrends(days = 30): { date: string; count: number; critical: number }[] {
  const now = new Date('2026-04-09');
  const result: { date: string; count: number; critical: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const dayAlerts = alerts.filter(a => a.createdAt.startsWith(dateStr));
    result.push({
      date: dateStr,
      count: dayAlerts.length,
      critical: dayAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length,
    });
  }

  return result;
}

export function getKpiStats(): KpiStats {
  const activeAlerts = alerts.filter(a => a.status === 'new' || a.status === 'investigating' || a.status === 'escalated');
  const resolvedThisMonth = alerts.filter(a => {
    if (a.status !== 'resolved') return false;
    const d = new Date(a.createdAt);
    return d.getMonth() === 3 && d.getFullYear() === 2026; // April 2026
  });
  const escalated = alerts.filter(a => a.status === 'escalated');
  const filedSars = sars.filter(s => s.status === 'filed' || s.status === 'acknowledged');

  const today = '2026-04-09';
  const alertsToday = alerts.filter(a => a.createdAt.startsWith(today));

  return {
    openCases: activeAlerts.length,
    resolvedThisMonth: resolvedThisMonth.length,
    escalated: escalated.length,
    sarsFiled: filedSars.length,
    totalClients: clients.length,
    highRiskClients: clients.filter(c => c.riskLevel === 'high').length,
    avgRiskScore: Math.round(clients.reduce((s, c) => s + c.riskScore, 0) / clients.length),
    alertsToday: alertsToday.length,
  };
}

export function getClientById(id: string) {
  return clients.find(c => c.id === id);
}

export function getTransactionsForClient(clientId: string) {
  return transactions.filter(t => t.clientId === clientId);
}

export function getAlertsForClient(clientId: string) {
  return alerts.filter(a => a.clientId === clientId);
}

export function getRelationshipsForClient(clientId: string) {
  return relationships.filter(r => r.sourceClientId === clientId || r.targetClientId === clientId);
}

export function getSarsForClient(clientId: string) {
  return sars.filter(s => s.clientId === clientId);
}

export function getTransactionsByType() {
  const result: Record<string, { count: number; totalAmount: number }> = {};
  for (const t of transactions) {
    if (!result[t.type]) result[t.type] = { count: 0, totalAmount: 0 };
    result[t.type].count++;
    result[t.type].totalAmount += t.amount;
  }
  return result;
}

export function getJurisdictionRisk() {
  const result: Record<string, { count: number; avgRisk: number; highRisk: number }> = {};
  for (const c of clients) {
    const region = c.region;
    if (!result[region]) result[region] = { count: 0, avgRisk: 0, highRisk: 0 };
    result[region].count++;
    result[region].avgRisk += c.riskScore;
    if (c.riskLevel === 'high') result[region].highRisk++;
  }
  for (const key of Object.keys(result)) {
    result[key].avgRisk = Math.round(result[key].avgRisk / result[key].count);
  }
  return result;
}
