import { useEffect } from 'react';
import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common';
import { prefetchNews } from '../api';
import {
  HeroSection,
  QuickInsightsCarousel,
  TopHeadlinesList,
  EmailOptInCard,
  WordDefinitionCard,
} from '../components/overview';

export function OverviewPage() {
  // Kick off news fetch immediately on page mount so it's ready by the time
  // the user scrolls down to the headlines section
  useEffect(() => {
    prefetchNews();
  }, []);

  return (
    <PageContainer>
      {/* Hero Section */}
      <FadeInSlide>
        <HeroSection />
      </FadeInSlide>

      {/* Email Opt-In Card */}
      <section className="mb-8">
        <FadeInSlide delay={200}>
          <EmailOptInCard />
        </FadeInSlide>
      </section>

      {/* Word Definition + Quick Insights */}
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FadeInSlide delay={0}>
            <WordDefinitionCard />
          </FadeInSlide>
          <FadeInSlide delay={150} className="h-full">
            <QuickInsightsCarousel />
          </FadeInSlide>
        </div>
      </section>

      {/* Top Headlines Section */}
      <section>
        <FadeInSlide delay={0}>
          <TopHeadlinesList />
        </FadeInSlide>
      </section>
    </PageContainer>
  );
}
