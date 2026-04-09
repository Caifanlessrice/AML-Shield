export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export const navigation: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: 'dashboard' },
  { label: 'Clients', path: '/clients', icon: 'clients' },
  { label: 'Transactions', path: '/transactions', icon: 'transactions' },
];
