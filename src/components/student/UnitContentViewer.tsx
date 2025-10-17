import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import type { PartialBlock } from '@blocknote/core';
import { useEffect } from 'react';

interface UnitContentViewerProps {
  content: string;
}

/**
 * Componente para visualizar el contenido de una unidad en modo solo lectura.
 * Renderiza el contenido de BlockNote sin permitir edición.
 */
export default function UnitContentViewer({ content }: UnitContentViewerProps) {
  const editor = useCreateBlockNote();

  useEffect(() => {
    if (editor) {
      let blocksToLoad: PartialBlock[] = [];

      try {
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
      editor.replaceBlocks(editor.document, blocksToLoad);
    }
  }, [content, editor]);

  return (
    <div className="prose prose-slate max-w-none">
      <BlockNoteView editor={editor} editable={false} theme="light" />
    </div>
  );
}
