import { PageContainer } from '../components/layout';
import { RegulationMiniMap } from '../components/overview';

export function CountriesPage() {
  return (
    <PageContainer
      title="Regulatory Landscape"
      subtitle="Global view of stablecoin regulation and adoption by country"
    >
      <RegulationMiniMap />
    </PageContainer>
  );
}
