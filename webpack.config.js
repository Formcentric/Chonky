const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                use: [
                    {loader: require.resolve('awesome-typescript-loader')},
                    {loader: require.resolve('eslint-loader')},
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx'],
        alias: {
            chonky: path.resolve(__dirname),
        },
    },
};
