import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ContactBar from './ContactBar.jsx';
import Footer from './Footer.jsx';
import Header from './Header.jsx';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-svh flex-col pb-[4.75rem] md:pb-0">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-wine-800 focus:px-4 focus:py-2 focus:text-ivory-50">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ContactBar />
    </div>
  );
}
