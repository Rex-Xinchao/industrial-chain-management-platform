const webpack = require('webpack')
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery'
      }),
      /*new webpack.DefinePlugin({
       'process.env.assetUrl': BASE_URL
       })*/
    ]
  }
}
