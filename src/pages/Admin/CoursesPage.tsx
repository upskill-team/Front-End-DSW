import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Search, Users, Star, Clock, Trash2, Play, Pause, Edit } from 'lucide-react';

const sampleCourses = [
    { id: 1, title: "Desarrollo Web Completo", instructor: "María González", category: "Programación", students: 2340, rating: 4.8, duration: "40 horas", status: "active" },
    { id: 2, title: "Diseño UX/UI Profesional", instructor: "Ana Martín", category: "Diseño", students: 1890, rating: 4.9, duration: "35 horas", status: "active" },
    { id: 3, title: "Python para Data Science", instructor: "Luis Fernández", category: "Programación", students: 1230, rating: 4.6, duration: "45 horas", status: "inactive" },
    { id: 4, title: "Fotografía Digital Básica", instructor: "Elena Ruiz", category: "Arte", students: 890, rating: 4.5, duration: "20 horas", status: "draft" },
    { id: 5, title: "Marketing Digital Avanzado", instructor: "Carlos Rodríguez", category: "Marketing", students: 1560, rating: 4.7, duration: "28 horas", status: "active" },
];

const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": 
        return <Badge className="bg-green-100 text-green-800 border-green-200"><Play className="w-3 h-3 mr-1" />Activo</Badge>;
      case "inactive": 
        return <Badge className="bg-red-100 text-red-800 border-red-200"><Pause className="w-3 h-3 mr-1" />Inactivo</Badge>;
      case "draft": 
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Edit className="w-3 h-3 mr-1" />Borrador</Badge>;
      default: 
        return null;
    }
};

export default function CoursesPage() {
  const [courses, setCourses] = useState(sampleCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => [...new Set(sampleCourses.map(c => c.category))], []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;

      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, searchTerm, statusFilter, categoryFilter]);

  const handleDelete = (courseId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso? Esta acción es irreversible.')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Gestión de Cursos</h1>
        <p className="text-slate-600">Administra todos los cursos de la plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Cursos ({filteredCourses.length})</CardTitle>
              <CardDescription>Lista de todos los cursos de la plataforma</CardDescription>
            </div>
            <div className = "flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Buscar por título..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="all">Todos los Estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="draft">Borrador</option>
              </select>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="all">Todas las Categorías</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Card key={course.id} className="flex flex-col justify-between">
                <div>
                  <div className="relative">
                    <img src="/img/noImage.jpg" alt={course.title} className="w-full h-40 object-cover rounded-t-xl" />
                    <div className="absolute top-3 right-3">{getStatusBadge(course.status)}</div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 h-14">{course.title}</CardTitle>
                    <CardDescription>Por: {course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                      <div className="flex items-center gap-1"><Users size={12} /><span>{course.students.toLocaleString()}</span></div>
                      <div className="flex items-center gap-1"><Star size={12} className="fill-yellow-400 text-yellow-400" /><span>{course.rating}</span></div>
                      <div className="flex items-center gap-1"><Clock size={12} /><span>{course.duration}</span></div>
                    </div>
                  </CardContent>
                </div>
                <div className="p-4 pt-0">
                  <Button variant="destructive" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
      
          {filteredCourses.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-10">
              <p className="font-semibold">No se encontraron cursos</p>
              <p className="text-sm">Intenta ajustar los filtros o el término de búsqueda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}