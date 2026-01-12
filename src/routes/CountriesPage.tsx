import { PageContainer } from '../components/layout';
import { RegulationMap } from '../components/countries';

export function CountriesPage() {
  return (
    <PageContainer
      title="Regulatory Landscape"
      subtitle="Global view of stablecoin regulation and adoption by country"
    >
      <RegulationMap />
    </PageContainer>
  );
}
