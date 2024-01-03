const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';



const config = {
    performance: {
        maxAssetSize: 10000000,
        maxEntrypointSize: 10000000,
        hints: 'error',
    },
    entry: './src/assets/js/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: "assets/js/[name].[contenthash].js",
        clean: true
    },
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
        hot: true,
        open: {
            target : '',
            app: {
                name: 'Opera',
                arguments: ['--incognito', '--new-window'],
              },
        }
    },
    plugins: [
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
                include: [
                    path.resolve(__dirname, 'assets')
                ],
                use: [stylesHandler, 'css-loader', 'style-loader'],
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
