// eslint.config.js
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintPluginNuxt from 'eslint-plugin-nuxt'
import typescriptParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'

export default [
    {
        ignores: ['node_modules/**', '.nuxt/**', '.output/**', 'dist/**'],
    },
    {
        // Configuration for Vue files
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: typescriptParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            vue: eslintPluginVue,
            nuxt: eslintPluginNuxt,
            prettier: eslintPluginPrettier,
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'prettier/prettier': 'error',
        },
    },
    {
        // Configuration for JS/TS files
        files: ['**/*.{js,ts}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                defineNuxtConfig: 'readonly',
                defineNuxtPlugin: 'readonly',
                definePageMeta: 'readonly',
                useRuntimeConfig: 'readonly',
                useRoute: 'readonly',
                useRouter: 'readonly',
                ref: 'readonly',
                computed: 'readonly',
                reactive: 'readonly',
                onMounted: 'readonly',
                watch: 'readonly',
            },
        },
        plugins: {
            vue: eslintPluginVue,
            nuxt: eslintPluginNuxt,
            prettier: eslintPluginPrettier,
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'prettier/prettier': 'error',
        },
    },
]
