import CardList from "../../components/ui/CardList.tsx";

const CourseListPage = () => {
  const allCourses = [
    {
      id: 1,
      title: "Desarrollo Web Full Stack con React y Node.js",
      description:
        "Aprende a crear aplicaciones web completas desde cero con las tecnologías más demandadas del mercado.",
      image: "public/img/noImage.jpg",
      price: 89.99,
      originalPrice: 129.99,
      views: 15420,
      rating: 4.8,
      students: 2340,
      duration: "40 horas",
      level: "Intermedio",
      category: "Programación",
      instructor: "Carlos Mendoza",
      lessons: 45,
      isNew: false,
      isBestseller: true,
    },
    {
      id: 2,
      title: "Diseño UX/UI con Figma",
      description:
        "Domina el diseño de interfaces y experiencia de usuario con herramientas profesionales.",
      image: "public/img/noImage.jpg",
      price: 69.99,
      originalPrice: 99.99,
      views: 12890,
      rating: 4.9,
      students: 1890,
      duration: "25 horas",
      level: "Principiante",
      category: "Diseño",
      instructor: "Ana García",
      lessons: 32,
      isNew: true,
      isBestseller: false,
    },
    {
      id: 3,
      title: "Marketing Digital y Redes Sociales",
      description:
        "Estrategias efectivas para hacer crecer tu negocio en el mundo digital.",
      image: "public/img/noImage.jpg",
      price: 59.99,
      originalPrice: 89.99,
      views: 9650,
      rating: 4.7,
      students: 3120,
      duration: "30 horas",
      level: "Principiante",
      category: "Marketing",
      instructor: "Roberto Silva",
      lessons: 28,
      isNew: false,
      isBestseller: true,
    },
    {
      id: 4,
      title: "Inteligencia Artificial con Python",
      description:
        "Introducción práctica al machine learning y deep learning con Python.",
      image: "public/img/noImage.jpg",
      price: 99.99,
      originalPrice: 149.99,
      views: 8340,
      rating: 4.6,
      students: 1560,
      duration: "50 horas",
      level: "Avanzado",
      category: "IA",
      instructor: "David Chen",
      lessons: 38,
      isNew: true,
      isBestseller: false,
    },
    {
      id: 5,
      title: "Fotografía Digital Profesional",
      description:
        "Técnicas avanzadas de fotografía y edición para crear imágenes impactantes.",
      image: "public/img/noImage.jpg",
      price: 79.99,
      originalPrice: 119.99,
      views: 7230,
      rating: 4.8,
      students: 980,
      duration: "35 horas",
      level: "Intermedio",
      category: "Arte",
      instructor: "Laura Martínez",
      lessons: 42,
      isNew: false,
      isBestseller: false,
    },
    {
      id: 6,
      title: "Finanzas Personales e Inversión",
      description:
        "Aprende a gestionar tu dinero y crear un portafolio de inversión exitoso.",
      image: "public/img/noImage.jpg",
      price: 49.99,
      originalPrice: 79.99,
      views: 6890,
      rating: 4.5,
      students: 2100,
      duration: "20 horas",
      level: "Principiante",
      category: "Finanzas",
      instructor: "Miguel Torres",
      lessons: 24,
      isNew: false,
      isBestseller: false,
    },
    {
      id: 7,
      title: "Desarrollo de Apps Móviles con React Native",
      description:
        "Crea aplicaciones móviles nativas para iOS y Android con una sola base de código.",
      image: "public/img/noImage.jpg",
      price: 94.99,
      originalPrice: 139.99,
      views: 5420,
      rating: 4.7,
      students: 1240,
      duration: "45 horas",
      level: "Intermedio",
      category: "Programación",
      instructor: "Sofia Ramírez",
      lessons: 52,
      isNew: true,
      isBestseller: false,
    },
    {
      id: 8,
      title: "Copywriting y Redacción Persuasiva",
      description:
        "Aprende a escribir textos que vendan y conecten con tu audiencia.",
      image: "public/img/noImage.jpg",
      price: 54.99,
      originalPrice: 84.99,
      views: 4890,
      rating: 4.6,
      students: 1680,
      duration: "18 horas",
      level: "Principiante",
      category: "Marketing",
      instructor: "Elena Vásquez",
      lessons: 22,
      isNew: false,
      isBestseller: false,
    },
  ];
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Todos los Cursos
        </h1>
        <p className="text-lg text-slate-600">
          Descubre más de {allCourses.length} cursos para impulsar tu carrera
        </p>
      </div>

      <div className="space-y-4">
        {allCourses.map((course) => (
          <CardList key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CourseListPage;
