module.exports = {
    entry: "./views/react/entry.js",
    output: {
        path: __dirname,
        filename: "public/script/bundle.js"
    },
    module: {
	  loaders: [
	    {
	      test: /\.jsx?$/,
	      exclude: /(node_modules|bower_components)/,
	      loader: 'babel',
	      query: {
	      	presets: ['es2015', 'react']
	      }
	    }
	  ]
	}
};