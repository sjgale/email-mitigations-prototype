import * as Path from 'path'

module.exports = {
    mode: 'development',
    entry: Path.resolve(__dirname, './frontend/index'),
    devtool: 'inline-source-map',
    watch: true,
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: Path.resolve(__dirname, 'dist/client'),
    },
    plugins: []
}