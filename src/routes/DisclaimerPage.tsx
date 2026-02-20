import { Shield, AlertTriangle, Database, Scale, ExternalLink } from 'lucide-react';
import { PageContainer } from '../components/layout';

export function DisclaimerPage() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-chrome-100 rounded-lg">
            <Shield className="w-6 h-6 text-chrome-600" />
          </div>
          <h1 className="text-3xl font-bold text-chrome-800">Disclaimer & Disclosures</h1>
        </div>
        <p className="text-chrome-600">
          Important information about using StablecoinStats.ca
        </p>
        <p className="text-sm text-chrome-400 mt-2">
          Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-8">
        {/* No Investment Advice */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gold-50 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chrome-800 mb-3">
                Not Financial or Legal Advice
              </h2>
              <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
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
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-status-negative/10 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-status-negative" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chrome-800 mb-3">
                Cryptocurrency Risk Warning
              </h2>
              <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
                <p>
                  Cryptocurrencies and stablecoins are <strong>volatile and speculative</strong> by
                  nature. Even assets designed to maintain stable values can experience significant
                  price movements. You could lose some or all of your investment.
                </p>
                <p className="font-medium text-chrome-700">
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

        {/* DeFi Yield Specific Risks */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gold-100 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chrome-800 mb-3">
                DeFi Yield Products & Risks
              </h2>
              <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
                <p>
                  Our "Best Stablecoin Yields Today" section displays yield opportunities from
                  third-party decentralized finance (DeFi) protocols. This information is provided
                  for <strong>educational and informational purposes only</strong>.
                </p>
                <p className="font-medium text-chrome-700">
                  Important disclaimers about yield products:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>No Guarantee of Returns:</strong> Displayed APY rates are current
                    snapshots and change continuously based on market conditions. Past or current
                    yields do not guarantee future performance.
                  </li>
                  <li>
                    <strong>Smart Contract Risk:</strong> DeFi protocols rely on smart contracts
                    which may contain bugs, vulnerabilities, or exploits that could result in
                    total loss of deposited funds.
                  </li>
                  <li>
                    <strong>Protocol Risk:</strong> Third-party protocols (e.g., Aave) may face
                    insolvency, governance attacks, oracle failures, or other operational issues
                    beyond our control.
                  </li>
                  <li>
                    <strong>Liquidity Risk:</strong> Withdrawals depend on available pool liquidity.
                    In high utilization scenarios, you may experience delays accessing your funds.
                  </li>
                  <li>
                    <strong>No Facilitation of Transactions:</strong> We do NOT facilitate deposits,
                    withdrawals, or any transactions. We only display information. Any interactions
                    with DeFi protocols are between you and that protocol directly.
                  </li>
                  <li>
                    <strong>Gas Fees & Costs:</strong> Blockchain transactions incur network fees
                    which can be substantial and are not reflected in displayed APY rates.
                  </li>
                  <li>
                    <strong>Regulatory Uncertainty:</strong> DeFi regulations are evolving globally.
                    Future regulatory actions may affect protocol availability or your ability to
                    access funds.
                  </li>
                  <li>
                    <strong>Data Timeliness:</strong> Yield data may be delayed or cached. Always
                    verify current rates directly on the protocol before depositing.
                  </li>
                </ul>
                <p className="font-semibold text-chrome-800">
                  StablecoinStats.ca does not operate, control, or endorse any DeFi protocol.
                  We are not affiliated with Aave or any yield protocol displayed on this site.
                  You interact with these protocols at your own risk.
                </p>
                <p>
                  <strong>Only deposit capital you can afford to lose entirely.</strong> DeFi
                  products are experimental technology with significant risks. Do your own research
                  and consider consulting qualified financial advisors before participating.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Accuracy */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-chrome-100 rounded-lg shrink-0">
              <Database className="w-5 h-5 text-chrome-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chrome-800 mb-3">
                Data Accuracy & Sources
              </h2>
              <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
                <p>
                  All information on StablecoinStats.ca is provided <strong>"as is"</strong> without
                  warranties of any kind. While we strive for accuracy, we cannot guarantee that
                  data is complete, current, or error-free.
                </p>
                <p className="font-medium text-chrome-700">
                  Our data comes from trusted third-party sources:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Market Data:</strong>{' '}
                    <a
                      href="https://defillama.com/stablecoins"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-600"
                    >
                      DefiLlama
                    </a>
                    {' and '}
                    <a
                      href="https://www.allium.so"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-600"
                    >
                      Allium
                    </a>
                  </li>
                  <li>
                    <strong>Yield Data:</strong>{' '}
                    <a
                      href="https://defillama.com/yields"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-600"
                    >
                      DefiLlama Yields API
                    </a>
                  </li>
                  <li>
                    <strong>News:</strong>{' '}
                    <a
                      href="https://www.coindesk.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-600"
                    >
                      CoinDesk
                    </a>
                    {' and '}
                    <a
                      href="https://cointelegraph.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-500 hover:text-gold-600"
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
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-chrome-100 rounded-lg shrink-0">
              <ExternalLink className="w-5 h-5 text-chrome-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chrome-800 mb-3">
                No Endorsement
              </h2>
              <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
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
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-chrome-100 rounded-lg shrink-0">
              <Scale className="w-5 h-5 text-chrome-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-chrome-800 mb-3">
                Limitation of Liability
              </h2>
              <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
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
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <h2 className="text-xl font-semibold text-chrome-800 mb-3">
            Jurisdiction
          </h2>
          <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
            <p>
              StablecoinStats.ca is operated from Canada. Cryptocurrency regulations vary
              significantly by country and are constantly evolving. If you're accessing this
              site from outside Canada, ensure you comply with your local laws. Certain assets
              or activities may be restricted in your jurisdiction.
            </p>
          </div>
        </section>

        {/* Changes to Disclaimer */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <h2 className="text-xl font-semibold text-chrome-800 mb-3">
            Updates to This Disclaimer
          </h2>
          <div className="prose prose-gray max-w-none text-chrome-600 space-y-3">
            <p>
              We may update this disclaimer from time to time. Changes take effect immediately
              upon posting. Continued use of the website constitutes acceptance of any updates.
              We recommend checking this page periodically.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-chrome-50 rounded-lg border border-chrome-200 p-6">
          <h2 className="text-xl font-semibold text-chrome-800 mb-3">
            Questions?
          </h2>
          <p className="text-chrome-600">
            If you have questions about this disclaimer or anything on StablecoinStats.ca,
            feel free to reach out to{' '}
            <a
              href="mailto:viyasan.ari@gmail.com"
              className="text-gold-500 hover:text-gold-600"
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
