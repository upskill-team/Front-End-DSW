import { Footer } from '../components/landing/Footer';
import { PopularRanking } from '../components/landing/PopularRanking';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TrendingCourses } from '../components/landing/TrendingCourses';
import HeroSection from '../components/landing/HeroSection';
import { NavBar } from '../components/layouts/NavBar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans">
      <NavBar />
      <main>
        <HeroSection />
        <TrendingCourses />
        <BenefitsSection />
        <PopularRanking />
      </main>
      <Footer />
    </div>
  );
}
