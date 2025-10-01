import { useState } from "react";
import CardList from "../../components/ui/CardList.tsx";
import type { SearchCoursesParams } from "../../types/shared.ts";
import { useSearchCourses } from "../../hooks/useCourses.ts";

const CourseListPage = () => {
  //State para el futuro paginado
  const [filters] = useState<SearchCoursesParams>({
    limit: 5,
    offset: 0,
    status: "publicado",
  });

  const { data, isLoading, isError, error } = useSearchCourses(filters);

  console.log(data)

  //Funciones para paginado
 /* const handleNextPage = () => {
    // Aseguramos que 'data.total' exista antes de paginar
    if (data && filters.offset! + filters.limit! < data.total) {
      setFilters((prev) => ({ ...prev, offset: prev.offset! + prev.limit! }));
    }
  };

  const handlePrevPage = () => {
    setFilters((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset! - prev.limit!),
    }));
  };*/

  // Manejo de estado y carga de error basico -- Borrar en futuras iteraciones

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl text-center py-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Todos los Cursos
        </h1>
        <p className="text-lg text-slate-600">Cargando cursos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-7xl text-center py-10">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Todos los Cursos
        </h1>
        <p className="text-lg text-red-600">
          Error al cargar los cursos: {error?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Todos los Cursos
        </h1>
        <p className="text-lg text-slate-600">
          Descubre más de {data?.total || 0} cursos para impulsar tu carrera
        </p>
      </div>

      <div className="space-y-4">
        {/* 4. Mapeamos sobre `data.data` en lugar de `allCourses` */}
        {/* Usamos `data?.data` para evitar errores si `data` es undefined */}
        {data?.courses && data.courses.length > 0 ? (
          data.courses.map((course) => (
            <CardList key={course.id} course={course} />
          ))
        ) : (
          <p className="text-center text-slate-600 text-lg">
            No hay cursos disponibles en este momento.
          </p>
        )}
      </div>
    </div>
  );
// Version con persistencia antigua
  /*
    return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Todos los Cursos
        </h1>
        <p className="text-lg text-slate-600">
          Descubre más de {allCourses.length} cursos para impulsar tu carrera
        </p>
      </div>

      <div className="space-y-4">
        {allCourses.map((course) => (
          <CardList key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
   */

};

export default CourseListPage;
