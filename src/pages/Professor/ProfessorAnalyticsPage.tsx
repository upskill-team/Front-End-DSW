import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProfessorAnalytics } from '../../hooks/useProfessor.ts';

const professorRevenueData = [
  { month: "Ene", revenue: 1800 },
  { month: "Feb", revenue: 2100 },
  { month: "Mar", revenue: 2350 },
  { month: "Abr", revenue: 2200 },
  { month: "May", revenue: 2500 },
  { month: "Jun", revenue: 2800 },
];

const ProfessorAnalyticsPage = () => {
    const { data: analyticsData, isLoading } = useProfessorAnalytics();

    const totalStudents = analyticsData?.totalStudents ?? 0;
    const publishedCourses = analyticsData?.publishedCourses ?? 0;
    const totalEarnings = analyticsData?.totalEarnings ?? 15420;

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardDescription>Ingresos totales</CardDescription>
                        {isLoading ? <div className="h-9 bg-slate-200 rounded animate-pulse w-3/4"></div> : <CardTitle className="text-3xl">${totalEarnings.toLocaleString()}</CardTitle>}
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Estudiantes totales</CardDescription>
                        {isLoading ? <div className="h-9 bg-slate-200 rounded animate-pulse w-1/2"></div> : <CardTitle className="text-3xl">{totalStudents.toLocaleString()}</CardTitle>}
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription>Cursos publicados</CardDescription>
                        {isLoading ? <div className="h-9 bg-slate-200 rounded animate-pulse w-1/4"></div> : <CardTitle className="text-3xl">{publishedCourses}</CardTitle>}
                    </CardHeader>
                </Card>
            </div>
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
        </div>
    );
};

export default ProfessorAnalyticsPage;