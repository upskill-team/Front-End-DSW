// src/pages/Professor/ProfessorStudentsPage.tsx

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, AlertCircle } from 'lucide-react';
import { useProfessorRecentEnrollments } from '../../hooks/useEnrollment'

const timeAgo = (date: string): string => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " años";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses";
  interval = seconds / 86400;
  if (interval > 1) return "Hace " + Math.floor(interval) + " días";
  interval = seconds / 3600;
  if (interval > 1) return "Hace " + Math.floor(interval) + " horas";
  interval = seconds / 60;
  if (interval > 1) return "Hace " + Math.floor(interval) + " minutos";
  return "Hace " + Math.floor(seconds) + " segundos";
}

const ProfessorStudentsPage = () => {
    const { data: recentEnrollments, isLoading, isError } = useProfessorRecentEnrollments();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Estudiantes Recientes (Últimos 7 días)</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <p className="text-center text-slate-500 py-8">Cargando estudiantes...</p>
                )}

                {isError && (
                    <div className="text-center text-red-500 py-8">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>No se pudieron cargar los estudiantes.</p>
                    </div>
                )}

                {!isLoading && !isError && (!recentEnrollments || recentEnrollments.length === 0) && (
                    <div className="text-center text-slate-500 py-8">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No hay inscripciones de estudiantes en los últimos 7 días.</p>
                    </div>
                )}

                {!isLoading && !isError && recentEnrollments && recentEnrollments.length > 0 && (
                    <div className="space-y-4">
                        {recentEnrollments.map((enrollment) => {
                            const studentName = `${enrollment.student.user.name} ${enrollment.student.user.surname}`;
                            const initials = (enrollment.student.user.name[0] + (enrollment.student.user.surname[0] || '')).toUpperCase();

                            return (
                                <div key={enrollment.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {initials}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{studentName}</p>
                                            <p className="text-sm text-slate-600">{enrollment.course.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500">{timeAgo(enrollment.enrolledAt)}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ProfessorStudentsPage;