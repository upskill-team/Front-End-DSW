
import {
  BarChart3,
  BookOpen,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Location } from "react-router-dom";

// 1. Definimos la estructura de nuestros enlaces en un solo lugar
const adminLinks: {
  path: string;
  title: string;
  Icon: LucideIcon;
}[] = [
  { path: "/admin/dashboard", title: "Panel General", Icon: LayoutDashboard },
  { path: "/admin/analytics", title: "Analíticas", Icon: BarChart3 },
  { path: "/admin/users", title: "Usuarios", Icon: Users },
  { path: "/admin/courses", title: "Gestion de Cursos", Icon: BookOpen },
  { path: "/admin/courseTypes", title: "Tipos de Cursos", Icon: ClipboardList },
  { path: "/admin/appeals", title: "Solicitudes", Icon: GraduationCap },
];

interface AdminControlsProps {
  handleLinkClick: (path: string) => void;
  activeLinkClasses: string;
  inactiveLinkClasses: string;
  location: Location | undefined;
  // 2. Añadimos una prop para controlar la variante
  orientation?: 'horizontal' | 'vertical'; 
}

export function AdminControls({
  handleLinkClick,
  activeLinkClasses,
  inactiveLinkClasses,
  location,
  orientation = 'horizontal', // Valor por defecto
}: AdminControlsProps) {

  // 3. Clases condicionales para el contenedor principal
  const containerClasses = {
    horizontal: "flex items-center space-x-1 bg-slate-100 p-1 rounded-lg",
    vertical: "space-y-2"
  };

  return (
    <div className={containerClasses[orientation]}>
      {/* 4. Mapeamos el array para generar los enlaces dinámicamente */}
      {adminLinks.map(({ path, title, Icon }) => (
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
            // Clases específicas para la variante vertical (móvil)
            orientation === 'vertical' ? 'w-full justify-center' : ''
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className={
            // Ocultamos el texto en escritorio en pantallas pequeñas, pero lo mostramos siempre en móvil
            orientation === 'horizontal' ? "hidden xl:inline ml-2" : "ml-2"
          }>
            {title}
          </span>
        </Link>
      ))}
    </div>
  );
}