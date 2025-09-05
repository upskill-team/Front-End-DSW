import { ArrowLeft, Badge, BookOpen, Users } from "lucide-react";
import Button from "../../components/ui/Button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card.tsx";
import { Label } from "recharts";
import Input from "../../components/ui/Input.tsx";
import Textarea from "../../components/ui/TextArea.tsx";

export default function ProfessorCourseCreation() {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8">
        {/*Debe ser un Link a la pagina del dashboard del profesor*/}
        <Button
          variant="ghost"
          className="mb-4 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Dashboard
        </Button>
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
          Crear Nuevo Curso
        </h1>
        <p className="text-lg text-slate-600">
          Completa la información de tu curso y previsualiza cómo se verá
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario de creación */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-800">
              Información del Curso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="course-name">Nombre del curso</Label>
              <Input
                id="course-name"
                value={courseData.name}
                onChange={(e) =>
                  setCourseData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ej: Desarrollo Web con React"
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-description">Descripción</Label>
              <Textarea
                id="course-description"
                value={courseData.description}
                onChange={(e) =>
                  setCourseData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe brevemente de qué trata tu curso..."
                rows={4}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-image">Imagen del curso</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-white">
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
                  onCheckedChange={(checked) =>
                    setCourseData((prev) => ({ ...prev, isFree: checked }))
                  }
                />
              </div>

              {!courseData.isFree && (
                <div className="space-y-2">
                  <Label htmlFor="course-price">Precio del curso (USD)</Label>
                  <Input
                    id="course-price"
                    type="number"
                    value={courseData.price}
                    onChange={(e) =>
                      setCourseData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="99"
                    className="bg-white"
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

        {/* Previsualización */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Previsualización
          </h2>
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={
                  imagePreview ||
                  "/placeholder.svg?height=120&width=200&query=course preview"
                }
                alt={courseData.name || "Vista previa del curso"}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-100 text-green-700 border-green-200">
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
                  "Descripción del curso aparecerá aquí..."}
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
