import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { TrendingUp, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const teacherStats = {
    rating: 4.8,
    totalStudents: 1247,
    totalCourses: 8,
    totalEarnings: 15420,
};

const professorRevenueData = [
  { month: "Ene", revenue: 1800 },
  { month: "Feb", revenue: 2100 },
  { month: "Mar", revenue: 2350 },
  { month: "Abr", revenue: 2200 },
  { month: "May", revenue: 2500 },
  { month: "Jun", revenue: 2800 },
];

const ProfessorAnalyticsPage = () => {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Ingresos totales</CardDescription>
                        <CardTitle className="text-3xl">${teacherStats.totalEarnings.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className="bg-green-100 text-green-700 border-green-200">+8% este mes</Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Estudiantes totales</CardDescription>
                        <CardTitle className="text-3xl">{teacherStats.totalStudents.toLocaleString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className="bg-green-100 text-green-700 border-green-200">+23 esta semana</Badge>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Cursos publicados</CardDescription>
                        <CardTitle className="text-3xl">{teacherStats.totalCourses}</CardTitle>
                    </CardHeader>
                     <CardContent>
                        <p className="text-xs text-slate-500">2 cursos en desarrollo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>Calificación promedio</CardDescription>
                        <CardTitle className="text-3xl flex items-center">{teacherStats.rating} <Star className="w-5 h-5 ml-1 text-yellow-400 fill-yellow-400" /></CardTitle>
                    </CardHeader>
                     <CardContent>
                        <Badge className="bg-green-100 text-green-700 border-green-200">+0.1 vs mes anterior</Badge>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span>Historial de Ingresos</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={professorRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(5px)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.5rem',
                                }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Ingresos ($)" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfessorAnalyticsPage;