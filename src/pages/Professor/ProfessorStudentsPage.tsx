// src/pages/Professor/ProfessorStudentsPage.tsx

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users } from 'lucide-react';

const recentStudents = [
    { name: "María García", course: "Desarrollo Web Completo", joined: "Hace 2 días" },
    { name: "Juan Pérez", course: "JavaScript Avanzado", joined: "Hace 1 semana" },
    { name: "Ana López", course: "React Hooks Masterclass", joined: "Hace 3 días" },
    { name: "Carlos Silva", course: "Desarrollo Web Completo", joined: "Hace 5 días" },
];

const ProfessorStudentsPage = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>Estudiantes Recientes</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentStudents.map((student, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-600">
                                        {student.name.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-800">{student.name}</p>
                                    <p className="text-sm text-slate-600">{student.course}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500">{student.joined}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfessorStudentsPage;