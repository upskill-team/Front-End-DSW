import { BookOpen, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card.tsx";
import { useParams } from "react-router-dom";
import { useCourseById } from "../../hooks/useCourses.ts";
import Badge from "../../components/ui/Badge.tsx";
import Button from "../../components/ui/Button.tsx";

function CourseDetails() {
  // Obtenemos el parámetro `id` de la URL, ej: /courses/123
  const { courseId } = useParams<{ courseId: string }>();

  // Usamos nuestro nuevo hook con el ID de la URL.
  // Renombramos `data` a `course` para mayor claridad.
  const { data: course, isLoading, isError, error } = useCourseById(courseId);

  if (isLoading) {
    return <div>Cargando detalles del curso...</div>;
  }

  if (isError) {
    // Podrías tener un manejo de errores más específico (ej. 404 Not Found)
    return <div>Error al cargar el curso: {error.message}</div>;
  }

  console.log(course?.courseType.name);
  return (
    <div className="d-flex">

     <h1>Curso completo de {course?.name}</h1>   
    <Card className="group transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={course?.imageUrl || "/img/noImage.jpg"}
          alt={course?.name || "Vista previa del curso"}
          className="w-full h-48 object-cover transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2">
          {course?.name || "Nombre del curso"}
        </CardTitle>
        <p className="text-sm text-slate-600 min-h-[40px]">
          {course?.description || "La descripción del curso aparecerá aquí..."}
        </p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>0 estudiantes</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>0 lecciones</span>
            </div>
          </div>
          <span className="text-2xl font-bold text-slate-800">
            {course.price > 0 ? <>$ {course?.price}</> : <>GRATIS</>}
          </span>
          <div className="flex items-center justify-between pt-2 border-t">
            <Button variant="primary" size="md" className="w-full lg:w-auto">
              Inscribirse
            </Button>
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              {course?.courseType.name || "Categoría"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    </div>
  );
}

export default CourseDetails;
