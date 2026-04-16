import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TagManager from 'react-gtm-module';
import NProgress from 'nprogress';
import { MainLayout } from './components/layout';
import {
  OverviewPage,
  MarketPage,
  CanadaPage,
  CountriesPage,
  CountryDetailPage,
  NewsPage,
  DisclaimerPage,
  YieldsPage,
} from './routes';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: 'ease',
  speed: 400,
});

// Initialize Google Tag Manager
const GTM_ID = import.meta.env.VITE_GTM_CONTAINER_ID;
if (GTM_ID) {
  TagManager.initialize({
    gtmId: GTM_ID,
  });
}

// Component to track page views and show loading bar
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    NProgress.start();

    if (GTM_ID) {
      TagManager.dataLayer({
        dataLayer: {
          event: 'pageview',
          page: location.pathname + location.search,
        },
      });
    }

    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <PageViewTracker />
      <Routes>
        {/* Existing light site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/canada" element={<CanadaPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/:code" element={<CountryDetailPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/yields" element={<YieldsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
