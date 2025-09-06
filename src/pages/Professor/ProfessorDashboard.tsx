import { Outlet, useLocation } from 'react-router-dom'

const ProfessorDashboard = () => {

  const location = useLocation()
  const isCreationPage = location.pathname.endsWith('/courses/new')
  const isEditionPage = location.pathname.endsWith('/courses/edit')

  return (
    <div className="container mx-auto max-w-7xl">
      {(!isCreationPage && !isEditionPage) && (
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
  )
}


export default ProfessorDashboard