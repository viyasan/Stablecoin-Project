import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Shield,
  Newspaper,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Coins,
} from 'lucide-react';

interface ProSidebarProps {
  stablecoins: { symbol: string; name: string; marketCap: number }[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const STABLECOIN_COLORS: Record<string, string> = {
  USDT: '#26A17B',
  USDC: '#2775CA',
  DAI: '#F5AC37',
  FRAX: '#000000',
  TUSD: '#002868',
  USDP: '#00A650',
  USDD: '#216FDB',
  GUSD: '#00DCFA',
  LUSD: '#745DDF',
  FDUSD: '#25B770',
  PYUSD: '#0070E0',
  USDe: '#1A1A2E',
  BUSD: '#F0B90B',
  DOLA: '#7C3AED',
  CRVUSD: '#0000FF',
  GHO: '#9B59B6',
  EURC: '#2775CA',
  USDS: '#1AAB9B',
};

function getStablecoinColor(symbol: string): string {
  return STABLECOIN_COLORS[symbol.toUpperCase()] ?? '#6B7280';
}

const navItemBase =
  'flex items-center gap-3 px-4 py-2 text-sm font-mono text-pro-text-secondary hover:bg-pro-hover hover:text-pro-text transition-colors';
const navItemCollapsed =
  'flex items-center justify-center px-0 py-2 text-sm font-mono text-pro-text-secondary hover:bg-pro-hover hover:text-pro-text transition-colors';
const activeClass = 'text-gold-500 bg-pro-hover';
const sectionLabel =
  'text-[10px] font-mono uppercase tracking-widest text-pro-text-muted px-4 py-2';

const toolLinks = [
  { to: '/yields', label: 'Yields', icon: TrendingUp },
  { to: '/countries', label: 'Regulation', icon: Shield },
  { to: '/news', label: 'News', icon: Newspaper },
];

export function ProSidebar({
  stablecoins,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onMobileClose,
}: ProSidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo / Title */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-pro-border">
        <div className="flex items-center gap-2 min-w-0">
          <Coins className="w-5 h-5 text-gold-500 shrink-0" />
          {!isCollapsed && (
            <span className="font-mono text-xs font-semibold tracking-widest text-pro-text truncate">
              STABLECOINSTATS
            </span>
          )}
        </div>
        {/* Collapse toggle - hidden on mobile overlay */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-6 h-6 rounded text-pro-text-muted hover:text-pro-text hover:bg-pro-hover transition-colors shrink-0"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Scrollable nav area */}
      <nav className="flex-1 overflow-y-auto py-2 pro-scrollbar">
        {/* Dashboard link */}
        <NavLink
          to="/pro"
          end
          onClick={onMobileClose}
          className={({ isActive }) =>
            `${isCollapsed ? navItemCollapsed : navItemBase} ${isActive ? activeClass : ''}`
          }
          title="Dashboard"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>

        {/* Top 10 section */}
        <div className="mt-4">
          {!isCollapsed && <div className={sectionLabel}>Top 10</div>}
          {isCollapsed && (
            <div className="flex justify-center py-2">
              <div className="w-4 border-t border-pro-border" />
            </div>
          )}
          {stablecoins.map((coin) => (
            <NavLink
              key={coin.symbol}
              to={`/pro/${coin.symbol.toLowerCase()}`}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `${isCollapsed ? navItemCollapsed : navItemBase} ${isActive ? activeClass : ''}`
              }
              title={`${coin.symbol} - ${coin.name}`}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: getStablecoinColor(coin.symbol) }}
              />
              {!isCollapsed && (
                <span className="truncate">{coin.symbol}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Tools section */}
        <div className="mt-4">
          {!isCollapsed && <div className={sectionLabel}>Tools</div>}
          {isCollapsed && (
            <div className="flex justify-center py-2">
              <div className="w-4 border-t border-pro-border" />
            </div>
          )}
          {toolLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onMobileClose}
              className={isCollapsed ? navItemCollapsed : navItemBase}
              title={item.label}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Back to main site */}
      <div className="border-t border-pro-border py-2">
        <Link
          to="/"
          onClick={onMobileClose}
          className={isCollapsed ? navItemCollapsed : navItemBase}
          title="Back to main site"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Back</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed top-10 left-0 bottom-0 z-30 bg-pro-surface border-r border-pro-border transition-[width] duration-200 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-screen z-50 w-60 bg-pro-surface border-r border-pro-border transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
