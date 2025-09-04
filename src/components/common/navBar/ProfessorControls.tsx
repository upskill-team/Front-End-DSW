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
  {
    path: "/professor/dashboard/analytics",
    title: "Analíticas",
    Icon: BarChart3,
  },
  { path: "/professor/dashboard/students", title: "Estudiantes", Icon: Users },
];

interface ProfessorControlsProps {
  handleLinkClick: (path: string) => void;
  activeLinkClasses: string;
  inactiveLinkClasses: string;
  location: Location | undefined;
}

export function ProfessorControls({
  handleLinkClick,
  activeLinkClasses,
  inactiveLinkClasses,
  location,
}: ProfessorControlsProps) {
  return (
    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
      <Link
        to="/professor/dashboard/courses"
        title="Mis Cursos"
        onClick={() => handleLinkClick("/professor/dashboard/courses")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/professor/dashboard/courses")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <BookOpen className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Mis Cursos</span>
      </Link>
      <Link
        to="/professor/dashboard/analytics"
        title="Analíticas"
        onClick={() => handleLinkClick("/professor/dashboard/analytics")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/professor/dashboard/analytics")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <BarChart3 className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Analíticas</span>
      </Link>
      <Link
        to="/professor/dashboard/students"
        title="Estudiantes"
        onClick={() => handleLinkClick("/professor/dashboard/students")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/professor/dashboard/students")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <Users className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Estudiantes</span>
      </Link>
    </div>
  );
}
