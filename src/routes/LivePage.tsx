import { Radio, Users, Twitter, Newspaper } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common';
import { KolDirectory, TwitterEmbed, LiveNewsSection } from '../components/live';

export function LivePage() {
  return (
    <PageContainer>
      {/* Page Header */}
      <FadeInSlide>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-chrome-100 rounded-lg">
              <Radio className="w-6 h-6 text-chrome-600" />
            </div>
            <h1 className="text-3xl font-bold text-chrome-800">Live</h1>
          </div>
          <p className="text-chrome-600">
            Follow stablecoin thought leaders, track live conversations on X, and stay updated with industry news.
          </p>
        </div>
      </FadeInSlide>

      {/* Twitter Feed — Hero Section */}
      <FadeInSlide delay={100}>
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Twitter className="w-5 h-5 text-chrome-500" />
            <h2 className="text-xl font-bold text-chrome-800">Live from X</h2>
            <span className="relative flex h-2.5 w-2.5 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
          </div>
          <TwitterEmbed />
        </section>
      </FadeInSlide>

      {/* KOL Directory Section */}
      <FadeInSlide delay={200}>
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-chrome-500" />
            <h2 className="text-xl font-bold text-chrome-800">Stablecoin KOL Directory</h2>
          </div>
          <KolDirectory />
        </section>
      </FadeInSlide>

      {/* Divider */}
      <div className="border-t border-chrome-200 my-12" />

      {/* Live News Section */}
      <FadeInSlide delay={300}>
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="w-5 h-5 text-chrome-500" />
            <h2 className="text-xl font-bold text-chrome-800">Stablecoin & Fintech News</h2>
          </div>
          <LiveNewsSection />
        </section>
      </FadeInSlide>
    </PageContainer>
  );
}
