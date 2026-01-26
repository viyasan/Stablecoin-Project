import { Shield, AlertTriangle, Database, Scale, ExternalLink } from 'lucide-react';
import { PageContainer } from '../components/layout';

export function DisclaimerPage() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Shield className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Disclaimer & Disclosures</h1>
        </div>
        <p className="text-gray-600">
          Important information about using StablecoinStats.ca
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-8">
        {/* No Investment Advice */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Not Financial or Legal Advice
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>
                  The information on StablecoinStats.ca is for <strong>informational purposes
                  only</strong>. We provide data and news to help you stay informed about the
                  stablecoin market—we don't provide investment, financial, or legal advice.
                </p>
                <p>
                  We don't recommend buying, selling, or holding any cryptocurrency or stablecoin.
                  These decisions should be made after doing your own research and consulting with
                  qualified professionals who understand your personal situation.
                </p>
                <p>
                  <strong>Always do your own due diligence</strong> before making any financial
                  decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Warning */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Cryptocurrency Risk Warning
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>
                  Cryptocurrencies and stablecoins are <strong>volatile and speculative</strong> by
                  nature. Even assets designed to maintain stable values can experience significant
                  price movements. You could lose some or all of your investment.
                </p>
                <p className="font-medium text-gray-700">
                  Key risks to be aware of:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Market Volatility:</strong> Cryptocurrency prices can change rapidly
                    and unpredictably.
                  </li>
                  <li>
                    <strong>De-pegging Risk:</strong> Stablecoins can lose their peg to underlying
                    assets, as seen in past market events.
                  </li>
                  <li>
                    <strong>Regulatory Risk:</strong> Regulations are evolving globally and may
                    affect the availability or value of certain assets.
                  </li>
                  <li>
                    <strong>Counterparty Risk:</strong> Stablecoin issuers may fail to maintain
                    adequate reserves or face insolvency.
                  </li>
                  <li>
                    <strong>Security Risk:</strong> Digital assets are targets for hacking and
                    other cyber attacks.
                  </li>
                  <li>
                    <strong>Technology Risk:</strong> Smart contracts and wallets can have bugs
                    or malfunctions.
                  </li>
                </ul>
                <p>
                  The cryptocurrency market remains largely unregulated in many jurisdictions.
                  Don't expect investor protection schemes to cover losses in this space.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Accuracy */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Data Accuracy & Sources
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>
                  All information on StablecoinStats.ca is provided <strong>"as is"</strong> without
                  warranties of any kind. While we strive for accuracy, we cannot guarantee that
                  data is complete, current, or error-free.
                </p>
                <p className="font-medium text-gray-700">
                  Our data comes from trusted third-party sources:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Market Data:</strong>{' '}
                    <a
                      href="https://defillama.com/stablecoins"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      DefiLlama
                    </a>
                    {' and '}
                    <a
                      href="https://www.allium.so"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Allium
                    </a>
                  </li>
                  <li>
                    <strong>News:</strong>{' '}
                    <a
                      href="https://www.coindesk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      CoinDesk
                    </a>
                    {' and '}
                    <a
                      href="https://cointelegraph.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      CoinTelegraph
                    </a>
                  </li>
                </ul>
                <p>
                  We don't control these third-party sources. Data may be delayed or contain
                  inaccuracies. Always verify important information independently before making
                  decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Non-Endorsement */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                No Endorsement
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>
                  The inclusion of any stablecoin, project, or news article on StablecoinStats.ca
                  does not constitute an endorsement or recommendation. We display data and
                  aggregate news—we're not vouching for any particular asset or project.
                </p>
                <p>
                  Links to external websites are provided for convenience. We have no control over
                  third-party content and are not responsible for their accuracy or practices.
                  Opinions in news articles belong to their original authors, not StablecoinStats.ca.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 rounded-lg shrink-0">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Limitation of Liability
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
                <p>
                  To the extent permitted by law, StablecoinStats.ca and its operators are not
                  liable for any damages arising from:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your use of or inability to access this website</li>
                  <li>Any inaccuracies in the information provided</li>
                  <li>Decisions made based on content from this website</li>
                  <li>Loss of profits, data, or other losses</li>
                  <li>Third-party content, products, or services</li>
                </ul>
                <p>
                  We work hard to provide a useful resource, but ultimately you are responsible
                  for your own decisions and their outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Jurisdiction */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Jurisdiction
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
            <p>
              StablecoinStats.ca is operated from Canada. Cryptocurrency regulations vary
              significantly by country and are constantly evolving. If you're accessing this
              site from outside Canada, ensure you comply with your local laws. Certain assets
              or activities may be restricted in your jurisdiction.
            </p>
          </div>
        </section>

        {/* Changes to Disclaimer */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Updates to This Disclaimer
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600 space-y-3">
            <p>
              We may update this disclaimer from time to time. Changes take effect immediately
              upon posting. Continued use of the website constitutes acceptance of any updates.
              We recommend checking this page periodically.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Questions?
          </h2>
          <p className="text-gray-600">
            If you have questions about this disclaimer or anything on StablecoinStats.ca,
            feel free to reach out to{' '}
            <a
              href="mailto:viyasan.ari@gmail.com"
              className="text-primary-600 hover:text-primary-700"
            >
              viyasan.ari@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
