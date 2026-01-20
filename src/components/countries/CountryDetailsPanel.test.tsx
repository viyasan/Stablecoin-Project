import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CountryDetailsPanel, CountryPromptPanel } from './CountryDetailsPanel';
import type { RegulationCountry } from './regulationMapData';

const mockCountry: RegulationCountry = {
  id: 'us',
  name: 'United States',
  isoCodes: ['US'],
  stage: 'implemented',
  summary: 'Test summary paragraph 1.\n\nTest summary paragraph 2.',
  keyPoints: ['Key point 1', 'Key point 2', 'Key point 3'],
  lastUpdated: 'January 2026',
  regulatorName: 'Office of the Comptroller of the Currency',
};

const mockCountryExtended: RegulationCountry = {
  ...mockCountry,
  regulatoryBodies: [
    { name: 'OCC', role: 'Primary regulator' },
    { name: 'Federal Reserve', role: 'Secondary oversight' },
  ],
  legislativeDevelopments: [
    { title: 'GENIUS Act', points: ['Point 1', 'Point 2'] },
  ],
  reserveRequirements: [
    { requirement: '100% Reserve', details: 'Full backing required' },
  ],
  issuerObligations: ['Obtain license', 'Maintain reserves'],
  exemptions: ['Small issuers exempted'],
  cbdcStatus: ['Digital dollar pilot ongoing'],
  stablecoinIssuers: [
    { company: 'Circle', stablecoin: 'USDC', status: 'Licensed' },
  ],
  timeline: [
    { date: 'July 2025', event: 'GENIUS Act signed' },
  ],
};

describe('CountryDetailsPanel', () => {
  it('renders nothing when country is null', () => {
    const { container } = render(
      <CountryDetailsPanel country={null} onClose={() => {}} />
    );

    expect(container.querySelector('.max-h-0')).toBeInTheDocument();
  });

  it('renders country name', () => {
    render(<CountryDetailsPanel country={mockCountry} onClose={() => {}} />);

    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('renders regulator name', () => {
    render(<CountryDetailsPanel country={mockCountry} onClose={() => {}} />);

    expect(screen.getByText('Office of the Comptroller of the Currency')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<CountryDetailsPanel country={mockCountry} onClose={() => {}} />);

    expect(screen.getByRole('button', { name: /close details/i })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<CountryDetailsPanel country={mockCountry} onClose={handleClose} />);

    fireEvent.click(screen.getByRole('button', { name: /close details/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders overview section with summary', () => {
    render(<CountryDetailsPanel country={mockCountry} onClose={() => {}} />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Test summary paragraph 1.')).toBeInTheDocument();
    expect(screen.getByText('Test summary paragraph 2.')).toBeInTheDocument();
  });

  it('renders key points section', () => {
    render(<CountryDetailsPanel country={mockCountry} onClose={() => {}} />);

    expect(screen.getByText('Key Points')).toBeInTheDocument();
    expect(screen.getByText('Key point 1')).toBeInTheDocument();
    expect(screen.getByText('Key point 2')).toBeInTheDocument();
    expect(screen.getByText('Key point 3')).toBeInTheDocument();
  });

  it('renders last updated date', () => {
    render(<CountryDetailsPanel country={mockCountry} onClose={() => {}} />);

    expect(screen.getByText(/last updated: january 2026/i)).toBeInTheDocument();
  });

  it('renders regulatory bodies when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('Regulatory Bodies')).toBeInTheDocument();
    expect(screen.getByText('OCC')).toBeInTheDocument();
    expect(screen.getByText('Primary regulator')).toBeInTheDocument();
  });

  it('renders legislative developments when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('Legislative Developments')).toBeInTheDocument();
    expect(screen.getByText('GENIUS Act')).toBeInTheDocument();
  });

  it('renders reserve requirements when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('Reserve Requirements')).toBeInTheDocument();
    expect(screen.getByText('100% Reserve')).toBeInTheDocument();
    expect(screen.getByText('Full backing required')).toBeInTheDocument();
  });

  it('renders issuer obligations when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('Issuer Obligations')).toBeInTheDocument();
    expect(screen.getByText('Obtain license')).toBeInTheDocument();
  });

  it('renders exemptions when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('Exemptions')).toBeInTheDocument();
    expect(screen.getByText('Small issuers exempted')).toBeInTheDocument();
  });

  it('renders CBDC status when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('CBDC Status')).toBeInTheDocument();
    expect(screen.getByText('Digital dollar pilot ongoing')).toBeInTheDocument();
  });

  it('renders stablecoin issuers when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('Stablecoin Issuers')).toBeInTheDocument();
    expect(screen.getByText('Circle')).toBeInTheDocument();
    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('Licensed')).toBeInTheDocument();
  });

  it('renders timeline when provided', () => {
    render(<CountryDetailsPanel country={mockCountryExtended} onClose={() => {}} />);

    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('July 2025')).toBeInTheDocument();
    expect(screen.getByText('GENIUS Act signed')).toBeInTheDocument();
  });

  it('includes progress bar', () => {
    const { container } = render(
      <CountryDetailsPanel country={mockCountry} onClose={() => {}} />
    );

    // Progress bar should render stage labels
    expect(screen.getByText('Proposed')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Implemented')).toBeInTheDocument();
  });
});

describe('CountryPromptPanel', () => {
  it('renders prompt message', () => {
    render(<CountryPromptPanel />);

    expect(screen.getByText('Click a country to view regulatory progress')).toBeInTheDocument();
  });

  it('renders secondary message', () => {
    render(<CountryPromptPanel />);

    expect(screen.getByText('Highlighted regions have active stablecoin frameworks')).toBeInTheDocument();
  });

  it('renders icon', () => {
    const { container } = render(<CountryPromptPanel />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has dashed border styling', () => {
    const { container } = render(<CountryPromptPanel />);

    const panel = container.firstChild as HTMLElement;
    expect(panel).toHaveClass('border-dashed');
  });
});
