import {
  type SideMenuProps,
  useBlockNoteEditor,
  useComponentsContext,
} from "@blocknote/react";
import { Plus} from "lucide-react";
;
// Custom Side Menu button to remove the hovered block.
export function AddBlockButton(props: SideMenuProps) {
  const editor = useBlockNoteEditor();
  const Components = useComponentsContext()!;
  return (
    <Components.SideMenu.Button
      label="Add block"
      icon={
        <Plus
          size={24}
      onClick={() => {
        // Simula la apertura del menú lateral con sugerencias
        editor.sideMenu.show({
          block: props.block,
          triggerPosition: "bottom",
          showSuggestions: true, // ← Esto es clave
        });
      }}
        />
      }
    />
)
};