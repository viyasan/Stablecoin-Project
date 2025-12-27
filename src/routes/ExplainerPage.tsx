import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/layout';

const explainers: Record<
  string,
  { title: string; content: string }
> = {
  'what-is-a-stablecoin': {
    title: 'What is a Stablecoin?',
    content: `
A stablecoin is a type of cryptocurrency designed to maintain a stable value relative to a reference asset, typically a fiat currency like the US dollar.

## Key Types of Stablecoins

### Fiat-Backed Stablecoins
These are backed 1:1 by reserves of fiat currency held in bank accounts. Examples include USDT (Tether) and USDC (USD Coin).

### Crypto-Collateralized Stablecoins
These are backed by other cryptocurrencies, often over-collateralized to account for volatility. DAI is a prominent example.

### Algorithmic Stablecoins
These use algorithms and smart contracts to automatically adjust supply based on demand, without traditional collateral backing.

## Why Stablecoins Matter

- **Trading**: Provide a stable store of value in volatile crypto markets
- **Payments**: Enable fast, low-cost cross-border transactions
- **DeFi**: Serve as the foundation for lending, borrowing, and yield protocols
- **Remittances**: Offer an alternative to traditional money transfer services
    `,
  },
  'regulatory-models': {
    title: 'Stablecoin Regulatory Models',
    content: `
Different jurisdictions have taken varied approaches to regulating stablecoins. Understanding these models is crucial for issuers and users alike.

## Common Regulatory Approaches

### E-Money Framework (EU - MiCA)
The EU's Markets in Crypto-Assets regulation treats stablecoins as "e-money tokens" (EMTs) or "asset-referenced tokens" (ARTs), requiring issuers to be licensed and maintain adequate reserves.

### Banking Regulation (Japan)
Japan requires stablecoin issuers to be licensed banks or registered money transfer businesses, applying traditional financial oversight.

### Securities Approach (US - Partial)
The US SEC has suggested some stablecoins may be securities, while other agencies like the OCC and state regulators have provided separate guidance.

### Sandbox Models (UK, Singapore)
Some jurisdictions use regulatory sandboxes to allow innovation while developing comprehensive frameworks.

## Key Regulatory Considerations

- **Reserve Requirements**: What assets can back a stablecoin?
- **Licensing**: Who can issue stablecoins?
- **Consumer Protection**: How are user funds protected?
- **AML/CFT**: Anti-money laundering and counter-terrorism financing rules
    `,
  },
};

export function ExplainerPage() {
  const { slug } = useParams<{ slug: string }>();
  const explainer = slug ? explainers[slug] : null;

  if (!explainer) {
    return (
      <PageContainer>
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">Explainer not found</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            ← Back to Overview
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Overview
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {explainer.title}
          </h1>
          <div className="prose prose-gray max-w-none">
            {explainer.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2
                    key={index}
                    className="text-xl font-semibold text-gray-900 mt-8 mb-4"
                  >
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h3
                    key={index}
                    className="text-lg font-semibold text-gray-800 mt-6 mb-3"
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 my-4">
                    {items.map((item, i) => (
                      <li key={i} className="text-gray-600">
                        {item.replace('- ', '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={index} className="text-gray-600 leading-relaxed my-4">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        </article>
      </div>
    </PageContainer>
  );
}
