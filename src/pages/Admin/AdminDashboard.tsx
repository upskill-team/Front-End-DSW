import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import {
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
} from 'lucide-react';
import { appealService } from '../../api/services/appeal.service';
import { useAdminAnalytics } from '../../hooks/useAdmin';
import { formatCurrency } from '../../lib/currency';
import type { Appeal } from '../../types/entities';

export default function AdminDashboard() {
  const [recentRequests, setRecentRequests] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener analíticas del backend
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useAdminAnalytics(6);

  // Construir stats dinámicamente desde las analíticas
  const stats = analytics
    ? [
        {
          title: 'Total Estudiantes',
          value: analytics.totalStudents.toLocaleString('es-AR'),
          change: `${
            analytics.growth.studentsGrowthPercentage >= 0 ? '+' : ''
          }${analytics.growth.studentsGrowthPercentage.toFixed(1)}%`,
          icon: Users,
          isPositive: analytics.growth.studentsGrowthPercentage >= 0,
        },
        {
          title: 'Cursos Publicados',
          value:
            analytics.courseStats.byStatus.publicado.toLocaleString('es-AR'),
          change: `${
            analytics.growth.coursesGrowthPercentage >= 0 ? '+' : ''
          }${analytics.growth.coursesGrowthPercentage.toFixed(1)}%`,
          icon: BookOpen,
          isPositive: analytics.growth.coursesGrowthPercentage >= 0,
        },
        {
          title: 'Profesores Activos',
          value: analytics.totalProfessors.toLocaleString('es-AR'),
          change: `${
            analytics.growth.professorsGrowthPercentage >= 0 ? '+' : ''
          }${analytics.growth.professorsGrowthPercentage.toFixed(1)}%`,
          icon: GraduationCap,
          isPositive: analytics.growth.professorsGrowthPercentage >= 0,
        },
        {
          title: 'Ingresos de la Plataforma',
          value: formatCurrency(analytics.platformEarningsInCents),
          change: `${
            analytics.growth.revenueGrowthPercentage >= 0 ? '+' : ''
          }${analytics.growth.revenueGrowthPercentage.toFixed(1)}%`,
          icon: DollarSign,
          isPositive: analytics.growth.revenueGrowthPercentage >= 0,
        },
      ]
    : [];

  useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const response = await appealService.findAllAppeals();
        const allRequests = response.appeals || [];
        const sorted = allRequests.sort(
          (a: Appeal, b: Appeal) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentRequests(sorted.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentRequests();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Dashboard de Administrador
        </h1>
        <p className="text-slate-600">Resumen general de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-5 h-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {stat.value}
              </div>
              <p
                className={`text-xs mt-1 ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change} desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoadingAnalytics ? (
        <div className="text-center p-8">
          <p className="text-slate-600">Cargando estadísticas...</p>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Solicitudes Recientes
          </CardTitle>
          <CardDescription>
            Últimas solicitudes recibidas.{' '}
            <Link
              to="/admin/teacher-requests"
              className="text-blue-600 hover:underline"
            >
              Ver todas
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p>Cargando...</p>
              ) : (
                recentRequests.map((req) => {
                  const date = new Date(req.date);
                  const formattedDate = !isNaN(date.getTime())
                    ? date.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Fecha no disponible';

                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {req.user.name} {req.user.surname}
                        </p>
                        <p className="text-sm text-slate-600">
                          {req.expertise}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formattedDate}
                        </p>
                      </div>
                      <StatusBadge status={req.state} />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
