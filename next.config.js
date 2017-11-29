const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader']
      },
      {
        test: /\.s(a|c)ss$/,
        use: ['babel-loader', 'raw-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['styles', 'node_modules']
                .map(d => path.join(__dirname, d))
                .map(g => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    );

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.API_HOST': JSON.stringify(process.env.API_HOST),
        'process.env.API_NAME': JSON.stringify(process.env.APP_NAME),
        'process.env.LOGLEVEL': JSON.stringify(process.env.LOGLEVEL),
        'process.env.ROMPR_API_URL': JSON.stringify(process.env.ROMPR_API_URL),
        'process.env.ROMPR_AUTH_URL': JSON.stringify(process.env.ROMPR_AUTH_URL),
        'process.env.NETSUITE_RESTLET_URL': JSON.stringify(process.env.NETSUITE_RESTLET_URL),
        'process.env.NETSUITE_USER': JSON.stringify(process.env.NETSUITE_USER),
        'process.env.NETSUITE_PW': JSON.stringify(process.env.NETSUITE_PW),
        'process.env.ITEMS_API_URL': JSON.stringify(process.env.ITEMS_API_URL)
      })
    );

    return config;
  }
};
