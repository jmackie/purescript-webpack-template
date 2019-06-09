import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";

const srcDirectory = path.resolve(__dirname, "src");
const distDirectory = path.resolve(__dirname, "dist");

// NOTE: the `env` object can be populated from the command line:
//
// ```
// webpack --env.production    # sets env.production == true
// webpack --env.platform=web  # sets env.platform == "web"
// ```
//
// https://webpack.js.org/configuration/
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
      bundle: path.join(srcDirectory, "index.js")
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

      filename: "[name].js" // [name] is the object key in `entry` (above)
      //filename: "[name].[hash].js"
    },

    // Environment target.
    target: "web",

    // Loaders.
    module: {
      rules: [purescriptRule(env, argv)]
    },

    // Plugins.
    plugins: plugins(env, argv),

    // Options for resolving module requests.
    // (does not apply to resolving to loaders)
    resolve: {
      modules: ["node_modules", srcDirectory]
    },

    // webpack-dev-server
    devServer: devServerConfig(env, argv)
  };
}

function purescriptRule(env, argv) {
  return {
    test: /\.purs$/,
    exclude: /node_modules/,
    use: [pursLoader(env, argv)]
  };
}

// https://github.com/ethul/purs-loader
function pursLoader(env, argv) {
  return {
    loader: "purs-loader",
    options: {
      pscArgs: { codegen: "js,sourcemaps" }, // uses `dargs`
      bundle: false,
      // NOTE: the example in `purs docs --help` is a good reference for
      // how these globs should look.
      src: [
        path.join(".psc-package", "*", "*", "*", "src", "**", "*.purs"),
        //         ^^^^^^^^^^^^
        // Change this if you're using bower or spago or whatever
        path.join(srcDirectory, "purs", "**", "*.purs")
      ]
    }
  };
}

function plugins(env, argv) {
  return [
    // https://webpack.js.org/plugins/html-webpack-plugin/
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      // Generated file name
      filename: "index.html",
      // https://github.com/jantimon/html-webpack-plugin/blob/master/default_index.ejs
      template: path.join(srcDirectory, "index.ejs")
    })
  ];
}

// https://webpack.js.org/configuration/dev-server
function devServerConfig(env, argv) {
  return {
    contentBase: distDirectory,
    port: 4009,
    stats: "errors-only",
    progress: true,
    inline: true,
    hot: true
  };
}
