const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function (env) {
    const isProduction = env === 'prod';

    return {
        context: path.join(__dirname, "/Scripts/src/"),
        resolve: {
            extensions: ['.ts', '.js', '.css']
        },
        entry: {
            main: ['./index']
        },
        output: {
            publicPath: "Scripts/dist/" /*'C:/Projects/S24.Competition/S24.Competition.WebUi/Scripts/dist/'*/,
            path: path.join(__dirname, '/Scripts/dist/'),
            // path: path.join(__dirname, "/apps/competitions/Scripts/dist/"),
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
                    test: require.resolve('./Scripts/src/libs/cleditor1_4_5/jquery-cleditor.js'),
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
                    //exclude:'/node_modules/',                        
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: 'file-loader'
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        'file-loader'
                    ]
                }
            ]
        },
        plugins: isProduction
            ? [
                new webpack.LoaderOptionsPlugin({
                    minimize: true
                })
            ]
            : [
                new webpack.LoaderOptionsPlugin({
                    minimize: true
                }),
                // Clean dist folder.
                new CleanWebpackPlugin(["./Scripts/dist"], {
                    "verbose": true // Write logs to console.
                }),
                //avoid publishing when compilation failed
                new webpack.NoEmitOnErrorsPlugin(),

                new HtmlWebpackPlugin({
                    inject: "head",
                    filename: "../../Views/Shared/_Layout.cshtml",
                    template: "../../Views/Shared/_Layout_Template.cshtml"
                })
            ],
        //pretty terminal output
        stats: { colors: true }
    };
};