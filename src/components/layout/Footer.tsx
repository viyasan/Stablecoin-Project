import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BEEHIIV_URL = import.meta.env.VITE_BEEHIIV_EMBED_URL || '';

export function Footer() {
  const location = useLocation();
  const isOverviewPage = location.pathname === '/';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !BEEHIIV_URL) return;
    setSubmitting(true);
    try {
      await fetch(BEEHIIV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }).toString(),
        mode: 'no-cors',
      });
      setSubscribed(true);
      setEmail('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">StablecoinStats.ca</span>
            </div>
            <p className="text-sm max-w-md">
              Your destination for stablecoin market data, regulatory tracking,
              and insights. Stay informed on the global stablecoin landscape.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/canada" className="hover:text-white transition-colors duration-150">
                  Canada
                </Link>
              </li>
              <li>
                <Link to="/countries" className="hover:text-white transition-colors duration-150">
                  Regulatory Landscape
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors duration-150">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/disclaimer" className="hover:text-white transition-colors duration-150">
                  Disclaimer & Disclosures
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter CTA */}
        {BEEHIIV_URL && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="bg-gray-800 rounded-lg p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h4 className="text-white font-semibold text-lg mb-1">Stay Informed</h4>
                <p className="text-sm text-gray-400">
                  Weekly stablecoin insights, regulation updates, and analysis.
                </p>
              </div>
              {subscribed ? (
                <p className="text-sm text-green-400 font-medium">You're subscribed!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 text-sm border border-gray-600 focus:outline-none focus:border-primary-500 w-full md:w-64"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors duration-150 disabled:opacity-50 whitespace-nowrap"
                  >
                    {submitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Data Sources - Only show on overview page */}
        {isOverviewPage && (
          <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-4">
            Data Sources:{' '}
            <a
              href="https://defillama.com/stablecoins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-150"
            >
              DefiLlama
            </a>
            {', '}
            <a
              href="https://www.allium.so"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-150"
            >
              Allium
            </a>
            {', '}
            <a
              href="https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/mfh.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-150"
            >
              US Treasury
            </a>
            {' | News: '}
            <a
              href="https://www.coindesk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-150"
            >
              CoinDesk
            </a>
            {', '}
            <a
              href="https://cointelegraph.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-150"
            >
              CoinTelegraph
            </a>
          </p>
          </div>
        )}

        {/* Disclaimer & Copyright */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-4">
            <strong>Disclaimer:</strong> The information provided on StablecoinStats.ca
            is for informational purposes only and does not constitute
            investment, legal, or financial advice.{' '}
            <Link to="/disclaimer" className="text-gray-400 hover:text-white transition-colors duration-150">
              Read full disclaimer
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} StablecoinStats.ca. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
