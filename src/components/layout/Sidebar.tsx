import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { navigation } from '../../constants/navigation';
import { cn } from '../../utils/cn';

const icons: Record<string, ReactNode> = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="7" height="7" rx="1.5" />
      <rect x="11" y="2" width="7" height="4" rx="1.5" />
      <rect x="2" y="11" width="7" height="7" rx="1.5" />
      <rect x="11" y="8" width="7" height="10" rx="1.5" />
    </svg>
  ),
  clients: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="6" r="3.5" />
      <path d="M3 17.5c0-3.5 3.134-6 7-6s7 2.5 7 6" />
    </svg>
  ),
  transactions: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h12M4 7l3-3M4 7l3 3" />
      <path d="M16 13H4M16 13l-3-3M16 13l-3 3" />
    </svg>
  ),
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-border z-40 flex flex-col"
    >
      <div className="h-16 flex items-center px-4 gap-3 border-b border-border">
        <button
          onClick={onToggle}
          className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 4h12v1.5H2zM2 7.25h12v1.5H2zM2 10.5h12V12H2z" />
          </svg>
        </button>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="text-sm font-semibold text-primary tracking-wide">AML</span>
            <span className="text-sm font-semibold text-text-primary tracking-wide"> Shield</span>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navigation.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary/15 text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
            )}
          >
            <span className="flex-shrink-0">{icons[item.icon]}</span>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-text-muted"
          >
            <div className="font-medium text-text-secondary">AML Shield v1.0</div>
            <div className="mt-0.5">Compliance Dashboard</div>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
