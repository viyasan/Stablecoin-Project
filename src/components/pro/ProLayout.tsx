import { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ProDataProvider, useProData } from './ProDataProvider';
import { ProTickerBar } from './ProTickerBar';
import { ProSidebar } from './ProSidebar';

function ProLayoutInner() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { stablecoins } = useProData();

  const top10 = useMemo(
    () =>
      (stablecoins.data ?? []).slice(0, 10).map((c) => ({
        symbol: c.symbol,
        name: c.name,
        marketCap: c.marketCap,
      })),
    [stablecoins.data]
  );

  return (
    <div className="min-h-screen bg-pro-bg text-pro-text pro-scrollbar">
      <ProTickerBar />
      <ProSidebar
        stablecoins={top10}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-11 right-2 z-40 p-1.5 rounded bg-pro-surface border border-pro-border text-pro-text-secondary hover:text-pro-text"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Main content area — offset for ticker bar (h-10 = 40px) and sidebar */}
      <main
        className={`pt-10 transition-[margin] duration-200 ease-in-out ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export function ProLayout() {
  return (
    <ProDataProvider>
      <ProLayoutInner />
    </ProDataProvider>
  );
}
