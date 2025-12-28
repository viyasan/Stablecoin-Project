import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout';
import {
  OverviewPage,
  MarketPage,
  CountriesPage,
  CountryDetailPage,
  NewsPage,
  ExplainerPage,
} from './routes';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/countries/:code" element={<CountryDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/explainer/:slug" element={<ExplainerPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
