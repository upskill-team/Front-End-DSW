import { Clock, Star, Users } from 'lucide-react';
import React from 'react';
import Button from './Button.tsx';

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  views: number;
  rating: number;
  students: number;
  duration: string;
  level: string;
  category: string;
  instructor: string;
  lessons: number;
  isNew: boolean;
  isBestseller: boolean;
}

interface CourseCardListPureProps {
  course: Course;
}

export default function CardList({ course }: CourseCardListPureProps) {
  return (
    <div className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer rounded-lg">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={course.image || '/placeholder.svg'}
              alt={course.title}
              className="w-full h-40 md:w-48 md:h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {course.isNew && (
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Nuevo
                </span>
              )}
              {course.isBestseller && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Bestseller
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row items-start justify-between">
              <div className="flex-1 mb-4 lg:mb-0">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {course.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-600 mb-2 line-clamp-2 text-sm">
                  {course.description}
                </p>
                <p className="text-sm text-slate-500 mb-3">
                  Por {course.instructor}
                </p>

                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="hidden sm:inline">
                      ({course.students} estudiantes)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.lessons} lecciones</span>
                  </div>
                </div>
              </div>

              <div className="text-left lg:text-right w-full lg:w-auto lg:ml-4 flex-shrink-0">
                <div className="flex items-center lg:justify-end space-x-2 mb-3">
                  <span className="text-2xl font-bold text-slate-800">
                    ${course.price}
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-lg text-slate-500 line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full lg:w-auto"
                >
                  Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
