import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import type { PartialBlock } from '@blocknote/core';
import { useMemo } from 'react';

interface UnitContentViewerProps {
  content: string; // JSON string de BlockNote
}

/**
 * Componente para visualizar el contenido de una unidad en modo solo lectura.
 * Renderiza el contenido de BlockNote sin permitir edición.
 */
export default function UnitContentViewer({ content }: UnitContentViewerProps) {
  // Parsear el contenido una sola vez
  const initialContent = useMemo<PartialBlock[]>(() => {
    if (!content || content.trim() === '') {
      // Contenido vacío por defecto
      return [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'No hay contenido disponible para esta unidad.',
              styles: { italic: true },
            },
          ],
        },
      ];
    }

    try {
      const parsed = JSON.parse(content);

      // Validar que es un array y tiene contenido
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }

      // Si el array está vacío, devolver contenido por defecto
      return [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Esta unidad no tiene contenido aún.',
              styles: { italic: true },
            },
          ],
        },
      ];
    } catch (error) {
      console.error('Error al parsear el contenido de la unidad:', error);

      // En caso de error, mostrar el contenido como texto plano
      return [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Error al cargar el contenido de la unidad.',
              styles: { bold: true, textColor: 'red' },
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: content || 'Sin contenido',
              styles: {},
            },
          ],
        },
      ];
    }
  }, [content]);

  // Crear el editor con el contenido parseado
  const editor = useCreateBlockNote({
    initialContent,
  });

  return (
    <div className="prose prose-slate max-w-none">
      <BlockNoteView editor={editor} editable={false} theme="light" />
    </div>
  );
}
