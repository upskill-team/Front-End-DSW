import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useProfessorAnalytics } from '../../hooks/useProfessor.ts';
import { formatCurrency, toAmount } from '../../lib/currency';

type MonthlyRevenuePoint = {
  month: string;
  revenue: number;
  sales: number;
};

const ProfessorAnalyticsPage = () => {
  const { data: analyticsData, isLoading } = useProfessorAnalytics();

  const totalStudents = analyticsData?.totalStudents ?? 0;
  const publishedCourses = analyticsData?.publishedCourses ?? 0;
  const totalEarningsInCents = analyticsData?.totalEarningsInCents ?? 0;
  const totalSales = analyticsData?.totalSales ?? 0;

  const monthNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  const monthlyRevenueData: MonthlyRevenuePoint[] =
    analyticsData?.monthlyEarnings?.map((item) => {
      const parts = item.month.split('-');
      const monthNum = parts[1] ?? '01';
      const monthIndex = Math.max(0, Math.min(11, parseInt(monthNum, 10) - 1));
      const monthName = monthNames[monthIndex] ?? monthNum;

      return {
        month: monthName,
        revenue: toAmount(item.earningsInCents), // Convertir centavos a pesos
        sales: item.salesCount,
      };
    }) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Ingresos totales</CardDescription>
            {isLoading ? (
              <div className="h-9 bg-slate-200 rounded animate-pulse w-3/4"></div>
            ) : (
              <CardTitle className="text-3xl">
                {formatCurrency(totalEarningsInCents)}
              </CardTitle>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Estudiantes totales</CardDescription>
            {isLoading ? (
              <div className="h-9 bg-slate-200 rounded animate-pulse w-1/2"></div>
            ) : (
              <CardTitle className="text-3xl">
                {totalStudents.toLocaleString()}
              </CardTitle>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Cursos publicados</CardDescription>
            {isLoading ? (
              <div className="h-9 bg-slate-200 rounded animate-pulse w-1/4"></div>
            ) : (
              <CardTitle className="text-3xl">{publishedCourses}</CardTitle>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Ventas totales</CardDescription>
            {isLoading ? (
              <div className="h-9 bg-slate-200 rounded animate-pulse w-1/4"></div>
            ) : (
              <CardTitle className="text-3xl">{totalSales}</CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingresos Mensuales</CardTitle>
          <CardDescription>Tus ingresos de los últimos meses</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="h-[300px] bg-slate-200 rounded animate-pulse"></div>
          ) : monthlyRevenueData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No hay datos de ingresos disponibles
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
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
                  formatter={(
                    value: number | string | Array<number | string> | undefined,
                    name: string | number | undefined
                  ) => {
                    const safeName = String(name ?? '');

                    if (value === undefined) {
                      return ['-', safeName === 'sales' ? 'Ventas' : safeName];
                    }

                    if (Array.isArray(value)) {
                      return [
                        value,
                        safeName === 'sales' ? 'Ventas' : safeName,
                      ];
                    }

                    if (safeName === 'revenue' && typeof value === 'number') {
                      return [
                        '$' +
                          value.toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }),
                        'Ingresos',
                      ];
                    }

                    return [value, safeName === 'sales' ? 'Ventas' : safeName];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  name="Ingresos ($)"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  name="Ventas"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorAnalyticsPage;
