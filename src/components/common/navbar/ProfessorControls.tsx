// src/components/common/navbar/ProfessorControls.tsx

import { BarChart3, BookOpen, Users, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import type { Location } from "react-router-dom";

// 1. Definimos los enlaces como una fuente única de verdad.
const professorLinks: {
  path: string;
  title: string;
  Icon: LucideIcon;
}[] = [
  { path: "/professor/dashboard/courses", title: "Mis Cursos", Icon: BookOpen },
  { path: "/professor/dashboard/analytics", title: "Analíticas", Icon: BarChart3 },
  { path: "/professor/dashboard/students", title: "Estudiantes", Icon: Users },
];

interface ProfessorControlsProps {
  handleLinkClick: (path: string) => void;
  activeLinkClasses: string;
  inactiveLinkClasses: string;
  location: Location | undefined;
  // 2. Añadimos la prop de orientación.
  orientation?: 'horizontal' | 'vertical';
}

export function ProfessorControls({
  handleLinkClick,
  activeLinkClasses,
  inactiveLinkClasses,
  location,
  orientation = 'horizontal', // Valor por defecto para retrocompatibilidad
}: ProfessorControlsProps) {

  // 3. Definimos las clases para el contenedor principal según la orientación.
  const containerClasses = {
    horizontal: "flex items-center space-x-1 bg-slate-100 p-1 rounded-lg",
    vertical: "space-y-2" // Clases para la vista móvil: apilados verticalmente.
  };

  return (
    <div className={containerClasses[orientation]}>
      {/* 4. Mapeamos el array para renderizar los enlaces dinámicamente. */}
      {professorLinks.map(({ path, title, Icon }) => (
        <Link
          key={path}
          to={path}
          title={title}
          onClick={() => handleLinkClick(path)}
          className={`px-3 py-2 text-sm font-medium rounded-md flex items-center transition-colors ${
            location?.pathname.startsWith(path)
              ? activeLinkClasses
              : inactiveLinkClasses
          } ${
            // Si es vertical (móvil), hacemos que ocupe todo el ancho y se centre.
            orientation === 'vertical' ? 'w-full justify-center' : ''
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className={
            // En horizontal (desktop), el texto se oculta en pantallas medianas.
            // En vertical (móvil), el texto siempre es visible.
            orientation === 'horizontal' ? "hidden xl:inline ml-2" : "ml-2"
          }>
            {title}
          </span>
        </Link>
      ))}
    </div>
  );
}