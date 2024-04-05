const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const WebpackAutoInject = require('webpack-auto-inject-version-next');

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';



const config = {
    performance: {
        maxAssetSize: 10000000,
        maxEntrypointSize: 10000000,
        hints: 'error',
    },
    entry: {
        'index': './src/assets/js/index.js',
        'main': './src/assets/js/main.const.js',
        'function': './src/assets/js/main.functions.js',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: "assets/js/[name].[contenthash].js",
        clean: true
    },
    devtool: "source-map",
    devServer: {
        host: 'localhost',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        historyApiFallback: true,
        watchFiles: ["./public/*"],
        port: "3000",
        hot: true
    },
    plugins: [
        new WebpackAutoInject({
            components: {
                AutoIncreaseVersion: true,
                InjectAsComment: false,
                InjectByTag: true
            },
            componentsOptions: {
                InjectByTag: {
                    fileRegex: /\.+/,
                    // regexp to find [AIV] tag inside html, if you tag contains unallowed characters you can adjust the regex
                    // but also you can change [AIV] tag to anything you want
                    AIVTagRegexp: /(\[AIV])(([a-zA-Z{} ,:;!()_@\-"'\\\/])+)(\[\/AIV])/g,
                    dateFormat: 'yyyy'
                }
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jquery: "jQuery",
            "window.jQuery": "jquery"
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),

        new CopyPlugin({
            
            patterns: [
                {
                    from: "./src/manifest.json",
                    globOptions: {
                        dot: true,
                        gitignore: true,
                    },
                    to: "./"
                },
                {
                    from: "./src/assets/css",
                    globOptions: {
                        dot: true,
                        gitignore: true,
                    },
                    to: "./assets/css"
                },
                {
                    from: "./src/assets/js",
                    globOptions: {
                        dot: true,
                        gitignore: true,
                        ignore: ["**/main.*", "**/index.js"]
                    },
                    to: "./assets/js"
                },
                {
                    from: "./src/assets/img",
                    globOptions: {
                        dot: true,
                        gitignore: true,
                    },
                    to: "./assets/img"
                }
            ],
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                include: [
                    path.resolve(__dirname, 'assets')
                ],
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                // include: [
                //     path.resolve(__dirname, 'assets')
                // ],
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                include: [
                    path.resolve(__dirname, 'assets')
                ],
                type: 'asset/resource',
            }
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        config.plugins.push(new MiniCssExtractPlugin());
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
