import { Link } from 'react-router-dom';
import { Search, Users, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="py-20 px-4 pt-32">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-poppins font-bold text-slate-800 leading-tight">
                Aprende sin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">límites</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Descubre miles de cursos online con certificaciones oficiales. Aprende a tu ritmo desde cualquier dispositivo y transforma tu futuro profesional.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses" className="inline-flex items-center justify-center text-lg bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium">
                <Search className="w-5 h-5 mr-2" />
                Explorar Cursos
              </Link>
              <button className="inline-flex items-center justify-center text-lg border-green-200 text-green-700 hover:bg-green-50 px-8 py-3 rounded-lg border bg-transparent font-medium">
                Ver Demo Gratuita
              </button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>+50,000 estudiantes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.8/5 valoración</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <img src="https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070&auto=format&fit=crop" alt="Estudiantes aprendiendo online" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-blue-200 to-green-200 rounded-2xl -z-10 transform -rotate-3"></div>
          </div>
        </div>
      </div>
    </section>
  );
}