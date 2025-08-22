import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import { Users, BookOpen, GraduationCap, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { appealService } from '../../api/services/appeal.service';
import type { Appeal } from '../../types/entities';

const stats = [
  { title: "Total Estudiantes", value: "52,340", change: "+12%", icon: Users },
  { title: "Cursos Activos", value: "1,247", change: "+8%", icon: BookOpen },
  { title: "Profesores", value: "189", change: "+15%", icon: GraduationCap },
  { title: "Ingresos del Mes", value: "$45,230", change: "+23%", icon: TrendingUp },
];

export default function AdminDashboard() {
  const [recentRequests, setRecentRequests] = useState<Appeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const allRequests = await appealService.findAllAppeals();
        const sorted = allRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentRequests(sorted.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecentRequests();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard de Administrador</h1>
        <p className="text-slate-600">Resumen general de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-2 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
              <stat.icon className="w-5 h-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.change} desde el mes pasado</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><GraduationCap className="w-5 h-5 mr-2" />Solicitudes Recientes</CardTitle>
            <CardDescription>
              Últimas solicitudes recibidas. <Link to="/admin/teacher-requests" className="text-blue-600 hover:underline">Ver todas</Link>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? <p>Cargando...</p> : recentRequests.map(req => {
                const date = new Date(req.date);
                const formattedDate = !isNaN(date.getTime())
                  ? date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'Fecha no disponible';
                
                return (
                <div key={req.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-800">{req.user.name} {req.user.surname}</p>
                    <p className="text-sm text-slate-600">{req.expertise}</p>
                    <p className="text-xs text-slate-500">{formattedDate}</p>
                  </div>
                  <StatusBadge status={req.state} />
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><AlertCircle className="w-5 h-5 mr-2" />Alertas del Sistema</CardTitle>
            <CardDescription>Notificaciones importantes de la plataforma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-800">5 solicitudes pendientes</p>
                <p className="text-xs text-yellow-600">Hay profesores esperando aprobación.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Crecimiento del 23%</p>
                  <p className="text-xs text-blue-600">Nuevos registros este mes</p>
                </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Sistema actualizado</p>
                <p className="text-xs text-green-600">Última actualización: hace 2 días.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}