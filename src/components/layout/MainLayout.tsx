import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-chrome-50 bg-hero-grid">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
