import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            En UpSkill, creemos que la educación es la clave para transformar vidas y crear oportunidades.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Nuestra Misión</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Nuestra misión es democratizar el acceso a la educación de calidad, brindando a estudiantes 
              y profesionales las herramientas necesarias para desarrollar nuevas habilidades y alcanzar 
              sus metas profesionales.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Conectamos a estudiantes con profesores expertos en una plataforma intuitiva y accesible, 
              donde el aprendizaje es flexible, personalizado y orientado a resultados reales.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Calidad</h3>
              <p className="text-slate-600">
                Cursos diseñados por expertos con contenido actualizado y relevante.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Comunidad</h3>
              <p className="text-slate-600">
                Fomentamos el aprendizaje colaborativo y el intercambio de conocimientos.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Excelencia</h3>
              <p className="text-slate-600">
                Comprometidos con la mejora continua y la innovación educativa.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Crecimiento</h3>
              <p className="text-slate-600">
                Impulsamos el desarrollo personal y profesional de nuestra comunidad.
              </p>
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl shadow-xl p-8 md:p-12 text-white">
          <h2 className="text-3xl font-bold mb-6">Nuestra Visión</h2>
          <p className="text-lg leading-relaxed mb-4">
            Aspiramos a ser la plataforma de educación online líder en Latinoamérica, reconocida por 
            la calidad de nuestros cursos, la experiencia de aprendizaje que ofrecemos y el impacto 
            positivo que generamos en la vida de miles de estudiantes.
          </p>
          <p className="text-lg leading-relaxed">
            Queremos construir un futuro donde el conocimiento sea accesible para todos, sin importar 
            su ubicación geográfica o situación económica.
          </p>
        </div>
      </div>
    </div>
  );
}
