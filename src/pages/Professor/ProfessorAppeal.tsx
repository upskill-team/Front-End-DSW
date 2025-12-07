import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import * as v from 'valibot'
import Button from "../../components/ui/Button/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import Textarea from "../../components/ui/TextArea"
import Label from "../../components/ui/Label"
import { BookOpen, ArrowLeft, GraduationCap, Upload } from "lucide-react"
import { useCreateAppeal } from '../../hooks/useCreateAppeal'
import { useMyAppeals } from "../../hooks/useAppeals"
import { isAxiosError } from 'axios'
import { toast } from 'react-hot-toast'
import { useQueryClient } from "@tanstack/react-query"

const AppealSchema = v.object({
  expertise: v.pipe(
  v.string(),
  v.minLength(1, 'El área de especialización es requerida.')
  ),
  experienceMotivation: v.pipe(
  v.string(),
  v.minLength(20, 'Por favor, detalla tu experiencia con al menos 20 caracteres.'),
  ),
})

type AppealFormData = v.InferInput<typeof AppealSchema>

export default function ProfessorApplication() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: appeals, isLoading: isLoadingAppeals } = useMyAppeals();

  useEffect(() => {
    if (!isLoadingAppeals && appeals) {
      const hasPending = appeals.some(a => a.state === 'pending');
      if (hasPending) {
        navigate('/professor/applications');
      }
    }
  }, [appeals, isLoadingAppeals, navigate]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AppealFormData>({
    resolver: valibotResolver(AppealSchema),
  })

  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const { mutate: createAppeal, isPending, error: apiError } = useCreateAppeal()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setDocumentFile(file)
  }

  const onSubmit = (data: AppealFormData) => {
    const formData = new FormData()
    formData.append("expertise", data.expertise)
    formData.append("experienceMotivation", data.experienceMotivation)
    if (documentFile) {
      formData.append("document", documentFile)
    }

    createAppeal(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['appeals', 'me'] });
        reset()
        setDocumentFile(null)
        toast.success("Solicitud enviada correctamente")
        navigate('/professor/applications');
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          
          if (error.response?.status === 500) {
            toast.error("Ya tienes una solicitud pendiente de revisión.");
            return;
          }
        }

        toast.error("No se pudo enviar la solicitud. Intenta nuevamente.");
      }
    })
  }

  const getApiErrorMessage = () => {
    if (!apiError) return null

    if (isAxiosError(apiError)) {
      const serverMessage = apiError.response?.data?.errors

      if (serverMessage === 'User already has an active appeal.') {
        return 'Ya tienes una solicitud activa. Por favor, espera a que sea revisada.'
      }
      return serverMessage || 'Ocurrió un error al conectar con el servidor.'
    }
    return 'Ocurrió un error inesperado.'
  }

  if (isLoadingAppeals) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
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
            <span className="text-xl font-bold">UpSkill</span>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                    <Input
                      id="expertise"
                      label="Área de especialización"
                      type="text"
                      placeholder="Ej: Programación, Diseño..."
                      {...register('expertise')}
                      error={errors.expertise?.message}
                    />
                </div>
              </div>

            <div className="space-y-2">
                <div className="relative">
                    <Textarea
                      id="experienceMotivation"
                      label="Experiencia y motivación"
                      placeholder="Cuéntanos sobre tu experiencia profesional..."
                      {...register('experienceMotivation')}
                      error={errors.experienceMotivation?.message}
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
                        {documentFile && (
                          <p className="text-xs text-green-600 mt-2 font-medium">
                            Archivo seleccionado: {documentFile.name}
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

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5" disabled={isPending}>
                  {isPending ? "Enviando..." : "Enviar solicitud"}
                </Button>

              {apiError && (
                <div className="text-center text-sm text-red-600 mt-4">
                  <p>{getApiErrorMessage()}</p>
                </div>
              )}

              <div className="text-center text-sm text-slate-600 mt-4">
                <p>Revisaremos tu solicitud y te contactaremos.</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}