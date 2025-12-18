import { Outlet, useLocation } from 'react-router-dom';

const ProfessorDashboard = () => {
  const location = useLocation();
  const isCreationPage = location.pathname.endsWith('/courses/new');
  const isEditionPage = location.pathname.endsWith('/edit');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="container mx-auto max-w-7xl pt-24 pb-8">
        {!isCreationPage && !isEditionPage && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  Panel de Profesor
                </h1>
                <p className="text-lg text-slate-600">
                  Gestiona tus cursos y estudiantes desde aquí
                </p>
              </div>
            </div>
          </div>
        )}

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
