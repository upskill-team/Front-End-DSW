import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign } from 'lucide-react';

const userGrowthData = [
  { month: "Ene", students: 1200, teachers: 45 }, { month: "Feb", students: 1450, teachers: 52 },
  { month: "Mar", students: 1680, teachers: 58 }, { month: "Abr", students: 1920, teachers: 65 },
];
const revenueData = [
  { month: "Ene", revenue: 12500 }, { month: "Feb", revenue: 15200 },
  { month: "Mar", revenue: 18900 }, { month: "Abr", revenue: 22100 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Estadísticas y Métricas</h1>
        <p className="text-slate-600">Panel de análisis y rendimiento de la plataforma.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="w-5 h-5 mr-2 text-blue-500" />Crecimiento de Usuarios</CardTitle>
            <CardDescription>Evolución mensual de estudiantes y profesores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#3b82f6" name="Estudiantes" />
                <Bar dataKey="teachers" fill="#10b981" name="Profesores" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><DollarSign className="w-5 h-5 mr-2 text-green-500" />Ingresos Mensuales</CardTitle>
            <CardDescription>Evolución de ingresos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" name="Ingresos ($)" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}