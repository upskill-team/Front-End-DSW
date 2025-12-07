import { FileText, X, Upload } from "lucide-react";
import { Dialog, DialogHeader, DialogTitle } from "../../ui/Dialog.tsx";
import Button from "../../ui/Button/Button.tsx";
import Input from "../../ui/Input.tsx";

type Material = {
  id: number | string;
  name: string;
  file?: File;
  url?: string;
}


export default function UnitModalUpload({
  isMaterialModalOpen,
  setIsMaterialModalOpen,
  stagedMaterials,
  setStagedMaterials,
  handleFileSelect,
  handleRemoveStagedFile,
  handleTitleChange,
  handleAddMaterials,
}: {
  isMaterialModalOpen: boolean;
  setIsMaterialModalOpen: (open: boolean) => void;
  stagedMaterials: Material[];
  setStagedMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveStagedFile: (id: number | string) => void
  handleTitleChange: (id: number | string, newTitle: string) => void;
  handleAddMaterials: () => void;
}) {
  return (
    <Dialog open={isMaterialModalOpen} onOpenChange={setIsMaterialModalOpen}>
      <DialogHeader>
        <DialogTitle>Subir Materiales a la Unidad</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="material-files"
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-slate-400" />
              <p className="mb-2 text-sm text-slate-500">
                <span className="font-semibold">Haz clic o arrastra</span>
              </p>
              <p className="text-xs text-slate-400">PDF, DOCX, XLSX</p>
            </div>
            <input
              id="material-files"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.xlsx"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {stagedMaterials.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">
              Archivos seleccionados:
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto p-1">
              {stagedMaterials.map((material) => (
                <div
                  key={material.id}
                  className="space-y-2 p-3 rounded-lg bg-slate-100 border"
                > 
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate font-medium text-slate-600 flex items-center gap-2">
                      <FileText size={14} /> {material.file?.name || material.name}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-red-100"
                      onClick={() => handleRemoveStagedFile(material.id)}
                    >
                      <X className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                  <Input
                    id={`material-title-${material.id}`}
                    label="Título del material"
                    value={material.name}
                    onChange={(e) =>
                      handleTitleChange(material.id, e.target.value)
                    }
                    placeholder="Dale un nombre al material"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setIsMaterialModalOpen(false);
            setStagedMaterials([]);
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleAddMaterials}
          disabled={stagedMaterials.length === 0}
        >
          Añadir{" "}
          {stagedMaterials.length > 0 ? `(${stagedMaterials.length})` : ""}{" "}
          Materiales
        </Button>
      </div>
    </Dialog>
  );
}
