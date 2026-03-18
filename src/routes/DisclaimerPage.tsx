import { Shield } from 'lucide-react';
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
          <h1 className="text-3xl font-bold text-chrome-800">Disclaimer</h1>
        </div>
        <p className="text-sm text-chrome-400 mt-1">
          Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="space-y-6">
        {/* Not Financial Advice */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <h2 className="text-lg font-semibold text-chrome-800 mb-2">Not Financial Advice</h2>
          <p className="text-sm text-chrome-600 leading-relaxed">
            StablecoinStats.xyz is for <strong>informational purposes only</strong>. Nothing on
            this site is a recommendation to buy, sell, or hold any asset. Always do your own
            research and consult a qualified professional before making financial decisions.
          </p>
        </section>

        {/* Risks */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <h2 className="text-lg font-semibold text-chrome-800 mb-2">Risks</h2>
          <p className="text-sm text-chrome-600 leading-relaxed mb-3">
            Cryptocurrencies and stablecoins are volatile. Stablecoins can lose their peg,
            issuers can face insolvency, and regulations are still evolving. You could lose
            some or all of your investment.
          </p>
          <p className="text-sm text-chrome-600 leading-relaxed">
            Onchain lending yield rates shown on this site are snapshots from third-party protocols
            and change constantly. Smart contracts can have bugs or be exploited.
            We do not facilitate any transactions — any interaction with an onchain lending protocol
            is between you and that protocol. <strong>Only deposit what you can afford to lose.</strong>
          </p>
        </section>

        {/* Data & Sources */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <h2 className="text-lg font-semibold text-chrome-800 mb-2">Data & Sources</h2>
          <p className="text-sm text-chrome-600 leading-relaxed">
            All data is provided <strong>"as is"</strong> from third-party sources
            including{' '}
            <a href="https://defillama.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">DefiLlama</a>
            ,{' '}
            <a href="https://www.coindesk.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">CoinDesk</a>
            , and{' '}
            <a href="https://cointelegraph.com" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600">CoinTelegraph</a>
            . Data may be delayed or contain errors. Listing a project or asset is not an
            endorsement. Always verify information independently.
          </p>
        </section>

        {/* Liability & Jurisdiction */}
        <section className="bg-white rounded-lg shadow-sm border border-chrome-200 p-6">
          <h2 className="text-lg font-semibold text-chrome-800 mb-2">Liability & Jurisdiction</h2>
          <p className="text-sm text-chrome-600 leading-relaxed">
            StablecoinStats.xyz and its operators are not liable for any losses arising
            from the use of this site or decisions based on its content. This site is operated
            from Canada — if you're accessing it from elsewhere, ensure you comply with your
            local laws. This disclaimer may be updated at any time; continued use means acceptance.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-chrome-50 rounded-lg border border-chrome-200 p-5">
          <h2 className="text-lg font-semibold text-chrome-800 mb-1">Questions?</h2>
          <p className="text-sm text-chrome-600">
            Reach out to{' '}
            <a href="mailto:viyasan@stablecoinstats.xyz" className="text-gold-500 hover:text-gold-600">
              viyasan@stablecoinstats.xyz
            </a>
          </p>
        </section>
      </div>
    </PageContainer>
  );
}
