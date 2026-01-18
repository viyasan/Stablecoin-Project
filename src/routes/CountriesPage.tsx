import { PageContainer } from '../components/layout';
import { CountryBentoGrid } from '../components/countries';

export function CountriesPage() {
  return (
    <PageContainer
      title="Regulatory Landscape"
      subtitle="Global view of stablecoin regulation and adoption by country"
    >
      <CountryBentoGrid />
    </PageContainer>
  );
}
