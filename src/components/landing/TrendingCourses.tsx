import { useTrendingCourses } from '../../hooks/useCourses.ts';
import CoursePreviewCard from '../ui/CoursePreviewCard.tsx';
import { useState, useEffect, useMemo } from 'react';

export function TrendingCourses() {
  const { data: courses, isLoading, isError, error } = useTrendingCourses();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const maxItems = 6;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(1);
      } else if (width < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const topCourses = useMemo(() => {
    if (!courses) return [];
    return courses.slice(0, maxItems);
  }, [courses]);

  const displayCourses = useMemo(() => {
    if (!topCourses.length) return [];
    return [...topCourses, ...topCourses];
  }, [topCourses]);

  const handleTransitionEnd = () => {
    if (currentIndex >= maxItems) {
      setIsTransitioning(true);
      setCurrentIndex(0);
      setTimeout(() => setIsTransitioning(false), 50);
    }
  };

  useEffect(() => {
    if (!topCourses.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [topCourses.length]);

  // Resetear índice cuando cambie itemsPerPage
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  return (
    <section className="py-10 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center lg:text-left mb-12">
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-slate-800 mb-4">Cursos en Tendencia</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">Nuestros cursos con mayor cantidad de alumnos inscritos</p>
        </div>
        
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg bg-white/80 p-4 animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">No se pudieron cargar los cursos: {error.message}</p>
          </div>
        )}

        {!isLoading && !isError && topCourses.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className={`flex ${isTransitioning ? '' : 'transition-transform duration-500 ease-in-out'}`}
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
                onTransitionEnd={handleTransitionEnd}
              >
                {displayCourses.map((course, index) => (
                  <div 
                    key={`${course.id}-${index}`} 
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <CoursePreviewCard course={course} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}