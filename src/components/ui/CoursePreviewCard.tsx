import * as React from 'react';
import { Users, BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './Card';
import Badge from './Badge/Badge';
import Button from './Button/Button';
import type { Course, CourseType } from '../../types/entities';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../lib/currency';

interface BasePreviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hideButton?: boolean;
  hideInstructor?: boolean;
  onViewMore?: () => void;
}

interface CourseObjectProps extends BasePreviewCardProps {
  course: Course;
  name?: never;
  description?: never;
  imageUrl?: never;
  isFree?: never;
  price?: never;
  courseType?: never;
}

interface IndividualPropsPreview extends BasePreviewCardProps {
  course?: never;
  name: string;
  description: string;
  imageUrl: string;
  isFree: boolean;
  price: number;
  courseType?: Pick<CourseType, 'id' | 'name'>;
}

type CoursePreviewCardProps = CourseObjectProps | IndividualPropsPreview;

const CoursePreviewCard = React.forwardRef<HTMLDivElement, CoursePreviewCardProps>(
  ({ course, name, description, imageUrl, isFree, price, courseType, hideButton = false, hideInstructor = false, className, ...props }, ref) => {
    
    const displayName = course?.name ?? name;
    const displayDescription = course?.description ?? description;
    const displayImage = course?.imageUrl ?? imageUrl;
    const displayIsFree = course?.isFree ?? isFree;
    
    // Manejar precio: si es un curso, usar priceInCents; si son props individuales, convertir price (pesos) a centavos
    const displayPriceInCents = course?.priceInCents ?? (price !== undefined ? Math.round(price * 100) : 0);
    const displayCourseType = course?.courseType ?? courseType;
    const displayAmountStudents = course?.studentsCount ?? course?.students?.length ?? 0;

    const instructorName = course?.professor?.user 
      ? `${course.professor.user.name} ${course.professor.user.surname}`
      : 'Instructor no disponible';
      
    return (
      <Link to={course ? `/courses/${course.id}` : '#'} className="block">
        <Card
          ref={ref}
          className={cn(
            "group transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg cursor-pointer h-full flex flex-col m-2",
            className
          )}
          {...props}
        >
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={displayImage || "/img/noImage.jpg"}
              alt={displayName || "Vista previa del curso"}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <CardHeader className="pb-2">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <Badge className="bg-blue-500 text-white border-blue-600">
                  {displayCourseType?.name || 'Sin Categoría'}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors h-14">
                {displayName || 'Nombre del curso'}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 min-h-[40px] line-clamp-2">
                {displayDescription || 'La descripción del curso aparecerá aquí...'}
              </CardDescription>
              {course && !hideInstructor && (
                <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                  <p>Por {instructorName}</p>
                  {course.professor?.institution && (
                    <p className="text-xs text-slate-400">
                      {course.professor.institution.name}
                    </p>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-2 mt-auto">
              <div className="space-y-3">
                {course && (
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{displayAmountStudents} { (displayAmountStudents ?? 0) === 1 ? 'Estudiante' : 'Estudiantes'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{course.units.length} {course.units.length === 1 ? 'Unidad' : 'Unidades'}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-lg font-bold text-slate-800">
                    {displayIsFree ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      <span>{formatCurrency(displayPriceInCents)}</span>
                    )}
                  </div>
                  {!hideButton && (
                    <Button
                      variant="primary"
                      size="sm"
                    >
                      Ver más
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }
);

CoursePreviewCard.displayName = 'CoursePreviewCard';

export default CoursePreviewCard;
