import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import type { PartialBlock } from '@blocknote/core';
import { useEffect } from 'react';

interface UnitContentViewerProps {
  content: string; // JSON string de BlockNote
}

/**
 * Componente para visualizar el contenido de una unidad en modo solo lectura.
 * Renderiza el contenido de BlockNote sin permitir edición.
 */
export default function UnitContentViewer({ content }: UnitContentViewerProps) {
  
  // 2. El editor se crea una sola vez, pero ahora lo guardamos en una constante.
  const editor = useCreateBlockNote();

  // 3. Usamos useEffect para reaccionar a los cambios en la prop 'content'.
  useEffect(() => {
    if (editor) {
      let blocksToLoad: PartialBlock[] = [];

      try {
        // Parseamos el nuevo contenido que llega como prop
        const parsed = content ? JSON.parse(content) : [];
        if (Array.isArray(parsed) && parsed.length > 0) {
          blocksToLoad = parsed;
        } else {
            blocksToLoad = [{ type: 'paragraph', content: 'Esta unidad aún no tiene contenido.' }];
        }
      } catch (error) {
        console.error("Error al parsear el contenido de la unidad:", error);
        blocksToLoad = [{ type: 'paragraph', content: 'Error al cargar el contenido.' }];
      }

      // 4. Usamos el método del editor para reemplazar el contenido actual por el nuevo.
      //    Esto actualiza la vista de forma imperativa.
      editor.replaceBlocks(editor.document, blocksToLoad);
    }
  }, [content, editor]); // Este efecto se ejecuta cada vez que 'content' o 'editor' cambian.

  return (
    <div className="prose prose-slate max-w-none">
      <BlockNoteView editor={editor} editable={false} theme="light" />
    </div>
  );
}
