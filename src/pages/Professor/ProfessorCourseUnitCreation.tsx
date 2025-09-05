import React, { useState } from 'react'
import Button from '../../components/ui/Button.tsx'
import { ArrowLeft, BookOpen, Check, Edit, Eye, FileText, GripVertical, Plus, Settings, Target, Trash2, Upload } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card.tsx'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/Dialog.tsx'
import Textarea from '../../components/ui/TextArea.tsx'
import Input from '../../components/ui/Input.tsx'
import Select from '../../components/ui/Select.tsx'

export default function ProfessorCourseUnitCreation() {
  const router = useRouter()
  const params = useParams()
  const courseId = params.courseId as string

  // Course configuration state
  const [courseConfig, setCourseConfig] = useState({
    name: "Nuevo Curso",
    description: "",
    status: "en-desarrollo",
    price: 0,
    isPaid: false,
  })

  // Units state
  const [units, setUnits] = useState([
    {
      id: 1,
      name: "Unidad 1",
      description: "Introducción al curso",
      content: "",
      activities: [],
      materials: [],
    },
  ])

  const [draggedUnit, setDraggedUnit] = useState(null)

  // Modal states
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false)
  const [isGlobalActivityModalOpen, setIsGlobalActivityModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState(1)

  // Form states
  const [newUnitName, setNewUnitName] = useState("")
  const [newUnitDescription, setNewUnitDescription] = useState("")

  const [newActivity, setNewActivity] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  const [globalActivity, setGlobalActivity] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  const teacher = {
    name: "Dr. Carlos Mendoza",
    email: "carlos@educursos.com",
    avatar: "/placeholder.svg?height=40&width=40",
    cartItems: 0,
  }

  const handleDragStart = (e, unit) => {
    setDraggedUnit(unit)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, targetUnit) => {
    e.preventDefault()
    if (draggedUnit && draggedUnit.id !== targetUnit.id) {
      const draggedIndex = units.findIndex((u) => u.id === draggedUnit.id)
      const targetIndex = units.findIndex((u) => u.id === targetUnit.id)

      const newUnits = [...units]
      const [removed] = newUnits.splice(draggedIndex, 1)
      newUnits.splice(targetIndex, 0, removed)

      setUnits(newUnits)
    }
    setDraggedUnit(null)
  }

  const handleAddUnit = () => {
    if (newUnitName.trim()) {
      const newUnit = {
        id: units.length + 1,
        name: newUnitName,
        description: newUnitDescription || "Nueva unidad",
        content: "",
        activities: [],
        materials: [],
      }
      setUnits([...units, newUnit])
      setNewUnitName("")
      setNewUnitDescription("")
      setIsUnitModalOpen(false)
    }
  }

  const handleEditUnit = (unit) => {
    setEditingUnit(unit)
    setNewUnitName(unit.name)
    setNewUnitDescription(unit.description)
    setIsUnitModalOpen(true)
  }

  const handleUpdateUnit = () => {
    if (editingUnit && newUnitName.trim()) {
      setUnits(
        units.map((unit) =>
          unit.id === editingUnit.id ? { ...unit, name: newUnitName, description: newUnitDescription } : unit,
        ),
      )
      setEditingUnit(null)
      setNewUnitName("")
      setNewUnitDescription("")
      setIsUnitModalOpen(false)
    }
  }

  const handleAddActivity = () => {
    if (newActivity.question.trim() && newActivity.options.every((opt) => opt.trim())) {
      const activity = {
        id: Date.now(),
        type: "multiple-choice",
        question: newActivity.question,
        options: newActivity.options,
        correctAnswer: newActivity.correctAnswer,
        createdAt: new Date().toISOString(),
      }

      setUnits(
        units.map((unit) =>
          unit.id === selectedUnit ? { ...unit, activities: [...unit.activities, activity] } : unit,
        ),
      )

      setNewActivity({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      })
      setIsActivityModalOpen(false)
    }
  }

  const handleAddGlobalActivity = () => {
    if (globalActivity.question.trim() && globalActivity.options.every((opt) => opt.trim())) {
      setIsGlobalActivityModalOpen(false)
    }
  }

  const handleFileUpload = (unitId, type, event) => {
    const file = event.target.files[0]
    if (file) {
      const fileObj = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      }

      setUnits(
        units.map((unit) =>
          unit.id === unitId
            ? {
                ...unit,
                [type]: [...unit[type], fileObj],
              }
            : unit,
        ),
      )
    }
    setIsMaterialModalOpen(false)
  }

  const handleContentChange = (content) => {
    setUnits(units.map((unit) => (unit.id === selectedUnit ? { ...unit, content } : unit)))
  }




  return (
 
        <div className="container mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">{courseConfig.name}</h1>
                  <p className="text-slate-600">Editor de curso</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Vista previa
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Units */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Contenido del Curso</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <Dialog open={isGlobalActivityModalOpen} onOpenChange={setIsGlobalActivityModalOpen}>
                      <DialogTrigger asChild>
                        <div className="p-3 rounded-lg border-2 border-dashed border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-green-600" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-green-800">Actividad Globalizadora</h4>
                              <p className="text-xs text-green-600 mt-1">
                                {globalActivity.question ? "Configurada" : "Clic para configurar"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Actividad Globalizadora - Opción Múltiple</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Textarea
                              id="global-question"
                              label='Pregunta'
                              value={globalActivity.question}
                              onChange={(e) => setGlobalActivity({ ...globalActivity, question: e.target.value })}
                              placeholder="Escribe la pregunta de la actividad globalizadora..."
                              rows={3}
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label>Opciones de respuesta</Label>
                            <RadioGroup
                              value={globalActivity.correctAnswer.toString()}
                              onValueChange={(value) =>
                                setGlobalActivity({ ...globalActivity, correctAnswer: Number.parseInt(value) })
                              }
                            >
                              {globalActivity.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <RadioGroupItem value={index.toString()} id={`global-option-${index}`} />
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...globalActivity.options]
                                      newOptions[index] = e.target.value
                                      setGlobalActivity({ ...globalActivity, options: newOptions })
                                    }}
                                    placeholder={`Opción ${index + 1}`}
                                    className="flex-1"
                                  />
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsGlobalActivityModalOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddGlobalActivity}>Guardar Actividad</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Separator className="mb-4" />

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-800">Unidades</h3>
                    <Dialog open={isUnitModalOpen} onOpenChange={setIsUnitModalOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingUnit(null)}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingUnit ? "Editar Unidad" : "Nueva Unidad"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Input
                              id="unit-name"
                              label='Nombre de la unidad'
                              value={newUnitName}
                              onChange={(e) => setNewUnitName(e.target.value)}
                              placeholder="Ej: Introducción a React"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Textarea
                              id="unit-description"
                              label='Descripción'
                              value={newUnitDescription}
                              onChange={(e) => setNewUnitDescription(e.target.value)}
                              placeholder="Breve descripción de la unidad..."
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsUnitModalOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={editingUnit ? handleUpdateUnit : handleAddUnit}>
                            {editingUnit ? "Actualizar" : "Crear"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {units.map((unit) => (
                      <div
                        key={unit.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, unit)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, unit)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedUnit === unit.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                        } ${draggedUnit?.id === unit.id ? "opacity-50" : ""}`}
                        onClick={() => setSelectedUnit(unit.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 flex-1">
                            <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-slate-800">{unit.name}</h4>
                              <p className="text-xs text-slate-600 mt-1">{unit.description}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditUnit(unit)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  {/* Course Configuration Button */}
                  <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configuración del curso
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Configuración del Curso</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Input
                            id="course-name-config"
                            label='Nombre del curso'
                            value={courseConfig.name}
                            onChange={(e) => setCourseConfig({ ...courseConfig, name: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Select
                            id="course-status"
                            label='Estado del curso'
                            value={courseConfig.status}
                            onValueChange={(value) => setCourseConfig({ ...courseConfig, status: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en-desarrollo">En desarrollo</SelectItem>
                              <SelectItem value="revision">En revisión</SelectItem>
                              <SelectItem value="publicado">Publicado</SelectItem>
                              <SelectItem value="pausado">Pausado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="course-price">Precio del curso</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="course-price"
                              type="number"
                              value={courseConfig.price}
                              onChange={(e) => setCourseConfig({ ...courseConfig, price: Number(e.target.value) })}
                              placeholder="0"
                            />
                            <span className="text-sm text-slate-600">USD</span>
                          </div>
                          {courseConfig.price === 0 && <p className="text-xs text-slate-500">El curso será gratuito</p>}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={() => setIsConfigModalOpen(false)}>Guardar cambios</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Main Content - Unit Editor */}
            <div className="lg:col-span-3">
              {selectedUnit && (
                <div className="space-y-6">
                  {/* Unit Content Editor */}
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <span>{units.find((u) => u.id === selectedUnit)?.name}</span>
                      </CardTitle>
                      <CardDescription>{units.find((u) => u.id === selectedUnit)?.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="unit-content">Contenido de la unidad</Label>
                          <div className="mt-2 border rounded-lg p-4 bg-white h-80 overflow-hidden">
                            <Textarea
                              id="unit-content"
                              value={units.find((u) => u.id === selectedUnit)?.content || ""}
                              onChange={(e) => handleContentChange(e.target.value)}
                              placeholder="Escribe el contenido de la unidad aquí... Puedes usar Markdown para formatear el texto."
                              className="border-0 resize-none h-full focus:ring-0 overflow-y-auto"
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Soporte para Markdown: **negrita**, *cursiva*, # títulos, - listas, etc.
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-3">
                            <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Crear Actividad
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Nueva Actividad - Opción Múltiple</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Textarea
                                      id="question"
                                      label='Pregunta'
                                      value={newActivity.question}
                                      onChange={(e) => setNewActivity({ ...newActivity, question: e.target.value })}
                                      placeholder="Escribe tu pregunta aquí..."
                                      rows={3}
                                    />
                                  </div>
                                  <div className="grid gap-3">
                                    <Label>Opciones de respuesta</Label>
                                    <RadioGroup
                                      value={newActivity.correctAnswer.toString()}
                                      onValueChange={(value) =>
                                        setNewActivity({ ...newActivity, correctAnswer: Number.parseInt(value) })
                                      }
                                    >
                                      {newActivity.options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                          <Input
                                            value={option}
                                            onChange={(e) => {
                                              const newOptions = [...newActivity.options]
                                              newOptions[index] = e.target.value
                                              setNewActivity({ ...newActivity, options: newOptions })
                                            }}
                                            placeholder={`Opción ${index + 1}`}
                                            className="flex-1"
                                          />
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsActivityModalOpen(false)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={handleAddActivity}>Crear Actividad</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Upload className="w-4 h-4 mr-2" />
                                  Subir Material
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Subir Material</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                                    <input
                                      type="file"
                                      id={`materials-${selectedUnit}`}
                                      className="hidden"
                                      accept=".pdf,.docx,.xlsx"
                                      onChange={(e) => handleFileUpload(selectedUnit, "materials", e)}
                                    />
                                    <label htmlFor={`materials-${selectedUnit}`} className="cursor-pointer">
                                      <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                      <p className="text-sm text-slate-600">Haz clic para subir un archivo</p>
                                      <p className="text-xs text-slate-400">PDF, DOCX, XLSX hasta 10MB</p>
                                    </label>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsMaterialModalOpen(false)}>
                                    Cancelar
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activities and Materials Display */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Activities */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Actividades de la Unidad</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {units
                            .find((u) => u.id === selectedUnit)
                            ?.activities.map((activity) => (
                              <div key={activity.id} className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 mb-2">{activity.question}</p>
                                    <div className="space-y-1">
                                      {activity.options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-xs">
                                          {activity.correctAnswer === index ? (
                                            <Check className="w-3 h-3 text-green-600" />
                                          ) : (
                                            <X className="w-3 h-3 text-slate-400" />
                                          )}
                                          <span
                                            className={
                                              activity.correctAnswer === index
                                                ? "text-green-600 font-medium"
                                                : "text-slate-600"
                                            }
                                          >
                                            {option}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          {units.find((u) => u.id === selectedUnit)?.activities.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-8">
                              No hay actividades. Usa el botón "Crear Actividad" para agregar preguntas.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Materials */}
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-lg">Material de la Unidad</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {units
                            .find((u) => u.id === selectedUnit)
                            ?.materials.map((material) => (
                              <div
                                key={material.id}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border"
                              >
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-slate-600" />
                                  <div>
                                    <span className="text-sm text-slate-800 font-medium">{material.name}</span>
                                    <p className="text-xs text-slate-500">
                                      {(material.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          {units.find((u) => u.id === selectedUnit)?.materials.length === 0 && (
                            <p className="text-sm text-slate-500 text-center py-8">
                              No hay material. Usa el botón "Subir Material" para agregar archivos.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

  )
}
