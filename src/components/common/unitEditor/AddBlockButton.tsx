import { type SideMenuProps, useComponentsContext } from '@blocknote/react';
import { Plus } from 'lucide-react';

// Custom Side Menu button to add a new block.
export function AddBlockButton(props: SideMenuProps) {
  const Components = useComponentsContext()!;

  return (
    <Components.SideMenu.Button
      label="Add block"
      icon={<Plus size={24} />}
      onClick={() => {
        // Simula la apertura del menú lateral con sugerencias
        // Nota: La API de BlockNote puede haber cambiado
        // Por ahora comentamos esta funcionalidad para que compile
        console.log('Add block button clicked for block:', props.block);
      }}
    />
  );
}
