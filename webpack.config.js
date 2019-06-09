import path from "path";

// Plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

// Directory paths (absolute)
const srcDirectory = path.resolve(__dirname, "src");
const distDirectory = path.resolve(__dirname, "dist");

// NOTE: the `env` object can be populated from the command line:
//
// ```
// webpack --env.production    # sets env.production == true
// webpack --env.platform=web  # sets env.platform == "web"
// ```
// https://webpack.js.org/configuration/configuration-types/
// https://webpack.js.org/api/cli#environment-options
export default function(env, argv) {
  return {
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
    optimization: optimization(env, argv),

    // Environment target.
    target: "web",

    // Loaders.
    module: {
      rules: [purescriptRule(env, argv), cssRule(env, argv)],
    },

    // Plugins.
    plugins: plugins(env, argv),

    // Options for resolving module requests.
    // (does not apply to resolving to loaders)
    // I.e. where to look for imports that aren't relative paths,
    // like `require('react')`
    resolve: {
      modules: ["node_modules"],
    },

    // `webpack-dev-server` configuration
    devServer: devServerConfig(env, argv),

    // Don't watch everything.
    // Hopefully this helps with not hitting open file limits...
    watchOptions: {
      ignored: ["node_modules", ".psc-package"],
    },
  };
}

// How to handle `.purs` files.
function purescriptRule(_env, _argv) {
  return {
    test: /\.purs$/,
    exclude: /node_modules/,
    use: [
      // TODO: I'm not sure how much of a difference this makes yet...
      { loader: "cache-loader", options: {} },

      // https://github.com/ethul/purs-loader
      {
        loader: "purs-loader",
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
          bundle: false,
          // NOTE: the example in `purs docs --help` is a good reference for
          // how these globs should look.
          src: [
            path.join(".psc-package", "*", "*", "*", "src", "**", "*.purs"),
            //         ^^^^^^^^^^^^
            // Change this if you're using bower or spago or whatever
            path.join(srcDirectory, "purs", "**", "*.purs"),
          ],
        },
      },
    ],
  };
}

// How to handle styles.
function cssRule(env, argv) {
  return {
    test: /\.css/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: argv.mode === "development",
        },
      },
      { loader: "css-loader", options: {} },
    ],
  };
}

function plugins(_env, _argv) {
  return [
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
  ];
}

// https://webpack.js.org/configuration/dev-server
function devServerConfig(_env, _argv) {
  return {
    contentBase: distDirectory,
    port: 4009,
    stats: "errors-only",
    progress: true,
    inline: true,
    hot: true,
  };
}

function optimization(_env, argv) {
  return argv.mode === "production"
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
}
