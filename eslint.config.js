import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly'
      }
    },
    plugins: {
      vue: pluginVue
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn'
    }
  },
  ...pluginVue.configs['flat/essential'],
  {
    ignores: [
      'dist/',
      'node_modules/',
      '*.config.js'
    ]
  }
]