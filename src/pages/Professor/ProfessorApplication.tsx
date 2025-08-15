import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import  Button  from "../../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card";
import  Input  from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Textarea } from "../../components/ui/TextArea";
import { BookOpen, ArrowLeft, GraduationCap, BookOpenCheck, FileText, Upload } from "lucide-react";
import { appealService } from "../../api/services/appeal.service";

export const ProfessorApplication = () => {
  const [formData, setFormData] = useState({
    expertise: "",
    experienceMotivation: "",
    document: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      document: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData();
    data.append("expertise", formData.expertise);
    data.append("experienceMotivation", formData.experienceMotivation);
    if (formData.document) {
      data.append("document", formData.document);
    }

    try {
      await appealService.createAppeal(data);

      alert("¡Solicitud enviada con éxito! Te contactaremos pronto.");

      setFormData({
          expertise: "",
          experienceMotivation: "",
          document: null,
      });
    }catch (err) {
      console.error("Error al enviar la solicitud:", err)
      setError("Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link to="/" className="flex items-center space-x-2 text-slate-700 hover:text-green-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EduCursos</span>
          </div>
        </Link>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="relative">
            <img
              src="/professor_appeal_image.svg"
              alt="Imagen de profesor enseñando"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-green-200 to-blue-200 rounded-2xl -z-10"></div>
          </div>
        </div>

        <Card className="w-full bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-2">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">Únete como Profesor</CardTitle>
            <CardDescription className="text-slate-600">
              Comparte tu conocimiento y ayuda a otros a aprender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <div className="relative">
                    <Input
                        id="expertise"
                        name="expertise"
                        label="Área de especialización"
                        icon={<BookOpenCheck className="h-4 w-4" />}
                        type="text"
                        placeholder="Ej: Programación, Diseño, Marketing..."
                        value={formData.expertise}
                        onChange={handleInputChange}
                        required
                    />
                </div>
              </div>

            <div className="space-y-2">
                <Label htmlFor="experienceMotivation" className="text-slate-700">
                    Experiencia y motivación
                </Label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Textarea
                        id="experienceMotivation"
                        name="experienceMotivation"
                        placeholder="Cuéntanos sobre tu experiencia profesional..."
                        value={formData.experienceMotivation}
                        onChange={handleInputChange}
                        className="pl-10 pt-10 min-h-[120px] border-slate-200 focus:border-green-400 focus:ring-green-400 resize-none"
                        required
                    />
                </div>
            </div>

              <div className="space-y-2">
                <Label htmlFor="document" className="text-slate-700">
                  Documentos (opcional)
                </Label>
                <div className="relative">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="document"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-green-300 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-500">
                          <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-slate-400">PDF, DOC, DOCX (MAX. 10MB)</p>
                        {formData.document && (
                          <p className="text-xs text-green-600 mt-2 font-medium">
                            Archivo seleccionado: {formData.document.name}
                          </p>
                        )}
                      </div>
                      <input
                        id="document"
                        name="document"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Puedes subir tu CV, certificados o cualquier documento que consideres relevante
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar solicitud"}
              </Button>

              {error && (
                <div className="text-center text-sm text-red-600 mt-4">
                  <p>{error}</p>
                </div>
              )}

              <div className="text-center text-sm text-slate-600 mt-4">
                <p>Revisaremos tu solicitud y te contactaremos en un plazo de 2-3 días hábiles.</p>
              </div>

              <div className="text-center text-sm text-slate-600">
                ¿Ya tienes una cuenta?{" "}

                <Link to="/login" className="text-green-600 hover:text-green-700 hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};