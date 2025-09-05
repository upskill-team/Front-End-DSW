import { useState } from "react";
import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Upload, Users } from "lucide-react";
import Button from "../../components/ui/Button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card.tsx";
import Input from "../../components/ui/Input.tsx";
import Textarea from "../../components/ui/TextArea.tsx";
import Badge from "../../components/ui/Badge.tsx";
import Switch from "../../components/ui/Switch.tsx";
import Label from "../../components/ui/Label.tsx";
import Select from "../../components/ui/Select.tsx";
import { useCourseTypes } from "../../hooks/useCourseTypes.ts";
import { useCreateCourse } from "../../hooks/useCourses.ts";
import * as v from 'valibot';
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";

const CourseSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'El nombre es requerido.')),
  description: v.pipe(v.string(), v.minLength(1, 'La descripción es requerida.')),
  isFree: v.boolean(),
  price: v.optional(v.pipe(v.number(), v.minValue(0, "El precio no puede ser negativo"))),
  courseTypeId: v.pipe(v.string(), v.minLength(1, "Debes seleccionar una categoría.")),
  // image: v.optional(v.instance(FileList)), // La subida de archivos se maneja por separado
});

type CreateCoursePayload = v.InferInput<typeof CourseSchema>;

export default function ProfessorCourseCreation() {
  const navigate = useNavigate();

  const { mutate: createCourse, isPending, error: mutationError } = useCreateCourse();
  const { data: courseTypes = [], isLoading: isLoadingTypes } = useCourseTypes();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateCoursePayload>({
    resolver: valibotResolver(CourseSchema),
    defaultValues: {
      name: "",
      description: "",
      isFree: true,
      price: 0,
      courseTypeId: "",
    }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const watchedValues = watch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const onSubmit = (formData: CreateCoursePayload) => {
    const dataToSend = new FormData();

    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('courseTypeId', formData.courseTypeId);
    dataToSend.append('isFree', String(formData.isFree));
    dataToSend.append('price', String(formData.isFree ? 0 : formData.price || 0))
    const imageInput = document.getElementById('course-image') as HTMLInputElement;
    if (imageInput.files && imageInput.files[0]) {
      dataToSend.append('image', imageInput.files[0]);
    }

    createCourse(dataToSend, {
      onSuccess: (createdCourse) => {
        alert('¡Curso creado con éxito! Ahora puedes empezar a añadir contenido.');
        navigate(`/professor/dashboard/courses/${createdCourse.id}/edit`);
      },
      onError: (err: any) => {
        console.error("Error al crear el curso:", err);
        const message = err.response?.data?.message || err.message;
        alert(`Error al crear el curso: ${message}`);
      },
    });
  };

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-8">
        <Link to="/professor/dashboard/courses">
          <Button
            variant="ghost"
            className="mb-4 text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Cursos
          </Button>
        </Link>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Crear Nuevo Curso
        </h1>
        <p className="text-lg text-slate-600">
          Completa la información de tu curso y previsualiza cómo se verá
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Información del Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              id="course-name"
              label="Nombre del curso"
              placeholder="Ej: Desarrollo Web con React"
              {...register("name")}
              error={errors.name?.message}
            />

            <Textarea
              id="course-description"
              label="Descripción"
              placeholder="Describe brevemente de qué trata tu curso..."
              rows={4}
              {...register("description")}
              error={errors.description?.message}
            />

            {isLoadingTypes ? <p>Cargando categorías...</p> : (
              <Select id="typeCourse-select" label="Tipo de Curso" {...register("courseTypeId")}>
                <option value="" disabled>Selecciona una categoría</option>
                {courseTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            )}
            {errors.courseTypeId && <p className="text-sm text-red-500 mt-1">{errors.courseTypeId.message}</p>}

            <div>
              <Label>Imagen del curso</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50 hover:bg-slate-100">
                <input
                  type="file"
                  id="course-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="course-image" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600">
                    Haz clic para subir una imagen
                  </p>
                  <p className="text-xs text-slate-400">PNG, JPG hasta 5MB</p>
                </label>
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-free">Curso gratuito</Label>
                <Switch
                  id="is-free"
                  {...register("isFree")}
                />
              </div>

              {!watchedValues.isFree && (
                <Input
                  id="course-price"
                  label="Precio del curso (ARS)"
                  type="number"
                  placeholder="99"
                  {...register(("price"), { valueAsNumber: true})}
                  error={errors.price?.message}
                />
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Crear Curso y Continuar
            </Button>

            {mutationError && <p className="text-sm text-red-500 text-center mt-2">{mutationError.message}</p>}

          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Previsualización
          </h2>
          <Card className="group transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={imagePreview || "/img/noImage.jpg"}
                alt={watchedValues.name || "Vista previa del curso"}
                className="w-full h-48 object-cover transition-transform duration-300"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2">
                {watchedValues.name || "Nombre del curso"}
              </CardTitle>
              <p className="text-sm text-slate-600 min-h-[40px]">
                {watchedValues.description || "La descripción del curso aparecerá aquí..."}
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>0 estudiantes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>0 lecciones</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-lg font-bold text-slate-800">
                    {watchedValues.isFree ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      <span>${watchedValues.price || "0"}</span>
                    )}
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    {courseTypes.find(ct => ct.id === watchedValues.courseTypeId)?.name || 'Categoría'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Esta es una vista previa de cómo se verá tu
              curso en el dashboard. Una vez creado, podrás agregar contenido.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}