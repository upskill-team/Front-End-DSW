import { 
  useCreateBlockNote, 
  getDefaultReactSlashMenuItems, 
  SuggestionMenuController 
} from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import { filterSuggestionItems } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import type { Block, PartialBlock } from '@blocknote/core';
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
  
  const editor = useCreateBlockNote({});

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

  const forbiddenItems = ['Image', 'Video', 'Audio', 'File'];

  const getCustomSlashMenuItems = (query: string) => {
    const defaultItems = getDefaultReactSlashMenuItems(editor);
    const filteredItems = defaultItems.filter(
      (item) => !forbiddenItems.includes(item.title)
    );
    return filterSuggestionItems(filteredItems, query);
  };

  return (
    <div className="blocknote-editor-wrapper relative z-10">
      <BlockNoteView
        theme="light"
        editable={editable}
        editor={editor}
        onChange={() => {
          onChange(editor.document);
        }}
        slashMenu={false} 
      >
        <SuggestionMenuController
          triggerCharacter={'/'}
          getItems={async (query) => getCustomSlashMenuItems(query)}
        />
      </BlockNoteView>
    </div>
  );
}