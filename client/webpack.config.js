module.exports = {
    // your webpack configuration
    resolve: {
      fallback: {
        os: require.resolve("os-browserify/browser"),
        util: require.resolve("util/"),
        net: false,
        crypto: require.resolve("crypto-browserify"),
        tls: false
      }
    }
  };
  