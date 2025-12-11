import { Clock, Smartphone, BookOpen } from 'lucide-react';

const benefits = [
  { icon: Clock, title: "Aprende a tu ritmo", description: "Accede a los cursos cuando quieras, sin horarios fijos. Pausa, retrocede y repite las lecciones." },
  { icon: Smartphone, title: "Desde cualquier dispositivo", description: "Estudia desde tu computadora, tablet o móvil. Tu progreso se sincroniza automáticamente." },
  { icon: BookOpen, title: "Contenido actualizado", description: "Nuestros cursos se actualizan constantemente para incluir las últimas tendencias y tecnologías." },
];

export function BenefitsSection() {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate-800 mb-4">¿Por qué elegir UpSkill?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Una plataforma diseñada para maximizar tu aprendizaje con las mejores herramientas y metodologías.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="p-6 text-center space-y-4 rounded-lg bg-white/70 backdrop-blur-sm border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-poppins font-semibold text-slate-800">{benefit.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}