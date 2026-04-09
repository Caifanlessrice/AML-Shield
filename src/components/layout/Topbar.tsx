import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { clients } from '../../data';
import { cn } from '../../utils/cn';

interface TopbarProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export function Topbar({ onMenuClick, isMobile }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredClients = search.length >= 2
    ? clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 h-14 md:h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center gap-3 px-4 md:px-8 lg:px-12 transition-all duration-300">
      {/* Hamburger / sidebar toggle */}
      <button
        onClick={onMenuClick}
        className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all flex-shrink-0"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 4h12v1.5H2zM2 7.25h12v1.5H2zM2 10.5h12V12H2z" />
        </svg>
      </button>

      {/* Logo on mobile */}
      {isMobile && (
        <div className="flex-shrink-0">
          <span className="text-sm font-semibold text-primary">AML</span>
          <span className="text-sm font-semibold text-text-primary"> Shield</span>
        </div>
      )}

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3.5 3.5" />
        </svg>
        <input
          type="text"
          placeholder={isMobile ? "Search..." : "Search clients..."}
          value={search}
          onChange={e => { setSearch(e.target.value); setShowResults(true); }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="w-full pl-10 pr-4 py-2 bg-surface-raised border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25 transition-all"
        />
        {showResults && filteredClients.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-raised border border-border rounded-lg shadow-2xl overflow-hidden z-50">
            {filteredClients.map(client => (
              <button
                key={client.id}
                onClick={() => { navigate(`/clients/${client.id}`); setSearch(''); setShowResults(false); }}
                className="w-full px-4 py-3 text-left hover:bg-surface-overlay/50 transition-colors flex items-center gap-3"
              >
                <span className="text-sm text-text-primary font-medium">{client.name}</span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  client.riskLevel === 'high' && 'bg-risk-high/15 text-risk-high',
                  client.riskLevel === 'medium' && 'bg-risk-medium/15 text-risk-medium',
                  client.riskLevel === 'low' && 'bg-risk-low/15 text-risk-low',
                )}>
                  {client.riskLevel}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg bg-surface-raised border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-primary/30 transition-all"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1A.5.5 0 018 1zm0 11a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1A.5.5 0 018 12zm7-4a.5.5 0 01-.5.5h-1a.5.5 0 010-1h1A.5.5 0 0115 8zM4 8a.5.5 0 01-.5.5h-1a.5.5 0 010-1h1A.5.5 0 014 8zm9.354-4.646a.5.5 0 010 .707l-.707.708a.5.5 0 01-.707-.708l.707-.707a.5.5 0 01.707 0zM4.06 11.94a.5.5 0 010 .707l-.707.708a.5.5 0 01-.707-.708l.707-.707a.5.5 0 01.707 0zm9.88 0a.5.5 0 01-.707.707l-.708-.707a.5.5 0 01.708-.707l.707.707zM4.06 4.06a.5.5 0 01-.707.707l-.708-.707a.5.5 0 11.708-.707l.707.707zM8 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.2 1.1a.5.5 0 00-.6.6A5 5 0 0010.3 6.3a.5.5 0 00.6-.6 7 7 0 11-4.7-4.6z" />
            </svg>
          )}
        </button>

        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
          KM
        </div>
      </div>
    </header>
  );
}
