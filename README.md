# UpSkill Frontend

## Table of Contents

- [English](#english)
- [Español](#español)
- [Documentation](#documentation)
- [Project Structure](#project-structure)

---

<a name="english"></a>

---

## English

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.9.0 or higher)
- Backend API running on http://localhost:3000

### Environment Setup

1. Clone the repository:

```bash
git clone https://github.com/upskill-team/Front-End-DSW.git
cd Front-End-DSW
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a .env file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Running the Development Server

**Development mode:**

```bash
pnpm dev
```

The application will be available at http://localhost:5173

**Build for production:**

```bash
pnpm build
pnpm preview
```

### Running Tests

**Unit and integration tests:**

```bash
pnpm test
```

**E2E tests with Cypress:**

```bash
pnpm cypress:open
```

**Test coverage:**

```bash
pnpm test:coverage
```

### Available Scripts

- pnpm dev - Start development server with hot reload
- pnpm build - Build application for production
- pnpm preview - Preview production build locally
- pnpm lint - Run ESLint
- pnpm test - Run unit and integration tests
- pnpm test:coverage - Run tests with coverage report
- pnpm cypress:open - Open Cypress test runner
- pnpm cypress:run - Run Cypress tests in headless mode

---

<a name="español"></a>

## Español

### Requisitos Previos

- Node.js (v18 o superior)
- pnpm (v10.9.0 o superior)
- Backend API ejecutándose en http://localhost:3000

### Configuración del Entorno

1. Clonar el repositorio:

```bash
git clone https://github.com/upskill-team/Front-End-DSW.git
cd Front-End-DSW
```

2. Instalar dependencias:

```bash
pnpm install
```

3. Crear un archivo .env en el directorio raíz con las siguientes variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Ejecutar el Servidor de Desarrollo

**Modo desarrollo:**

```bash
pnpm dev
```

La aplicación estará disponible en http://localhost:5173

**Compilación para producción:**

```bash
pnpm build
pnpm preview
```

### Ejecutar las Pruebas

**Pruebas unitarias e integración:**

```bash
pnpm test
```

**Pruebas E2E con Cypress:**

```bash
pnpm cypress:open
```

**Cobertura de pruebas:**

```bash
pnpm test:coverage
```

### Scripts Disponibles

- pnpm dev - Iniciar servidor de desarrollo con recarga automática
- pnpm build - Compilar aplicación para producción
- pnpm preview - Vista previa de la compilación de producción
- pnpm lint - Ejecutar ESLint
- pnpm test - Ejecutar pruebas unitarias e integración
- pnpm test:coverage - Ejecutar pruebas con reporte de cobertura
- pnpm cypress:open - Abrir ejecutor de pruebas Cypress
- pnpm cypress:run - Ejecutar pruebas Cypress en modo headless


---

## Documentation

If you want to see the updated documentation you can go to https://upskill-team.github.io/Front-End-DSW/?path=/docs/configure-your-project--docs

Si deseas ver la documentación actualizada puedes ir a https://upskill-team.github.io/Front-End-DSW/?path=/docs/configure-your-project--docs

---

## Project Structure

```
Front-End-DSW/
 src/
    components/         # Componentes React reutilizables
       common/         # Componentes compartidos
       landing/        # Componentes de página de inicio
       layouts/        # Componentes de estructura
       professor/      # Componentes para profesores
       student/        # Componentes para estudiantes
       admin/          # Componentes para administradores
       ui/             # Componentes UI base
    pages/              # Páginas de la aplicación
    contexts/           # Contextos de React
    hooks/              # Hooks personalizados
    api/                # Servicios y cliente API
       services/       # Servicios específicos de cada dominio
    lib/                # Utilidades y funciones auxiliares
    types/              # Definiciones de tipos TypeScript
    router/             # Configuración de rutas
    App.tsx             # Componente principal
    main.tsx            # Punto de entrada
 cypress/                # Pruebas E2E
 public/                 # Archivos estáticos
 index.html              # HTML principal
 vite.config.ts          # Configuración de Vite
 tsconfig.json           # Configuración de TypeScript
 tailwind.config.js      # Configuración de Tailwind CSS
 cypress.config.ts       # Configuración de Cypress
```
