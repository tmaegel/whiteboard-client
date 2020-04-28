const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true
    },
    // full build instead
    // Remove it for the runtime-only build
    // this will include additional JavaScript payload into your distribution
    // use precompiled Vue templates
    resolve: {
        alias: {
            'vue': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
    plugins: [
        // make sure to include the plugin!
        new VueLoaderPlugin()
    ]
};
