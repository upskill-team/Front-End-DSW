import { BenefitsSection } from '../components/landing/BenefitsSection';
import { TrendingCourses } from '../components/landing/TrendingCourses';
import HeroSection from '../components/landing/HeroSection';
import { NavBar } from '../components/common/NavBar';
import { SEO } from '../components/common/SEO';

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <SEO 
        title="Plataforma de Cursos Online - Aprende Nuevas Habilidades"
        description="Descubre cursos online de programación, desarrollo web, diseño y más. Aprende con profesores expertos y certifícate en las tecnologías más demandadas del mercado."
        keywords="cursos online, programación, desarrollo web, aprender a programar, plataforma educativa, certificación online, profesional, cursos"
        ogType="website"
      />
      <NavBar />
      <main>
        <HeroSection />
        <TrendingCourses />
        <BenefitsSection />
      </main>
    </div>
  );
}
