import Badge from '../Badge/Badge';
import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface StatusBadgeProps {
  status:
    | 'pending'
    | 'accepted'
    | 'rejected'
    | 'enrolled'
    | 'in-progress'
    | 'completed'
    | string;
}
/**
 * StatusBadge Component
 * implements a badge that displays different styles based on the status prop.
 */
const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="w-3 h-3 mr-1" />
          Pendiente
        </Badge>
      );
    case 'accepted':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Aprobado
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Rechazado
        </Badge>
      );
    case 'enrolled':
    case 'in-progress':
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          <TrendingUp className="w-3 h-3 mr-1" />
          En Progreso
        </Badge>
      );
    case 'completed':
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completado
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default StatusBadge;
