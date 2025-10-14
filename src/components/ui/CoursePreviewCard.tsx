import * as React from 'react';
import { Users, BookOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './Card';
import Badge from './Badge';
import Button from './Button';
import type { Course, CourseType } from '../../types/entities';
import { cn } from '../../lib/utils';

interface BasePreviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hideButton?: boolean;
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

export type CoursePreviewCardProps = CourseObjectProps | IndividualPropsPreview;

const CoursePreviewCard = React.forwardRef<
  HTMLDivElement,
  CoursePreviewCardProps
>(
  (
    {
      course,
      name,
      description,
      imageUrl,
      isFree,
      price,
      courseType,
      hideButton = false,
      onViewMore,
      className,
      ...props
    },
    ref
  ) => {
    // If we have a course object, use its properties
    const displayName = course?.name ?? name;
    const displayDescription = course?.description ?? description;
    const displayImage = course?.imageUrl ?? imageUrl;
    const displayIsFree = course?.isFree ?? isFree;
    const displayPrice = course?.price ?? price;
    const displayCourseType = course?.courseType ?? courseType;

    // Helper to get instructor name safely (only for course objects)
    const instructorName = course?.professor?.user
      ? `${course.professor.user.name} ${course.professor.user.surname}`
      : 'Instructor no disponible';

    // Helper to calculate total lessons (only for course objects)
    const totalLessons =
      course?.units.reduce(
        (acc, unit) =>
          acc + (unit.materials?.length || 0) + (unit.questions?.length || 0),
        0
      ) ?? 0;

    return (
      <Card
        ref={ref}
        className={cn(
          'group transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg cursor-pointer m-2',
          className
        )}
        {...props}
      >
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={displayImage || '/img/noImage.jpg'}
            alt={displayName || 'Vista previa del curso'}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <Badge className="bg-blue-500 text-white border-blue-600">
              {displayCourseType?.name || 'Sin Categoría'}
            </Badge>
          </div>
          <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {displayName || 'Nombre del curso'}
          </CardTitle>
          <CardDescription className="text-sm text-slate-600 min-h-[40px] line-clamp-2">
            {displayDescription || 'La descripción del curso aparecerá aquí...'}
          </CardDescription>
          {course && (
            <p className="text-sm text-slate-500 mt-1">Por {instructorName}</p>
          )}
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            {course && (
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{course.students?.length} {course.students?.length === 1 ? 'Estudiante' : 'Estudiantes'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-3 h-3" />
                  <span>
                    {totalLessons} {totalLessons === 1 ? 'Lección' : 'Lecciones'}
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="text-lg font-bold text-slate-800">
                {displayIsFree ? (
                  <span className="text-green-600">Gratis</span>
                ) : (
                  <span>${displayPrice}</span>
                )}
              </div>
              {!hideButton && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMore?.();
                  }}
                >
                  Ver más
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

CoursePreviewCard.displayName = 'CoursePreviewCard';

export default CoursePreviewCard;
