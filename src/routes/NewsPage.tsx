import { PageContainer } from '../components/layout';
import { WeeklyBriefingCard } from '../components/overview';

export function NewsPage() {
  return (
    <PageContainer
      title="News"
      subtitle="Latest stablecoin news and insights from around the world"
    >
      {/* Weekly Briefing */}
      <section className="mb-8">
        <WeeklyBriefingCard />
      </section>

      {/* News Feed - Coming Soon */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <p className="text-gray-500 text-center">Full news feed coming soon...</p>
      </div>
    </PageContainer>
  );
}
