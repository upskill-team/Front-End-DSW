// src/pages/Professor/ProfessorCoursesPage.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { BookOpen, Users, DollarSign, Edit, Star, Plus } from 'lucide-react';

const teacherCourses = [
    { id: 1, title: 'Desarrollo Web Completo', description: 'HTML, CSS, JavaScript y React', image: '/img/noImage.jpg', students: 342, rating: 4.8, earnings: 6840, status: 'Publicado', progress: 100, lessons: 45 },
    { id: 2, title: 'JavaScript Avanzado', description: 'ES6+, Async/Await, APIs', image: '/img/noImage.jpg', students: 198, rating: 4.9, earnings: 3960, status: 'Publicado', progress: 100, lessons: 32 },
    { id: 3, title: 'React Hooks Masterclass', description: 'Hooks avanzados y patrones', image: '/img/noImage.jpg', students: 156, rating: 4.7, earnings: 3120, status: 'En desarrollo', progress: 65, lessons: 28 },
];

const ProfessorCoursesPage = () => {
    return (
        <div className="space-y-6">
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Mis Cursos ({teacherCourses.length})</h2>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-green-500 hover:bg-green-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Curso
                        </Button>
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teacherCourses.map((course) => (
                    <Card key={course.id} className="group hover:shadow-lg transition-all duration-300">
                        <div className="relative overflow-hidden rounded-t-lg">
                            <img src={course.image} alt={course.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute top-3 right-3">
                                <Badge className={`${course.status === 'Publicado' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                    {course.status}
                                </Badge>
                            </div>
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-white/90 text-slate-700 border-0">
                                    <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                                    {course.rating}
                                </Badge>
                            </div>
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 h-14">{course.title}</CardTitle>
                            <CardDescription className="text-sm text-slate-600">{course.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                                    <div className="flex items-center space-x-1"><Users className="w-3 h-3" /><span>{course.students} estudiantes</span></div>
                                    <div className="flex items-center space-x-1"><BookOpen className="w-3 h-3" /><span>{course.lessons} lecciones</span></div>
                                    <div className="flex items-center space-x-1 col-span-2"><DollarSign className="w-3 h-3" /><span>${course.earnings}</span></div>
                                </div>
                                {course.status === 'En desarrollo'}
                                <div className="flex justify-end pt-2">
                                    <Button variant="outline" className="h-8 w-8 p-0"><Edit className="w-3 h-3" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProfessorCoursesPage;