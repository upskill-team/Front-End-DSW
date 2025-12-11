import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TrendingCourses } from '../components/landing/TrendingCourses';
import HeroSection from '../components/landing/HeroSection';
import { NavBar } from '../components/common/NavBar';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <NavBar />
      <main>
        <HeroSection />
        <TrendingCourses />
        <BenefitsSection />
      </main>
    </div>
  );
}
