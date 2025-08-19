import { Trophy, Star } from 'lucide-react';

const topCourses = [
  { rank: 1, title: "Desarrollo Web Full Stack con React y Node.js", rating: 4.8 },
  { rank: 2, title: "Marketing Digital y Redes Sociales", rating: 4.7 },
  { rank: 3, title: "Diseño UX/UI con Figma", rating: 4.9 },
  { rank: 4, title: "Finanzas Personales e Inversión", rating: 4.5 },
  { rank: 5, title: "Inteligencia Artificial con Python", rating: 4.6 },
];

export function PopularRanking() {
  return (
    <section className="py-20 px-4 bg-white/50">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate-800">Ranking de Popularidad</h2>
          </div>
          <p className="text-lg text-slate-600">Los cursos con mayor crecimiento esta semana</p>
        </div>

        <div className="space-y-4 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200 p-4 sm:p-6">
          {topCourses.map((course) => (
            <div key={course.rank} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 hover:bg-blue-50/50 rounded-lg transition-colors duration-200">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white text-md sm:text-lg shadow-md ${
                  course.rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                  : course.rank === 2 ? "bg-gradient-to-br from-gray-400 to-gray-600"
                  : course.rank === 3 ? "bg-gradient-to-br from-orange-500 to-orange-700"
                  : "bg-gradient-to-br from-blue-400 to-blue-600"
                }`}
              >
                {course.rank}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base md:text-lg line-clamp-1">{course.title}</h3>
              </div>

              <div className="flex items-center space-x-1 text-slate-600">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-sm sm:text-base">{course.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}