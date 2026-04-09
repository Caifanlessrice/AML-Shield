export type RiskLevel = 'high' | 'medium' | 'low';
export type ClientType = 'Individual' | 'Corporation' | 'Trust';
export type ClientStatus = 'active' | 'inactive' | 'under_review';
export type TransactionType = 'wire' | 'ach' | 'check' | 'crypto' | 'cash';
export type TransactionDirection = 'inbound' | 'outbound';
export type TransactionStatus = 'cleared' | 'pending' | 'flagged' | 'blocked';
export type AlertType = 'structuring' | 'velocity' | 'geographic' | 'pep_transaction' | 'large_cash' | 'round_tripping';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'new' | 'investigating' | 'escalated' | 'resolved' | 'dismissed';
export type SarStatus = 'drafting' | 'review' | 'filed' | 'acknowledged';
export type RelationshipType = 'beneficial_owner' | 'director' | 'related_account' | 'signatory';

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  jurisdiction: string;
  region: string;
  onboardingDate: string;
  riskScore: number;
  riskLevel: RiskLevel;
  pepStatus: boolean;
  industry: string;
  status: ClientStatus;
  email: string;
  phone: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  counterpartyId: string;
  counterpartyName: string;
  amount: number;
  currency: string;
  type: TransactionType;
  direction: TransactionDirection;
  date: string;
  riskFlags: string[];
  status: TransactionStatus;
  description: string;
}

export interface Alert {
  id: string;
  clientId: string;
  clientName: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  description: string;
  amount?: number;
}

export interface SAR {
  id: string;
  clientId: string;
  clientName: string;
  alertIds: string[];
  status: SarStatus;
  filedDate: string | null;
  amount: number;
  narrative: string;
}

export interface Relationship {
  id: string;
  sourceClientId: string;
  sourceClientName: string;
  targetClientId: string;
  targetClientName: string;
  type: RelationshipType;
}

export interface RiskFactor {
  category: string;
  description: string;
  score: number;
  weight: number;
}

export interface KpiStats {
  openCases: number;
  resolvedThisMonth: number;
  escalated: number;
  sarsFiled: number;
  totalClients: number;
  highRiskClients: number;
  avgRiskScore: number;
  alertsToday: number;
}
