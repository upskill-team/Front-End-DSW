import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  framework: "@storybook/react-vite",

  viteFinal: async (config) => {
    // 2. Retornar la fusión de la config original con la tuya
    return mergeConfig(config, {
      test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./.storybook/vitest.setup.ts",
      },
    });
  }
};

export default config;
