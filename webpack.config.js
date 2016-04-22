'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');

module.exports = {
    context: __dirname + '/client',
    entry: './app.js',
    output: {
        path: __dirname + '/public',
        filename: 'build.js',
        // library: 'app',
    },

    watch: NODE_ENV === 'development',

    devtool: NODE_ENV === 'development' ? 'source-map': null,

    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("[name].css")
    ],

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel?presets[]=es2015,plugins[]=transform-es2015-modules-commonjs,plugins[]=transform-runtime'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style','css!postcss!less')
            },
            {
              test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
              loader: 'file?name=[path][name].[ext]'
            },

        ]
    },
    postcss: function() {
        return [autoprefixer({ browsers: ['last 2 versions'] })];
    }
};


if (NODE_ENV === 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}