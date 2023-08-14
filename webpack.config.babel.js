import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
import path from 'path';
import fs from 'fs';
const ENV = process.env.NODE_ENV || 'development';

export default {
  context: path.resolve(__dirname, "src"),
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.jsx', '.js'],
    modules: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      'node_modules'
    ]
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: ["babel-plugin-transform-object-rest-spread"]
        }
      },
    ]
  },

  plugins: ([
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: { collapseWhitespace: false },
      inlineSource: '(.js|.css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
    {
      apply: (compiler) => {
        compiler.hooks.emit.tapAsync('AfterHtmlProcessingPlugin', (compilation, callback) => {
          console.log("DEBUGING IN AFTER HTML PROCESSING PLUGIN");

          const filePath = path.resolve(__dirname, "build/index.html");

          if (compilation.assets['index.html']) {
            const source = compilation.assets['index.html'].source();
            // const reportSource = compilation.assets['report.js'].source();
            const reportSource = fs.readFileSync(path.resolve(__dirname, 'resources/report.json'), 'utf8');

            const placeholderText = `
    //PLACEHOLDER_START
    window.UNIPROT_DIFF_REPORT = JSON_GOES_HERE;
    //PLACEHOLDER_END
            `.trim();

            const modifiedSource = source.replace(placeholderText, `window.UNIPROT_DIFF_REPORT = ${reportSource};`);

            //make directory if not exists
            if (!fs.existsSync(path.resolve(__dirname, "build"))) {
                fs.mkdirSync(path.resolve(__dirname, "build"));
            }

            fs.writeFileSync(path.resolve(__dirname, "build/modified.html"), modifiedSource, 'utf8');
          }

          callback();
        });
      }
    }
  ]),

  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  }
};
