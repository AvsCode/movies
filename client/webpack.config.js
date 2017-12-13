var path = require('path');

module.exports = {
    // Example setup for your project:
    // The entry module that requires or imports the rest of your project.
    // Must start with `./`!
    entry: './scripts/index.js',
    // Place output files in `./dist/my-app.js`
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'movies.js'
    },
    module: {
        loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-2']
                }
            }
        ]
    }
};