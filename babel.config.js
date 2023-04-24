module.exports = {
  presets: ['babel-preset-expo'],
  env: {
    test: {
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', { loose: true }],
      ],
    },
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};