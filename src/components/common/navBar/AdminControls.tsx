import {
  BarChart3,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Location } from "react-router-dom";


interface AdminControlsProps {
  handleLinkClick: (path: string) => void;
  activeLinkClasses: string;
  inactiveLinkClasses: string;
  location: Location | undefined;
}

export function AdminControls({
  handleLinkClick,
  activeLinkClasses,
  inactiveLinkClasses,
  location,
}: AdminControlsProps) {
  return (
    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
      <Link
        to="/admin/dashboard"
        title="Panel General"
        onClick={() => handleLinkClick("/admin/dashboard")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/admin/dashboard")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Panel General</span>
      </Link>
      <Link
        to="/admin/analytics"
        title="Analíticas"
        onClick={() => handleLinkClick("/admin/analytics")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/admin/analytics")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <BarChart3 className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Analíticas</span>
      </Link>
      <Link
        to="/admin/users"
        title="Usuarios"
        onClick={() => handleLinkClick("/admin/users")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/admin/users")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <Users className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Usuarios</span>
      </Link>
      <Link
        to="/admin/courses"
        title="Gestion de Cursos"
        onClick={() => handleLinkClick("/admin/courses")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/admin/courses")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <BookOpen className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Gestion de Cursos</span>
      </Link>
      <Link
        to="/admin/courseTypes"
        title="Tipos de Cursos"
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/admin/courseTypes")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <ClipboardList className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Tipos de Cursos</span>
      </Link>
      <Link
        to="/admin/appeals"
        title="Solicitudes"
        onClick={() => handleLinkClick("/admin/appeals")}
        className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-colors ${
          location?.pathname.startsWith("/admin/appeals")
            ? activeLinkClasses
            : inactiveLinkClasses
        }`}
      >
        <GraduationCap className="w-4 h-4" />{" "}
        <span className="hidden xl:inline ml-2">Solicitudes</span>
      </Link>
    </div>
  );
}
