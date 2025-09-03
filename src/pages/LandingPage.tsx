import { PopularRanking } from '../components/landing/PopularRanking';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TrendingCourses } from '../components/landing/TrendingCourses';
import HeroSection from '../components/landing/HeroSection';
import { NavBar } from '../components/common/NavBar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans overflow-x-hidden">
      <NavBar />
      <main>
        <HeroSection />
        <TrendingCourses />
        <BenefitsSection />
        <PopularRanking />
      </main>
    </div>
  );
}
