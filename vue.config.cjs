module.exports = {
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.output.chunkFilename("js/uask.[id].[chunkhash:8].js");
  }
};
