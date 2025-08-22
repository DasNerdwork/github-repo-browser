import type { Preview } from '@storybook/react-vite';
import '../src/index.css'; // Tailwind importieren

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo', // 'todo' = show violations in test UI only
    },
  },
};

export default preview;