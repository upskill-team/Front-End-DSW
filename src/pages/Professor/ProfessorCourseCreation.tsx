import { useState } from "react";
import type React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import Button from "../../components/ui/Button/Button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card.tsx";
import Input from "../../components/ui/Input/Input.tsx";
import Textarea from "../../components/ui/TextArea/TextArea.tsx";
import CoursePreviewCard from "../../components/ui/CoursePreviewCard.tsx";
import Switch from "../../components/ui/Switch.tsx";
import Label from "../../components/ui/Label.tsx";
import Select from "../../components/ui/Select.tsx";
import { useCourseTypes } from "../../hooks/useCourseTypes.ts";
import { useCreateCourse } from "../../hooks/useCourses.ts";
import * as v from 'valibot';
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { AxiosError } from "axios";
import { useManagedInstitution } from "../../hooks/useInstitutionMutations.ts";

const CourseSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.minLength(1, 'El nombre es requerido.')),
    description: v.pipe(v.string(), v.minLength(1, 'La descripción es requerida.')),
    isFree: v.boolean(),
    price: v.optional(v.number("El precio debe ser un número")),
    courseTypeId: v.pipe(v.string(), v.minLength(1, "Debes seleccionar una categoría.")),
    useInstitution: v.optional(v.boolean()),
  }),
  v.forward(
    v.check(
      (input) => !input.isFree ? input.price !== undefined && input.price >= 0 : true,
      'Si el curso no es gratuito, debes especificar un precio válido (0 o más).'
    ),
    ['price']
  )
);

type CourseFormValues = v.InferInput<typeof CourseSchema>;

export default function ProfessorCourseCreation() {
  const navigate = useNavigate();

  const { data: courseTypesData, isLoading: isLoadingTypes } = useCourseTypes({});
  const courseTypes = courseTypesData?.courseTypes || [];
  

  const {
    data: managedInstitution = null,
    isLoading: isLoadingInstitution
  } = useManagedInstitution();

  const { mutate: createCourse, isPending, error: mutationError } = useCreateCourse();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CourseFormValues>({
    resolver: valibotResolver(CourseSchema),
    defaultValues: {
      name: "",
      description: "",
      isFree: true,
      price: 0,
      courseTypeId: "",
      useInstitution: false
    }
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);


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
  };

  const onSubmit = (formData: CourseFormValues) => {
    const dataToSend = new FormData();

    dataToSend.append('name', formData.name);
    dataToSend.append('description', formData.description);
    dataToSend.append('courseTypeId', formData.courseTypeId);
    dataToSend.append('isFree', String(formData.isFree));
    dataToSend.append('price', String(formData.isFree ? 0 : formData.price || 0)); 
    dataToSend.append('useInstitution',formData.useInstitution ? true: false);

    const imageInput = document.getElementById('course-image') as HTMLInputElement;
    if (imageInput.files && imageInput.files[0]) {
      dataToSend.append('image', imageInput.files[0]);
    }

    createCourse(dataToSend, {
      onSuccess: (createdCourse) => {
        navigate(`/professor/dashboard/courses/${createdCourse.id}/edit`);
      },
      onError: (err: AxiosError) => {
        console.error("Error al crear el curso:", err);
        const responseData = err.response?.data as { message?: string };
        const message = responseData?.message || err.message;
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

            {
              isLoadingInstitution ? <p>Cargando institución...</p> :(
                managedInstitution ? (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                  <Label htmlFor="is-free">¿Asociar a su intitucion?</Label>
                    <Switch
                    id="useInstitution"
                    {...register("useInstitution")}
                  />
                  </div>
                </div>) : null
              )
            }

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
          <CoursePreviewCard
            name={watchedValues.name}
            description={watchedValues.description}
            imageUrl={imagePreview || ""}
            isFree={watchedValues.isFree}
            price={watchedValues.price || 0}
            courseType={courseTypes.find(ct => ct.id === watchedValues.courseTypeId)}
            hideButton
          />
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