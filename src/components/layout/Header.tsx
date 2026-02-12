import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

// Maple Leaf icon component (Font Awesome Canadian maple leaf) - custom icon not in Lucide
function MapleLeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 512 512"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M383.8 351.7c2.5-2.5 105.2-92.4 105.2-92.4l-17.5-7.5c-10-4.9-7.4-11.5-5-17.4 2.4-7.6 20.1-67.3 20.1-67.3s-47.7 10-57.7 12.5c-7.5 2.4-10-2.5-12.5-7.5s-15-32.4-15-32.4-52.6 59.9-55.1 62.3c-10 7.5-20.1 0-17.6-10 0-10 27.6-129.6 27.6-129.6s-30.1 17.4-40.1 22.4c-7.5 5-12.6 5-17.6-5C293.5 72.3 255.9 0 255.9 0s-37.5 72.3-42.5 79.8c-5 10-10 10-17.6 5-10-5-40.1-22.4-40.1-22.4S183.3 182 183.3 192c2.5 10-7.5 17.5-17.6 10-2.5-2.5-55.1-62.3-55.1-62.3S98.1 167 95.6 172s-5 9.9-12.5 7.5C73 177 25.4 167 25.4 167s17.6 59.7 20.1 67.3c2.4 6 5 12.5-5 17.4L23 259.3s102.6 89.9 105.2 92.4c5.1 5 10 7.5 5.1 22.5-5.1 15-10.1 35.1-10.1 35.1s95.2-20.1 105.3-22.6c8.7-.9 18.3 2.5 18.3 12.5S241 512 241 512h30s-5.8-102.7-5.8-112.8 9.5-13.4 18.4-12.5c10 2.5 105.2 22.6 105.2 22.6s-5-20.1-10-35.1 0-17.5 5-22.5z" />
    </svg>
  );
}

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/canada', label: 'Canada', icon: MapleLeafIcon },
  { to: '/countries', label: 'Regulatory Landscape' },
  { to: '/news', label: 'News & Insights' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-chrome-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]">
            <div className="w-8 h-8 bg-chrome-900 rounded-lg flex items-center justify-center group-hover:bg-chrome-800 transition-colors duration-150">
              <span className="text-gold-400 font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-chrome-800 group-hover:text-gold-500 transition-colors duration-150">StablecoinStats.ca</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ease-out flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gold-50 text-gold-600'
                      : 'text-chrome-500 hover:bg-chrome-100 hover:text-chrome-800 hover:scale-[1.02] active:scale-[0.98]'
                  }`
                }
              >
                {item.label}
                {item.icon && <item.icon className="w-4 h-4 text-red-600" />}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-chrome-500 hover:text-chrome-800 hover:bg-chrome-100 rounded-lg transition-all duration-150 ease-out active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-chrome-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ease-out ${
                    isActive
                      ? 'bg-gold-50 text-gold-600'
                      : 'text-chrome-500 hover:bg-chrome-100 active:bg-chrome-200'
                  }`
                }
              >
                {item.label}
                {item.icon && <item.icon className="w-4 h-4 text-red-600" />}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
