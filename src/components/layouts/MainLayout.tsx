import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from '../common/Footer.tsx';

const MainLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <NavBar />
      <main className={`flex-grow container mx-auto p-4 ${!isLandingPage ? 'pt-24' : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
