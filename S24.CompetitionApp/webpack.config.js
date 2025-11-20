﻿const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
    const isProduction = env === 'prod';

    const plugins = [
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        // Добавляем ProvidePlugin для глобального доступа к jQuery
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        })
    ];

    if (!isProduction) {
        plugins.push(
            // Clean dist folder.
            new CleanWebpackPlugin(["./Scripts/dist"], {
                "verbose": true
            }),
            // Avoid publishing when compilation failed
            new webpack.NoEmitOnErrorsPlugin(),
        );
    };

    plugins.push(
        new HtmlWebpackPlugin({
            inject: "head",
            filename: "../../Views/Shared/_Layout.cshtml",
            template: "../../Views/Shared/_Layout_Template.cshtml",
            minify: isProduction && {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            templateParameters: {
                cspNonce: '<%= HttpContext.Current.Items["CSPNonce"] %>'
            }
        })
    );

    return {
        context: path.join(__dirname, "/Scripts/src/"),
        resolve: {
            extensions: ['.ts', '.js', '.css'],
            alias: {
                // Добавляем алиас для jQuery
                'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.js'),
            }
        },
        entry: {
            // Убеждаемся, что jQuery загружается первым
            main: [
                'jquery',
                './index'
            ]
        },
        output: {
            publicPath: "Scripts/dist/",
            path: path.join(__dirname, '/Scripts/dist/'),
            filename: isProduction ? 'build.min.js' : '[name].bundle.[chunkhash].js',
            chunkFilename: "[name].[chunkhash].js",

            // Defining a global var that can used to call functions from within ASP.NET Razor pages.
            library: ['app', 'cm'],
            libraryTarget: 'var'
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: require.resolve('jquery'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'jQuery'
                    },
                    {
                        loader: 'expose-loader',
                        options: '$'
                    }]
                },
                {
                    test: require.resolve('pikaday'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'Pikaday'
                    }]
                },
                {
                    test: require.resolve('./node_modules/jquery-bootgrid/dist/jquery.bootgrid.js'),
                    use: "imports-loader?$=jquery"
                },
                {
                    test: require.resolve('./Scripts/src/libs/jquery-multisortable.js'),
                    use: "imports-loader?$=jquery"
                },
                {
                    test: require.resolve('awesomplete'),
                    use: [{
                        loader: 'expose-loader',
                        options: 'Awesomplete'
                    }]
                },
                {
                    test: /\.less$/,
                    use: [{
                        loader: 'style-loader' // creates style nodes from JS strings
                    }, {
                        loader: 'css-loader' // translates CSS into CommonJS
                    }, {
                        loader: 'less-loader' // compiles Less to CSS
                    }]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/',
                            publicPath: 'Scripts/dist/images/'
                        }
                    }
                },
                {
                    // Правило для всех шрифтов включая Summernote
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 50000, // Увеличиваем лимит для шрифтов Summernote
                            fallback: 'file-loader',
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                            publicPath: '../fonts/', // Важно: относительный путь для CSS
                            esModule: false
                        }
                    }
                }
            ]
        },
        plugins: plugins,
        //pretty terminal output
        stats: { colors: true },

        // Оптимизация для продакшена
        optimization: isProduction ? {
            minimize: true,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    }
                }
            }
        } : {},
        
        // Настройки для лучшей производительности
        performance: {
            hints: isProduction ? "warning" : false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000
        }
    };
};