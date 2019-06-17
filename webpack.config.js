import path from "path";

// Plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { DefinePlugin } from "webpack";

// Directory paths (absolute)
const srcDirectory = path.resolve(__dirname, "src");
const distDirectory = path.resolve(__dirname, "dist");

export default (env, argv) => webpackConfig(getOptions(env, argv));

// Map flags/env to a single options type.
//
// NOTE: the `env` object can be populated from the command line:
//
// ```
// webpack --env.production    # sets env.production == true
// webpack --env.platform=web  # sets env.platform == "web"
// ```
// https://webpack.js.org/configuration/configuration-types/
// https://webpack.js.org/api/cli#environment-options
const getOptions = (env, argv) => {
  // Maybe look at `process.env` here...
  return {
    production: argv.mode && argv.mode === "production",
    apiUrl: (env && env.apiUrl) || "https://jsonplaceholder.typicode.com/",
  };
};

const webpackConfig = options => ({
  // The base directory, an **absolute path**, for resolving entry
  // points and loaders from configuration.
  //
  // https://webpack.js.org/configuration/entry-context#context
  context: __dirname,

  // The entry object is where webpack looks to start building the bundle.
  //
  // https://webpack.js.org/configuration/entry-context#entry
  entry: {
    bundle: path.join(srcDirectory, "index.js"),
  },

  // The top-level output key contains set of options instructing webpack on
  // how and where it should output your bundles, assets and anything else
  // you bundle or load with webpack.
  //
  // https://webpack.js.org/configuration/output/
  output: {
    // The output directory as an **absolute** path.
    path: distDirectory,

    // The url to the output directory resolved relative to the HTML page.
    publicPath: "/",

    filename: "[name].js", // [name] is the object key in `entry` (above)
    //filename: "[name].[hash].js"
  },

  // Optimization settings.
  optimization: optimization(options),

  // Environment target.
  target: "web",

  // Loaders.
  module: {
    rules: [purescriptRule(options), cssRule(options)],
  },

  // Plugins.
  plugins: plugins(options),

  // Options for resolving module requests.
  // (does not apply to resolving loaders)
  // I.e. where to look for imports that aren't relative paths,
  // like `require('react')`
  resolve: {
    modules: ["node_modules"],
  },

  // `webpack-dev-server` configuration
  devServer: devServerConfig(options),

  // Don't watch everything.
  // Hopefully this helps with not hitting open file limits...
  watchOptions: {
    ignored: ["node_modules", ".spago"],
  },
});

// How to handle `.purs` files.
const purescriptRule = options => ({
  test: /\.purs$/,
  exclude: /node_modules/,
  use: [
    // TODO: I'm not sure how much of a difference this makes yet...
    { loader: "cache-loader", options: {} },

    {
      loader: "purs-loader",
      // https://github.com/ethul/purs-loader#options
      options: {
        // Why use `purescript-psa` instead of plain `purs`?
        // a) The output is nicer to look at
        // b) It lets us censor warnings we don't care about
        psc: "psa",
        // NOTE: uses `dargs`
        pscArgs: {
          codegen: "js,sourcemaps",
          "censor-codes": ["ImplicitQualifiedImportReExport"],
        },
        bundle: options.production,
        spago: true,
      },
    },
  ],
});

// How to handle styles.
const cssRule = options => ({
  test: /\.css/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: !options.production,
      },
    },
    { loader: "css-loader", options: {} },
  ],
});

const plugins = options => [
  // https://webpack.js.org/plugins/html-webpack-plugin/
  // https://github.com/jantimon/html-webpack-plugin#options
  new HtmlWebpackPlugin({
    // Generated file name
    filename: "index.html",
    // https://github.com/jantimon/html-webpack-plugin/blob/master/default_index.ejs
    template: path.join(srcDirectory, "index.ejs"),
  }),

  // https://webpack.js.org/plugins/mini-css-extract-plugin/
  new MiniCssExtractPlugin({}),

  // Constants defined at build time.
  // https://webpack.js.org/plugins/define-plugin/
  new DefinePlugin({
    API_URL: JSON.stringify(options.apiUrl),
  }),
];

// https://webpack.js.org/configuration/dev-server
const devServerConfig = _options => ({
  contentBase: distDirectory,
  port: 1234,
  stats: "errors-only",
  progress: true,
  inline: true,
  hot: true,
});

const optimization = options =>
  options.production
    ? {
        splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react",
              chunks: "all",
            },
          },
        },
      }
    : {};
