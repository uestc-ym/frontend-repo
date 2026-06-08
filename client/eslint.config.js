import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['**/node_modules/**', '**/dist/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    rules: {
      // 'no-unused-vars': 'warn',
      // 'no-console': 'warn',
      // 'vue/multi-word-component-names': 'off',
      // 'no-var': 'error',
      // 'prefer-const': 'warn',
    },
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  pluginVue.configs['flat/essential'],
]);
