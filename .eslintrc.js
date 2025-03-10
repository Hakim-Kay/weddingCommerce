module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended',
        'prettier',
    ],
    plugins: ['prettier'],
    rules: {
        'vue/multi-word-component-names': 'off',
        'prettier/prettier': 'error',
    },
}
