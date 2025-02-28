const webpack = require('webpack');

const debug = process.env.NODE_ENV !== 'production';
module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    runtimeCompiler: true,
    configureWebpack: {
        plugins: [
            
        ]
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "@/style/global.scss";`,
            },
        },
    },
};
