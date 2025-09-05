import { useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Star, Upload, Users } from "lucide-react";
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
import { useForm } from "react-hook-form";

// Define the schema for course creation form validation
const CourseSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, 'El nombre es requerido.')),
  description: v.pipe(v.string(), v.minLength(1, 'La descripción es requerida.')),
  price: v.union([v.string(), v.number()]),
  isFree: v.boolean(),
  image: v.union([v.instance(File), v.null()]),
  courseTypeId: v.string()
})

type CreateCoursePayload = v.InferInput<typeof CourseSchema>;


export default function ProfessorCourseCreation() {
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    price: "",
    isFree: false,
    image: null as File | null,
    courseTypeId: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const { data: courseTypes = [] } = useCourseTypes();
  const createMutation = useCreateCourse()

  const {register} = useForm<CreateCoursePayload>();




  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

/*
  const onFormSubmit =(data:CreateCoursePayload)=>{
      const payload= {
        name: data.name,
        description: data.description,
        price: data.isFree ? 0 : Number(data.price),
        isFree: data.isFree,
        image: data.image,
        courserTypeId: courseData.courseTypeId
      }

      createMutation.mutate(data,{
        onSuccess:(newCourse)=>{
          alert("Curso creado exitosamente. Ahora serías redirigido al editor del curso.")
        },
        onError:()=>{
          alert("Error al crear el curso. Intenta nuevamente.")
        }
      })
  }
*/
  const handleCreateCourse = () => {
    if (courseData.name.trim() && courseData.description.trim()) {
      //Add the navigation to the edit course page
      alert(
        "Curso creado (simulación). Ahora serías redirigido al editor del curso."
      );
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
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

      {/**Html del formulario */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Información del Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Input
                id="course-name"
                label="Nombre del curso"
                value={courseData.name}
                onChange={(e) =>
                  setCourseData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ej: Desarrollo Web con React"
              />
            </div>

            <div className="space-y-2">
              <Textarea
                id="course-description"
                label="Descripción"
                value={courseData.description}
                onChange={(e) =>
                  setCourseData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe brevemente de qué trata tu curso..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Select id="typeCourse-select" label="Tipo de Curso">
                {courseTypes.map((type) => (
                  <option className="w-full py-3 px-4 border rounded-lg transition-all bg-slate-100/70 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white" key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is-free">Curso gratuito</Label>
                <Switch
                  id="is-free"
                  checked={courseData.isFree}
                  onChange={(e) =>
                    setCourseData((prev) => ({
                      ...prev,
                      isFree: e.target.checked,
                    }))
                  }
                />
              </div>

              {!courseData.isFree && (
                <div className="space-y-2">
                  <Input
                    id="course-price"
                    label="Precio del curso (ARS)"
                    type="number"
                    value={courseData.price}
                    onChange={(e) =>
                      setCourseData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="99"
                  />
                </div>
              )}
            </div>

            <Button
              onClick={handleCreateCourse}
              disabled={
                !courseData.name.trim() || !courseData.description.trim()
              }
              className="w-full bg-green-500 hover:bg-green-600 text-white"
            >
              Crear Curso y Continuar
            </Button>
          </CardContent>
        </Card>
        {/**Html de previsualizacion */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Previsualización
          </h2>
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={imagePreview || "/img/noImage.jpg"}
                alt={courseData.name || "Vista previa del curso"}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  En desarrollo
                </Badge>
              </div>
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-slate-700 border-0">
                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                  Nuevo
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-slate-800 line-clamp-2">
                {courseData.name || "Nombre del curso"}
              </CardTitle>
              <p className="text-sm text-slate-600">
                {courseData.description ||
                  "La descripción del curso aparecerá aquí..."}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
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
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-slate-800">
                    {courseData.isFree ? (
                      <span className="text-green-600">Gratis</span>
                    ) : (
                      <span>${courseData.price || "0"}</span>
                    )}
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Vista previa
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Esta es una vista previa de cómo se verá tu
              curso en el dashboard. Una vez creado, podrás agregar contenido,
              unidades y configurar todos los detalles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
