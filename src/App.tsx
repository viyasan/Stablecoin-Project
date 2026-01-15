import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TagManager from 'react-gtm-module';
import { Header, Footer } from './components/layout';
import {
  OverviewPage,
  CanadaPage,
  CountriesPage,
  CountryDetailPage,
  NewsPage,
} from './routes';

// Initialize Google Tag Manager
const GTM_ID = import.meta.env.VITE_GTM_CONTAINER_ID;
if (GTM_ID) {
  TagManager.initialize({
    gtmId: GTM_ID,
  });
}

// Component to track page views
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    if (GTM_ID) {
      TagManager.dataLayer({
        dataLayer: {
          event: 'pageview',
          page: location.pathname + location.search,
        },
      });
    }
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
