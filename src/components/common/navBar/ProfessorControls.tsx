import { BarChart3, BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { Location } from "react-router-dom";

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
    <>
      <Link
        to="/professor/dashboard/courses"
        title="Mis Cursos"
        onClick={() => handleLinkClick("/professor/dashboard/courses")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/professor/dashboard/courses") ? activeLinkClasses : inactiveLinkClasses
        }`}
      >
        <BookOpen className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Mis Cursos</span>
      </Link>
      <Link
        to="/professor/dashboard/assessments"
        title="Evaluaciones"
        onClick={() => handleLinkClick("/professor/dashboard/assessments")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/professor/dashboard/assessments") ? activeLinkClasses : inactiveLinkClasses
        }`}
      >
        <FileText className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Evaluaciones</span>
      </Link>
      <Link
        to="/professor/dashboard/analytics"
        title="Analíticas"
        onClick={() => handleLinkClick("/professor/dashboard/analytics")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/professor/dashboard/analytics") ? activeLinkClasses : inactiveLinkClasses
        }`}
      >
        <BarChart3 className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Analíticas</span>
      </Link>
    </>
  );
}