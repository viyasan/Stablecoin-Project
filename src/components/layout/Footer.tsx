import { Link } from 'react-router-dom';

export function Footer() {
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
                <Link to="/canada" className="hover:text-white transition-colors">
                  Canada
                </Link>
              </li>
              <li>
                <Link to="/countries" className="hover:text-white transition-colors">
                  Regulatory Landscape
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/explainer/what-is-a-stablecoin"
                  className="hover:text-white transition-colors"
                >
                  What is a Stablecoin?
                </Link>
              </li>
              <li>
                <Link
                  to="/explainer/regulatory-models"
                  className="hover:text-white transition-colors"
                >
                  Regulatory Models
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-500 mb-4">
            Data Sources:{' '}
            <a
              href="https://defillama.com/stablecoins"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              DefiLlama
            </a>{' '}
            and{' '}
            <a
              href="https://cryptopanic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              CryptoPanic
            </a>
          </p>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-6">
          <p className="text-xs text-gray-500 mb-4">
            <strong>Disclaimer:</strong> The information provided on StablecoinStats.ca
            is for informational purposes only and does not constitute
            investment, legal, or financial advice.
          </p>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} StablecoinStats.ca. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
