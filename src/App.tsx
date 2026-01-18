import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TagManager from 'react-gtm-module';
import NProgress from 'nprogress';
import { Header, Footer } from './components/layout';
import {
  OverviewPage,
  CanadaPage,
  CountriesPage,
  CountryDetailPage,
  NewsPage,
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
    // Start loading bar
    NProgress.start();

    // Track page view on route change
    if (GTM_ID) {
      TagManager.dataLayer({
        dataLayer: {
          event: 'pageview',
          page: location.pathname + location.search,
        },
      });
    }

    // Complete loading bar after a short delay (simulates page load)
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/canada" element={<CanadaPage />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/countries/:code" element={<CountryDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
