import { Star, Users, Clock } from 'lucide-react';

const trendingCourses = [
    { id: 1, title: "Desarrollo Web Completo", description: "Aprende HTML, CSS, JavaScript y React desde cero", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop", rating: 4.8, students: 2340, duration: "40 horas" },
    { id: 2, title: "Diseño UX/UI Profesional", description: "Domina Figma y los principios del diseño centrado en el usuario", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop", rating: 4.9, students: 1890, duration: "35 horas" },
    { id: 3, title: "Marketing Digital Avanzado", description: "Estrategias de SEO, SEM y redes sociales para crecer", image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=2071&auto=format&fit=crop", rating: 4.7, students: 1560, duration: "28 horas" },
    { id: 4, title: "Python para Data Science", description: "Análisis, machine learning y visualización con Python", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", rating: 4.6, students: 1230, duration: "45 horas" },
];

export function TrendingCourses() {
  return (
    <section className="py-20 px-4 bg-white/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center lg:text-left mb-12">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate-800 mb-4">Cursos en Tendencia</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">Los cursos más populares y mejor valorados por nuestra comunidad</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingCourses.map((course) => (
            <div key={course.id} className="group rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 border border-transparent hover:border-blue-200">
              <div className="relative overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-md text-xs font-medium flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {course.rating}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-poppins font-semibold text-slate-800 line-clamp-2 h-14">{course.title}</h3>
                <p className="text-sm text-slate-600 line-clamp-2 h-10 mt-1">{course.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-2 border-t">
                  <div className="flex items-center space-x-1"><Users className="w-3 h-3" /><span>{course.students.toLocaleString()}</span></div>
                  <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{course.duration}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}