import { Header } from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import { TrendingCourses } from '../components/landing/TrendingCourses';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { PopularRanking } from '../components/landing/PopularRanking';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {

  const token = localStorage.getItem('authToken');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 font-sans">
      <Header token={token}/>
      <main className="pt-16">
        <HeroSection />
        <TrendingCourses />
        <BenefitsSection />
        <PopularRanking />
      </main>
      <Footer />
    </div>
  );
}
