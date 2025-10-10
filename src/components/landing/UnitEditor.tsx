import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import type { Block, PartialBlock } from '@blocknote/core';
import { useUploadUnitFile } from '../../hooks/useUnits.ts';
import { useEffect } from 'react';

interface UnitEditorProps {
  editable?: boolean;
  initialContent?: string;
  onChange: (blocks: Block[]) => void;
}

export default function UnitEditor({
  editable = true,
  initialContent,
  onChange,
}: UnitEditorProps) {
  const { mutateAsync: uploadFileToServer } = useUploadUnitFile();

  const uploadFile = async (file: File): Promise<string> => {
    const url = await uploadFileToServer(file);
    return url;
  };

  const editor = useCreateBlockNote({
    uploadFile,
  });

  useEffect(() => {
    if (editor) {
      let blocksToLoad: PartialBlock[] = [];
      if (initialContent) {
        try {
          const parsed = JSON.parse(initialContent);
          if (Array.isArray(parsed) && parsed.length > 0) {
            blocksToLoad = parsed;
          }
        } catch (e) {
          console.error(
            'El contenido inicial de la unidad no es un JSON válido.',
            e
          );
        }
      }

      const currentEditorContent = JSON.stringify(editor.document);
      if (currentEditorContent !== JSON.stringify(blocksToLoad)) {
        editor.replaceBlocks(editor.document, blocksToLoad);
      }
    }
  }, [editor, initialContent]);

  return (
    <div className="blocknote-editor-wrapper relative">
      <BlockNoteView
        theme="light"
        editable={editable}
        editor={editor}
        onChange={() => {
          onChange(editor.document);
        }}
      />
    </div>
  );
}
