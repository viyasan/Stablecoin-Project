import { PageContainer } from '../components/layout';
import { CountryBentoGrid, GASPCard } from '../components/countries';

export function CountriesPage() {
  return (
    <PageContainer
      title="Regulatory Landscape"
      subtitle="Global view of stablecoin regulation and progress by country/region"
    >
      <CountryBentoGrid />
      <GASPCard className="mt-8" />
    </PageContainer>
  );
}
