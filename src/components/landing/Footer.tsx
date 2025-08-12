import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-poppins font-bold">UpSkill</span>
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed">
              La plataforma líder en educación online. Aprende nuevas habilidades, obtén certificaciones y avanza en tu carrera.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="text-slate-300 hover:text-white transition-colors">Explorar Cursos</Link></li>
              <li><Link to="/about" className="text-slate-300 hover:text-white transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/faq" className="text-slate-300 hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contacto</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contacto</h3>
            <div className="space-y-3 text-sm">
              <a href="mailto:info@educursos.com" className="flex items-center space-x-2 text-slate-300 hover:text-white">
                <Mail className="w-4 h-4" /><span>info@upskill.com</span>
              </a>
              <a href="tel:+15551234567" className="flex items-center space-x-2 text-slate-300 hover:text-white">
                <Phone className="w-4 h-4" /><span>+1 (555) 123-4567</span>
              </a>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span className="text-slate-300">Learning City, LC 12345</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Síguenos</h3>
            <div className="flex space-x-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-sky-500 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" aria-label="YouTube" className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} UpSkill. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}