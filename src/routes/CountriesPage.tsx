import { PageContainer } from '../components/layout';
import { RegulationMap } from '../components/countries';
import { RegulationMiniMap } from '../components/overview';

export function CountriesPage() {
  return (
    <PageContainer
      title="Regulatory Landscape"
      subtitle="Global view of stablecoin regulation and adoption by country"
    >
      <div className="space-y-8">
        <RegulationMap />
        <RegulationMiniMap />
      </div>
    </PageContainer>
  );
}
