import { useCreateBlockNote } from "@blocknote/react";
// Or, you can use ariakit, shadcn, etc.
import { BlockNoteView } from "@blocknote/mantine";
// Default styles for the mantine editor
import "@blocknote/mantine/style.css";
// Include the included Inter font
import "@blocknote/core/fonts/inter.css";
import type { Block } from "@blocknote/core";
import { useState } from "react";
import { useUploadUnitFile } from "../../hooks/useUnits.ts";


// Nota: referencia para pasarlo a api/services/fileService.ts
/*async function uploadFile(file: File) {
  const body = new FormData();
  body.append("file", file);
  const ret = await fetch("https://tmpfiles.org/api/v1/upload", {
    method: "POST",
    body: body,
  });
  return (await ret.json()).data.url.replace(
    "tmpfiles.org/",
    "tmpfiles.org/dl/",
  );
}
*/

export default function UnitEditor({editable=true}:{editable?:boolean}) {
  // Stores the document JSON.
  const [blocks, setBlocks] = useState<Block[]>([]);
  const {mutateAsync:uploadFileToServer}= useUploadUnitFile()

  const uploadFile = async (file: File, blockId?: string): Promise<string> => {
      console.log("Subiendo archivo para el bloque:", blockId); // útil para debug
      const url = await uploadFileToServer(file);
      return url; // debe ser string (ej: "https://.../imagen.png")
  };
  console.log("Document JSON:", blocks);
  // Create a new editor instance
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "heading",
        content: "Nueva Unidad"
      },
      {
        type: "paragraph",
        content: "Escribe el contenido de la unidad aquí..."
      }
    ],
    uploadFile
  });
  // Render the editor
  return <BlockNoteView theme="light" editable={editable} editor={editor} onChange={()=>setBlocks(editor.document)} />;
}
