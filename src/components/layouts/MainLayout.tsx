import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from '../landing/Footer';

const MainLayout = () => {
  return (
    <div className="bg-neutral-50 min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <NavBar />
      <main className="container mx-auto p-4 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
