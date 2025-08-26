import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Dialog, DialogHeader, DialogTitle } from '../../components/ui/Dialog';
import { Search, Eye, UserCheck, UserX, Shield, GraduationCap, Mail, Calendar } from 'lucide-react';

type UserRole = "student" | "professor" | "admin";
type UserStatus = "active" | "suspended" | "pending";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
}

const sampleUsers: AdminUser[] = [
    { id: 1, name: "Juan Pérez", email: "juan.perez@email.com", role: "student", status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "María González", email: "maria.gonzalez@email.com", role: "professor", status: "active", joinDate: "2024-01-10" },
    { id: 3, name: "Admin User", email: "admin@email.com", role: "admin", status: "active", joinDate: "2024-01-01" },
    { id: 4, name: "Luis Fernández", email: "luis.fernandez@email.com", role: "student", status: "suspended", joinDate: "2024-01-03" },
    { id: 5, name: "Elena Ruiz", email: "elena.ruiz@email.com", role: "professor", status: "pending", joinDate: "2024-01-11" },
];

const RoleBadge = ({ role }: { role: UserRole }) => {
    const roles = {
        admin: { icon: Shield, text: 'Admin', className: 'bg-purple-100 text-purple-800 border-purple-200' },
        professor: { icon: GraduationCap, text: 'Profesor', className: 'bg-blue-100 text-blue-800 border-blue-200' },
        student: { icon: GraduationCap, text: 'Estudiante', className: 'bg-green-100 text-green-800 border-green-200' },
    };
    const { icon: Icon, text, className } = roles[role];
    return <Badge className={className}><Icon className="w-3 h-3 mr-1" />{text}</Badge>;
};

const StatusBadge = ({ status }: { status: UserStatus }) => {
    const statuses = {
        active: { icon: UserCheck, text: 'Activo', className: 'bg-green-100 text-green-800 border-green-200' },
        suspended: { icon: UserX, text: 'Suspendido', className: 'bg-red-100 text-red-800 border-red-200' },
        pending: { icon: UserX, text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    };
    const { icon: Icon, text, className } = statuses[status];
    return <Badge className={className}><Icon className="w-3 h-3 mr-1" />{text}</Badge>;
};

export default function UsersPage() {
  const [users, setUsers] = useState(sampleUsers);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleStatusChange = (userId: number, newStatus: "active" | "suspended") => {
    setUsers(prev => prev.map(user => (user.id === userId ? { ...user, status: newStatus } : user)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Gestión de Usuarios</h1>
        <p className="text-slate-600">Administra todos los usuarios de la plataforma.</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
              <CardDescription>Lista de todos los usuarios registrados</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Buscar por nombre o email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="all">Todos los Roles</option>
                <option value="admin">Administradores</option>
                <option value="professor">Profesor</option>
                <option value="student">Estudiante</option>
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-sm border rounded-lg bg-white/80 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                <option value="all">Todos los Estados</option>
                <option value="active">Activo</option>
                <option value="suspended">Suspendido</option>
                <option value="pending">Pendiente</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
            <div className="space-y-4">
                {filteredUsers.map(user => (
                  <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50/50">
                      <div className="flex-1 mb-4 sm:mb-0">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                              <h3 className="font-semibold text-slate-800">{user.name}</h3>
                              <RoleBadge role={user.role} />
                              <StatusBadge status={user.status} />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                              <span className="flex items-center gap-1"><Mail size={12} />{user.email}</span>
                              <span className="flex items-center gap-1"><Calendar size={12} />{user.joinDate}</span>
                          </div>
                      </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                        <Button variant="outline" onClick={() => setSelectedUser(user)}><Eye className="w-4 h-4 mr-1" />Ver</Button>
                        {user.role !== 'admin' && (
                            user.status === 'active' ? (
                                <Button variant="destructive" onClick={() => handleStatusChange(user.id, 'suspended')}><UserX className="w-4 h-4 mr-1" />Suspender</Button>
                            ) : user.status === 'suspended' ? (
                                <Button onClick={() => handleStatusChange(user.id, 'active')}><UserCheck className="w-4 h-4 mr-1" />Activar</Button>
                            ) : null
                        )}
                    </div>
                </div>
                ))}
            </div>
            {filteredUsers.length === 0 && (
                <div className="text-center text-slate-500 py-10">
                    <p className="font-semibold">No se encontraron usuarios</p>
                    <p className="text-sm">Intenta ajustar los filtros o el término de búsqueda.</p>
                </div>
            )}
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        {selectedUser && (
          <>
            <DialogHeader><DialogTitle>Detalles del Usuario</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-4 text-sm">
              <p><strong>Nombre:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Rol:</strong> <span className="capitalize">{selectedUser.role}</span></p>
              <p><strong>Estado:</strong> <span className="capitalize">{selectedUser.status}</span></p>
              <p><strong>Fecha de registro:</strong> {selectedUser.joinDate}</p>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}