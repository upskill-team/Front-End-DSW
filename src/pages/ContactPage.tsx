import { Mail, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Contáctanos
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            ¿Tienes alguna pregunta o sugerencia? Nos encantaría escucharte.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Contact Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Email Contact */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">Email</h3>
                <a
                  href="mailto:contacto.upskill@gmail.com"
                  className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  contacto.upskill@gmail.com
                </a>
              </div>

              {/* Response Time */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">Tiempo de Respuesta</h3>
                <p className="text-slate-600">24-48 horas hábiles</p>
              </div>

              {/* Support */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">Soporte</h3>
                <p className="text-slate-600">Lunes a Viernes</p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Sobre UpSkill
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Somos una plataforma de educación online dedicada a democratizar el acceso 
                al conocimiento y ayudar a profesionales y estudiantes a desarrollar nuevas 
                habilidades.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Conectamos a estudiantes con profesores expertos en una experiencia de 
                aprendizaje flexible, personalizada y orientada a resultados.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                ¿En qué podemos ayudarte?
              </h2>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Consultas sobre cursos y contenidos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Problemas técnicos con la plataforma</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Información sobre pagos e inscripciones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Solicitudes para convertirse en profesor</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Sugerencias y comentarios</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQ Link */}
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Preguntas Frecuentes
            </h3>
            <p className="text-slate-600 mb-6">
              Antes de contactarnos, te invitamos a revisar nuestra sección de preguntas 
              frecuentes donde podrás encontrar respuestas rápidas a las consultas más comunes.
            </p>
            <a
              href="/faq"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Ver Preguntas Frecuentes
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
