import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'General',
    question: '¿Qué es UpSkill?',
    answer: 'UpSkill es una plataforma de educación online que conecta a estudiantes con profesores expertos. Ofrecemos una amplia variedad de cursos en diferentes áreas para ayudarte a desarrollar nuevas habilidades y avanzar en tu carrera profesional.',
  },
  {
    category: 'General',
    question: '¿Cómo puedo crear una cuenta?',
    answer: 'Para crear una cuenta, haz clic en el botón "Registrarse" en la parte superior de la página. Completa el formulario con tu información básica (nombre, email y contraseña) y listo. También puedes iniciar sesión con tu cuenta de Google.',
  },
  {
    category: 'Cursos',
    question: '¿Cómo me inscribo en un curso?',
    answer: 'Explora nuestro catálogo de cursos, selecciona el que te interese y haz clic en "Inscribirse". Si el curso tiene un costo, serás redirigido a la página de pago. Una vez completada la inscripción, podrás acceder al contenido del curso inmediatamente.',
  },
  {
    category: 'Cursos',
    question: '¿Los cursos tienen fecha de inicio y fin?',
    answer: 'La mayoría de nuestros cursos son de acceso flexible, lo que significa que puedes comenzar cuando quieras y avanzar a tu propio ritmo. Una vez inscrito, tendrás acceso al contenido del curso sin límite de tiempo.',
  },
  {
    category: 'Cursos',
    question: '¿Puedo acceder a los cursos desde cualquier dispositivo?',
    answer: 'Sí, nuestra plataforma es completamente responsive. Puedes acceder a tus cursos desde computadoras, tablets y smartphones, siempre que tengas conexión a internet.',
  },
  {
    category: 'Pagos',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos pagos a través de Mercado Pago, que incluye tarjetas de crédito, débito y otros métodos de pago disponibles en tu región.',
  },
  {
    category: 'Profesores',
    question: '¿Cómo puedo convertirme en profesor en UpSkill?',
    answer: 'Si tienes experiencia en un área y deseas compartir tus conocimientos, puedes solicitar convertirte en profesor desde tu perfil. Ve a la sección "Convertirse en Profesor" y completa el formulario de solicitud. Nuestro equipo revisará tu solicitud y te contactará.',
  },
  {
    category: 'Profesores',
    question: '¿Qué requisitos necesito para ser profesor?',
    answer: 'Buscamos profesores con experiencia comprobable en su área de expertise, habilidades de enseñanza y pasión por compartir conocimientos. Durante el proceso de solicitud, evaluaremos tu perfil, experiencia y motivación.',
  },
  {
    category: 'Evaluaciones',
    question: '¿Los cursos incluyen evaluaciones?',
    answer: 'Sí, muchos cursos incluyen evaluaciones para ayudarte a medir tu progreso y consolidar lo aprendido. Las evaluaciones pueden ser cuestionarios, ejercicios prácticos o proyectos finales, dependiendo del curso.',
  },
  {
    category: 'Evaluaciones',
    question: '¿Puedo repetir una evaluación?',
    answer: 'Sí, puedes repetir las evaluaciones cuantas veces necesites para mejorar tu puntuación. Cada curso puede tener diferentes políticas sobre el número de intentos permitidos.',
  },
  {
    category: 'Soporte',
    question: '¿Cómo puedo contactar al soporte?',
    answer: 'Puedes contactarnos enviando un email a contacto.upskill@gmail.com. Nuestro equipo de soporte responderá a tu consulta lo antes posible.',
  },
  {
    category: 'Soporte',
    question: '¿Puedo hacer preguntas sobre el contenido del curso?',
    answer: 'Sí, cada curso tiene una sección de preguntas donde puedes hacer consultas sobre el contenido. Los profesores y otros estudiantes pueden responder a tus preguntas.',
  },
];

const categories = Array.from(new Set(faqs.map(faq => faq.category)));

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = selectedCategory === 'Todos'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre UpSkill
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setSelectedCategory('Todos')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              selectedCategory === 'Todos'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-4" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 pt-2">
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl shadow-xl p-8 md:p-12 text-white max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-lg mb-6">
              Nuestro equipo está aquí para ayudarte. Contáctanos y responderemos tus preguntas.
            </p>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Contactar Soporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
