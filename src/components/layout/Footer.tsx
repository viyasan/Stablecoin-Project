import { Link, useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isOverviewPage = location.pathname === '/';

  return (
    <footer className="bg-chrome-800 text-chrome-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-chrome-900 rounded-lg flex items-center justify-center">
                <span className="text-gold-400 font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white">StablecoinStats.xyz</span>
            </div>
            <p className="text-sm max-w-md">
              Your destination for stablecoin market data, regulatory tracking,
              and insights. Stay informed on the global stablecoin landscape.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <li>
                <Link to="/countries" className="hover:text-gold-400 transition-colors duration-150">
                  Regulation
                </Link>
              </li>
              <li>
                <Link to="/canada" className="hover:text-gold-400 transition-colors duration-150">
                  Canada
                </Link>
              </li>
              <li>
                <Link to="/yields" className="hover:text-gold-400 transition-colors duration-150">
                  Yield
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-gold-400 transition-colors duration-150">
                  News
                </Link>
              </li>
              <li>
                <Link to="/market" className="hover:text-gold-400 transition-colors duration-150">
                  Stats
                </Link>
              </li>
              <li>
                <Link to="/live" className="hover:text-gold-400 transition-colors duration-150">
                  Live
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/disclaimer" className="hover:text-gold-400 transition-colors duration-150">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>


        {/* Data Sources - Only show on overview page */}
        {isOverviewPage && (
          <div className="mt-12 pt-8 border-t border-chrome-700">
          <p className="text-xs text-chrome-500 mb-4">
            Data Sources:{' '}
            <a
              href="https://defillama.com/stablecoins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chrome-400 hover:text-gold-400 transition-colors duration-150"
            >
              DefiLlama
            </a>
            {', '}
            <a
              href="https://www.allium.so"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chrome-400 hover:text-gold-400 transition-colors duration-150"
            >
              Allium
            </a>
            {', '}
            <a
              href="https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/mfh.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chrome-400 hover:text-gold-400 transition-colors duration-150"
            >
              US Treasury
            </a>
            {' | News: '}
            <a
              href="https://www.coindesk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chrome-400 hover:text-gold-400 transition-colors duration-150"
            >
              CoinDesk
            </a>
            {', '}
            <a
              href="https://cointelegraph.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-chrome-400 hover:text-gold-400 transition-colors duration-150"
            >
              CoinTelegraph
            </a>
          </p>
          </div>
        )}

        {/* Disclaimer & Copyright */}
        <div className="mt-6">
          <p className="text-xs text-chrome-500 mb-4">
            <strong>Disclaimer:</strong> The information provided on StablecoinStats.xyz
            is for informational purposes only and does not constitute
            investment, legal, or financial advice.{' '}
            <Link to="/disclaimer" className="text-chrome-400 hover:text-gold-400 transition-colors duration-150">
              Read full disclaimer
            </Link>
          </p>
          <p className="text-xs text-chrome-500">
            &copy; {new Date().getFullYear()} StablecoinStats.xyz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
