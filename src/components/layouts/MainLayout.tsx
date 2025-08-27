import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { Footer } from '../landing/Footer';

const MainLayout = () => {
  return (
    <div className="bg-neutral-50 min-h-screen">
      <NavBar />
      <main className="container mx-auto p-4 pt-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
