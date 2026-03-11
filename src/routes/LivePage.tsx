import { Radio, Users, Twitter } from 'lucide-react';
import { PageContainer } from '../components/layout';
import { FadeInSlide } from '../components/common';
import { KolDirectory, TwitterEmbed } from '../components/live';

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
            <h2 className="text-xl font-bold text-chrome-800">Latest from X</h2>
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

    </PageContainer>
  );
}
