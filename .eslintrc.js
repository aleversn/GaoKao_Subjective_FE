module.exports = {
    root: true,
    env: {
        node: true,
        jquery: true,
    },
    extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
    parserOptions: {
        parser: 'babel-eslint',
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': 'off',
        'no-undef': 'off',
        'no-unused-components': 'off',
        'vue/no-unused-components': 'off',
        'no-global-assign': 'off',
        'no-empty': 'off',
    },
};
