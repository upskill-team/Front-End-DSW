import { Award, BookOpen, Download, Globe, Play, Smartphone, Star, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCourseById } from "../../hooks/useCourses.ts";
import Badge from "../../components/ui/Badge.tsx";
import Button from "../../components/ui/Button.tsx";
import { useEnrollInCourse, useExistingEnrollment} from "../../hooks/useEnrollment.ts";
import { useAuth } from "../../hooks/useAuth.ts";

function CourseDetails() {

  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate(); 
  const { user } = useAuth();

  const { data: course, isLoading, isError, error } = useCourseById(courseId);

  const {
    data: existingEnrollment,
    isLoading: isLoadingEnrollmentCheck
  } = useExistingEnrollment(user?.studentProfile?.id, courseId);

  const { enroll, isPending:isEnrolling } = useEnrollInCourse();

  const handleEnroll = ()=>{
    
    if(!user){
      alert("Debes iniciar sesión para inscribirte en un curso.");
      navigate('/login');
      return;
    }


    if(course?.price>0){
      alert("Funcionalidad de pago no implementada aún.");
      return;
    }

  enroll(

    {
      studentId: user.studentProfile?.id,
      courseId: course.id
    },
    // 2. Segundo argumento (opcional): un objeto con callbacks
    {
      onSuccess: (data) => {
        // Esta función se ejecutará SOLO CUANDO la API responda con éxito.
        console.log('Inscripción exitosa, navegando...', data);
        navigate(`/courses/learn/${course?.id}`);
      },
      onError: (error) => {
        // Esta se ejecutará si la API devuelve un error.
        console.error('Fallo al inscribir:', error);
        // Aquí podrías mostrar una notificación de error al usuario.
        alert(`Error al inscribir: ${error.message}`);
      }
    }
  );
  }

const renderEnrollmentButton = () => {
    // Mientras se verifica, mostramos un estado de carga
    if (isLoadingEnrollmentCheck) {
      return <button disabled>Verificando inscripción...</button>;
    }

    // Si ya existe una inscripción
    if (existingEnrollment) {
      return (

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
        onClick={() => navigate(`/courses/learn/${course?.id}`)}
      >
        Ir al Curso
      </Button>
      );
    }

    // Si no existe, mostramos el botón para inscribirse
    return (
    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
      onClick={handleEnroll}
      disabled={isEnrolling}
    >
      Inscribirse ahora
    </Button>
    );
  };

  if (isLoading) {
    return <div>Cargando detalles del curso...</div>;
  }

  if (isError) {
    // Podrías tener un manejo de errores más específico (ej. 404 Not Found)
    return <div>Error al cargar el curso: {error.message}</div>;
  }

  // Datos del curso
  const curso = {
    id: 3,
    titulo: "Desarrollo Web Completo con React y Node.js",
    descripcion:
      "Domina el desarrollo web moderno desde cero. Aprende HTML, CSS, JavaScript, React, Node.js y MongoDB para crear aplicaciones web completas y profesionales.",
    imagen: "/web-development-coding-screen.png",
    instructor: {
      nombre: "Dr. Carlos Mendoza",
      titulo: "Ingeniero en Sistemas",
      experiencia: "15 años de experiencia",
      avatar: "/professional-instructor.png",
    },
    rating: 4.8,
    totalReviews: 1250,
    estudiantes: 8945,
    duracion: "42h 30m",
    nivel: "Intermedio",
    precio: 89.99,
    precioOriginal: 199.99,
    categoria: "Desarrollo Web",
    lecciones: 156,
    idioma: "Español",
    ultimaActualizacion: "Marzo 2024",
    certificado: true,
    accesoMovil: true,
    descargable: true,
  }

  return (

    <div>

              <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
            <Link to="/courses" className="hover:text-blue-600">
              Cursos
            </Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-blue-600">
              {course?.courseType.name}
            </Link>
            <span>/</span>
            <span className="text-slate-800">{course?.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contenido principal - Izquierda */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header del curso */}
              <div>
                <Badge className="bg-blue-500 text-white mb-3">{course?.courseType.name}</Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4 text-balance">{course?.name}</h1>
                <p className="text-lg text-slate-600 mb-6 text-pretty">{course?.description}</p>

                {/* Estadísticas */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold text-slate-800">{curso.rating}</span>
                    <span>({curso.totalReviews.toLocaleString()} valoraciones)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{curso.estudiantes.toLocaleString()} estudiantes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course?.units.length} lecciones</span>
                  </div>

                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200">
                  <img
                    src={course?.professor.user.profile_picture || "/img/noImage.jpg"}
                    alt={course?.professor.user.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm text-slate-600">Creado por</p>
                    <p className="font-semibold text-slate-800">{course?.professor.user.name} {course?.professor.user.surname}</p>

                  </div>
                </div>
              </div>


              {/* Contenido del curso */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Contenido del curso</h2>
                <div className="space-y-3">
                  {course?.units.map((seccion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Play className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{seccion.name}</p>
                          <p className="text-sm text-slate-600">
                            {seccion.materials.length > 0 && (
                              <span>{seccion.materials.length} Recursos</span>
                            )}
                            {seccion.materials.length > 0 && seccion.questions.length > 0 && (
                              <span className="mx-2">·</span> /* separador visible solo si hay ambos */
                            )}
                            {seccion.questions.length > 0 && (
                              <span>{seccion.questions.length} Preguntas</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Card del curso - Derecha */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden sticky top-24">
                {/* Imagen del curso */}
                <div className="relative">
                  <img
                    src={course?.imageUrl || "/img/noImage.jpg"}
                    alt={course?.name}
                    className="w-full h-48 object-cover"
                  />
 
                </div>

                <div className="p-6">
                  {/* Precio */}
                  <div className="mb-6">
                    <div className="flex items-baseline space-x-2 mb-2">
                      <span className="text-4xl font-bold text-slate-800">
                        {course.price > 0 ? <>$ {course?.price}</> : <>GRATIS</>}

                      </span>
                    </div>

                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3 mb-6">
                    {renderEnrollmentButton()}
                  </div>

                  {/* Incluye */}
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-800 mb-4">Este curso incluye:</h3>
                    <div className="space-y-3 text-sm text-slate-700">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course?.units.length} lecciones</span>
                    </div>
                      <div className="flex items-center space-x-3">
                        <Download className="w-5 h-5 text-slate-500" />
                        <span>Recursos descargables</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-slate-500" />
                        <span>Acceso en móvil y TV</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-slate-500" />
                        <span>Acceso de por vida</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Award className="w-5 h-5 text-slate-500" />
                        <span>Certificado de finalización</span>
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="border-t border-slate-200 pt-6 mt-6 space-y-2 text-sm text-slate-600">
                    <div className="flex justify-between">
                      <span>Idioma:</span>
                      <span className="font-medium text-slate-800">Español</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default CourseDetails;
