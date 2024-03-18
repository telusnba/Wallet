// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');


const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = 'style-loader';

// let env_path = isProduction?`./.env`:`./.env.development`;

const config = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: ['process/browser'],
        }),
        new Dotenv(
            // {path: env_path,}
        )
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    resolve:{
        extensions: ['.ts', '.js'],
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer"),
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: [stylesHandler,'css-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
