import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { BookOpen, Users, DollarSign, Edit, Star, Plus } from 'lucide-react'
import { useProfessorCourses } from '../../hooks/useCourses.ts'

const ProfessorCoursesPage = () => {
  const { data: courses, isLoading, error } = useProfessorCourses()

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <p className="text-slate-600">Cargando tus cursos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Ocurrió un error</h3>
        <p className="text-red-600">{error.message}</p>
      </div>
    )
  }
  
  if (!courses || courses.length === 0) {
    return (
      <div className="text-center p-12 bg-slate-50 border rounded-lg">
        <h3 className="text-slate-800 font-semibold text-xl">Aún no tienes cursos</h3>
        <p className="text-slate-600 mt-2 mb-4">¡Es un buen momento para empezar a crear!</p>
        <Button size="md" className="bg-green-500 hover:bg-green-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Crear tu Primer Curso
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Mis Cursos ({courses.length})
            </h2>
          </div>
          <div className="flex gap-3">
            <Button
              size="md"
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Curso
            </Button>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="group hover:shadow-lg transition-all duration-300"
          >
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={'/img/noImage.jpg'} 
                alt={course.name}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  Publicado
                </Badge>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-slate-700 border-0">
                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                  4.8
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 h-14">
                {course.name}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                {course.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{course.students.length} estudiantes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>
                      {course.units.reduce((acc, unit) => acc + unit.materials.length + unit.activities.length, 0)} lecciones
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 col-span-2">
                    <DollarSign className="w-3 h-3" />
                    <span>$0</span>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProfessorCoursesPage
