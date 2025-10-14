import * as React from 'react';
import { Users, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import Button from './Button';
import Badge from './Badge';
import { Card, CardContent, CardTitle, CardDescription } from './Card';
import { Link } from 'react-router-dom';
import type { Course } from '../../types/entities';

export interface CourseCardListProps extends React.HTMLAttributes<HTMLDivElement> {
  course: Course;
}

const CardList = React.forwardRef<HTMLDivElement, CourseCardListProps>(
  ({ course, className, ...props }, ref) => {

    const instructorName = course.professor?.user 
      ? `${course.professor.user.name} ${course.professor.user.surname}`
      : 'Instructor no disponible';

    return (
      <Card
        ref={ref}
        className={cn(
          'group hover:shadow-lg transition-all duration-300 border-0 cursor-pointer bg-white/80 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
              <Link to={`/courses/${course.id}`}>
                <img
                  src={course.imageUrl || '/img/noImage.jpg'}
                  alt={course.name}
                  className="w-full h-40 md:w-48 md:h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {course.isFree && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Gratis
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row items-start justify-between">
                <div className="flex-1 mb-4 lg:mb-0">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <Badge className="bg-blue-500 text-white border-blue-600">
                      {course.courseType?.name || 'Sin Categoría'}
                    </Badge>
                  </div>
                  <CardTitle className="mb-2 group-hover:text-blue-600 transition-colors text-lg md:text-xl">
                    <Link to={`/courses/${course.id}`}>
                      {course.name}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mb-2 line-clamp-2 text-sm">
                    {course.description}
                  </CardDescription>
                  <p className="text-sm text-slate-500 mb-3">
                    Por {instructorName}
                  </p>

                  <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{course.students?.length || 0} estudiantes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{course.units.length} {course.units.length === 1 ? 'Unidad' : 'Unidades'}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left lg:text-right w-full lg:w-auto lg:ml-4 flex-shrink-0">
                  <div className="mb-3">
                    <span className="text-lg font-bold text-slate-800">
                      {course.isFree ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        <span>${course.price}</span>
                      )}
                    </span>
                  </div>
                  <Link to={`/courses/${course.id}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full lg:w-auto"
                    >
                      Ver más
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

CardList.displayName = 'CardList';

export default CardList;