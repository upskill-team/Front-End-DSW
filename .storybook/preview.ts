import type { Preview } from '@storybook/react-vite'
import '../src/index.css'; // o donde tengas tu tailwind.css


const portalId = 'modal-portal';
if (!document.getElementById(portalId)) {
  const portalDiv = document.createElement('div');
  portalDiv.id = portalId;
  document.body.appendChild(portalDiv);
}

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', 
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  
  
};

export default preview;