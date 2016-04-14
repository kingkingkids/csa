var webpack = require('webpack');
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var path = require('path');
//var TransferWebpackPlugin = require('transfer-webpack-plugin');
//var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    //插件项
    plugins: [
        //new TransferWebpackPlugin([
        //    {from: 'dist', to: '../../app/platforms/android/assets/www/dist/'},
        //    {from: 'dist', to: '../../update/dist/'},
        //    {from: 'templates', to: '../../app/platforms/android/assets/www/templates/'}
        //], path.join(__dirname, ''))
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            mangle: false
        })
    ],
    //页面入口文件配置
    entry: {
        vendor: ['./js/entry.js']

    },
    //入口文件输出配置
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: './dist/',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass?sourceMap'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url?limit=819200'
            },
            {
                test: /\.woff/,
                loader: 'url?prefix=font/&limit=10000&mimetype=application/font-woff'
            }, {
                test: /\.ttf/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.eot/,
                loader: 'file?prefix=font/'
            }, {
                test: /\.svg/,
                loader: 'file?prefix=font/'
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.js/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
    //其它解决方案配置
    //, resolve: {
    //  //查找module的话从这里开始查找
    //  root: './libs/', //绝对路径
    //  extensions: ['', '.js', '.json', '.scss'],
    //  alias: {
    //    jquery: 'jquery/jquery-1.11.3.min.js',
    //    videojs: '../libs/video-js/4.10/video.js',
    //    videojsbackground: '../libs/video-js/4.10/videojs-background.min.js',
    //    jqueryui: '../libs/jquery-ui/jquery-ui.min.js',
    //    datepicker: '../libs/datepicker/js/datepicker.js'
    //  }
    //}
};



