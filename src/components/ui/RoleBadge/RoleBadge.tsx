import Badge from '../Badge/Badge';
import { Shield, GraduationCap } from 'lucide-react';
import type { UserRole } from '../../../types/entities';

interface RoleBadgeProps {
  role: UserRole;
}

/**
 * RoleBadge component to display user roles with specific styles and icons.
 */
const RoleBadge = ({ role }: RoleBadgeProps) => {
  switch (role) {
    case 'admin':
      return (
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    case 'professor':
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
          <GraduationCap className="w-3 h-3 mr-1" />
          Profesor
        </Badge>
      );
    case 'student':
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
          <GraduationCap className="w-3 h-3 mr-1" />
          Estudiante
        </Badge>
      );
    default:
      return <Badge>{role}</Badge>;
  }
};

export default RoleBadge;