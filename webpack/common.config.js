const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');

const rootDir = path.resolve(__dirname, '..');

const devWebpackConfig = require('./dev.config');
const package = require(`${rootDir}/package.json`);

const commonWebpackConfig = {
    entry: './src/index.tsx',
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(rootDir, 'dist'),
        chunkFilename: '[name].[chunkhash].bundle.js',
        publicPath: '/'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                react: {
                    test: /node_modules\/(react|react-dom)\//,
                    name: 'react',
                    chunks: 'initial',
                    enforce: true
                },
                vendors: {
                    test: new RegExp('node_modules/(' + [
                        'react-redux',
                        'react-router',
                        'react-router-dom',
                        'redux',
                        'history',
                        'packery',
                        'draggabilly',
                        'lodash',
                        'lodash-es',
                        'axios',
                        'qs',
                        'redux-actions',
                        'react-tabs',
                        'prop-types'
                    ].join('|') + ')/'),
                    name: 'vendors',
                    chunks: 'initial',
                    enforce: true
                },
                dates: {
                    test: new RegExp('node_modules/(' + [
                        'react-dates',
                        'moment',
                        'date-fns'
                    ].join('|') + ')/'),
                    name: 'dates',
                    chunks: 'initial',
                    enforce: true
                },
                editor: {
                    test: new RegExp('node_modules/(' + [
                        'rich-editor',
                        'slate',
                    ].join('|') + ')/'),
                    name: 'editor',
                    chunks: 'initial',
                    enforce: true
                },
                uikit: {
                    test: /node_modules\/entity-demo-ui\//,
                    name: 'ui',
                    chunks: 'initial',
                    enforce: true
                }
            }
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.json'],
        alias: {
            src: path.resolve(rootDir, 'src')
        }
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            use: [
                {
                    loader: 'awesome-typescript-loader'
                }
            ]
        }, {
            test: /\.(mp3)$/,
            use: [{
                loader: 'file-loader'
            }]
        }, {
            test: /\.(png|jpg|woff|woff2|eot|ttf|otf|webp)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    outputPath: 'assets',
                    name: '[name].[ext]'
                }
            }]
        }, {
            test: /node_modules\/react-dates\/.*\.css$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' }
            ]
        }, {
            test: /\.css$/,
            exclude: [/node_modules\/react-dates/],
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    import: false,
                    modules: true,
                    importLoaders: 1,
                    camelCase: true,
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                }
            }, {
                loader: 'postcss-loader'
            }]
        }, {
            test: /\.svg$/,
            oneOf: [{
                loader: 'svg-url-loader',
                issuer: {
                    test: /\.css$/
                }
            }, {
                use: 'svg-react-loader'
            }]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'src/layout/default.ejs')
        })
    ]
};

module.exports = (env) => {
    commonWebpackConfig.plugins.push(
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify(env.NODE_ENV),
            __TAG__: JSON.stringify(package.tag)
        })
    );

    if (['development', 'qa', 'production'].includes(env.NODE_ENV)) {
        return merge(devWebpackConfig, commonWebpackConfig);
    }

    if (env.ANALYZE) {
        commonWebpackConfig.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'report.html'
        }));
    }

    return commonWebpackConfig;
};
