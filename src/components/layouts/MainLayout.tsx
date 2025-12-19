import { Outlet } from 'react-router-dom';
import { NavBar } from '../common/NavBar';
import { Footer } from '../common/Footer.tsx';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
