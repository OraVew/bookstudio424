module.exports = {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(mp4)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[hash][ext][query]',
        },
      });
      
      return config;
    },
  };